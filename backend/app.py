import os
from flask import Flask, request, session, jsonify, g, abort, flash
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import stripe
import google.auth
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload
from flask_bcrypt import Bcrypt
from flask_cors import CORS
import requests
import re
import random

#importing keys from local file
# from secretkeys import MY_SECRET_KEY, MY_JWT_SECRET_KEY, STRIPE_API_KEY

# Environmental variables are used for sensitive information to enhance security
MY_SECRET_KEY = os.environ.get('MY_SECRET_KEY')
MY_JWT_SECRET_KEY = os.environ.get('MY_JWT_SECRET_KEY')
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')

from models import connect_db, User, db, Cat, Volunteer, Donation, Adoption
from forms import VolunteerForm, CatForm

# Global constants - these are used across the app, hence defined globally for easy access
CURR_USER_KEY = "curr_user"
DEFAULT_IMAGE_URL = "https://www.freeiconspng.com/uploads/cats-paw-icon-17.png"

# Initialize Flask extensions
migrate = Migrate()
jwt = JWTManager()

# Application Factory Function
def create_app(test_config=None):
    app = Flask(__name__)

     # Fetch the database URL from the environment and replace 'postgres://' with 'postgresql://'
    database_url = os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost/Room8Cattery')
    corrected_database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    #local variable to access database
    #SQLALCHEMY_DATABASE_URI=os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost/Room8Cattery'),

    app.config.from_mapping(
        SQLALCHEMY_DATABASE_URI=corrected_database_url,
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        SQLALCHEMY_ECHO=False,
        DEBUG_TB_INTERCEPT_REDIRECTS=False,
        SECRET_KEY=os.environ.get('SECRET_KEY', MY_SECRET_KEY),
        JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY', MY_JWT_SECRET_KEY),
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1),
    )
    # Test configuration:
    if test_config:
        # Overwrite default configuration with test configuration
        app.config.update(test_config)

    bcrypt = Bcrypt(app)
    # CORS(app, origins=["http://127.0.0.1:5173"], supports_credentials=True)
    CORS(app, origins=["https://room8cattery-1.onrender.com"], supports_credentials=True)
    
    jwt.init_app(app)
    connect_db(app)
    migrate.init_app(app, db) 
    stripe.api_key = STRIPE_API_KEY
####################################################
# Helper functions 

    #Helper function for role checks
    def is_admin(current_user = None):
        return (g.user and ( g.user.is_admin)) or (current_user and ( current_user["is_admin"]))

    def is_foster_or_admin(current_user = None):
        return (g.user and (g.user.is_foster or g.user.is_admin)) or (current_user and (current_user["is_foster"] or current_user["is_admin"]))

    def is_foster(current_user=None):
        # Checks if the current session user or the provided user object has foster status
        return (g.user and (g.user.is_foster)) or (current_user and (current_user["is_foster"]))

    # Google Sheets initialization:

    def initialize_google_sheets():
        scopes = ['https://www.googleapis.com/auth/spreadsheets']
        ##local path
        # service_account_file = os.path.join(os.getcwd(), 'config', 'room8cattery-397dd6b798b8.json')
        ### Render path
        service_account_file = '/etc/secrets/credentials.json'
        
        credentials = Credentials.from_service_account_file(
            service_account_file, scopes=scopes)

        service = build('sheets', 'v4', credentials=credentials)
        return service.spreadsheets()
    ####################################################
    # User signup/login/logout
    # Before each request, attach the current user to the global object if they're logged in
    @app.before_request
    def add_user_to_g():
        """If we're logged in, add curr user to Flask global."""

        if CURR_USER_KEY in session:
            g.user = User.query.get(session[CURR_USER_KEY])
        
        else:
            g.user = None

    def user_login(user):
        """Log in user"""

        session[CURR_USER_KEY] = user.id

    def user_logout():
        """Logout user"""
        session.pop(CURR_USER_KEY, None)
    

    @app.route('/api/users/create', methods=['POST'])
    @jwt_required()
    def create_user():
        current_user_id = get_jwt_identity()['id']
        current_user = User.query.get(current_user_id)

        # Ensure the current user has admin privileges
        if not current_user.is_admin:
            return jsonify({'error': 'Unauthorized, admin access required'}), 403

        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        phone_number = data.get('phone_number')
        is_foster = data.get('is_foster', False)
        is_admin = data.get('is_admin', False)

        # Validate user inputs
        if not all([username, email, password, first_name, last_name]) or not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return jsonify({'error': 'Invalid input'}), 400

        # Create the user
        try:
            new_user = User.signup(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                phone_number=phone_number,
                is_foster=is_foster,
                is_admin=is_admin  
            )
            db.session.add(new_user)
            db.session.commit()

            return jsonify({
                'message': 'User created successfully',
                'user': {
                    'id': new_user.id,
                    'username': new_user.username,
                    'email': new_user.email,
                    'first_name': new_user.first_name,
                    'last_name': new_user.last_name,
                    'is_foster': new_user.is_foster,
                    'is_admin': new_user.is_admin
                }
            }), 201
        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'error': 'This username or email is already used'}), 400

    @app.route('/login', methods=['POST'])
    def login():
        data = request.json
        username = data.get('username')
        password = data.get('password')
        
        user = User.authenticate(username, password)
        
        if user:
            # It's better to use a unique identifier for the identity
            access_token = create_access_token(identity={"id": user.id, 
                    "username": user.username, 
                    "is_admin": user.is_admin, 
                    "is_foster": user.is_foster })
            return jsonify({
                "access_token": access_token, 
                "user": {
                    "id": user.id, 
                    "username": user.username, 
                    "is_admin": user.is_admin, 
                    "is_foster": user.is_foster
                }
            }), 200
        else:
            return jsonify({"msg": "Invalid username or password"}), 401

    @app.route('/logout', methods=["POST"])
    def logout():
        """Handles logging out user."""
        session.pop(CURR_USER_KEY, None)  # This removes the key if it exists, and does nothing if it doesn't
        return jsonify({'success': True, 'message': 'You have successfully logged out'}), 200



    ##############################################################################################################

    @app.route('/')
    def home():
        featured_cats = Cat.query.filter_by(is_featured = True).limit(4).all()
        
        featured_cats_data = [{
            'id': cat.id,
            'name': cat.cat_name,
            'age': cat.age,
            'gender': cat.gender,
            'breed': cat.breed,
            'description': cat.description,
            'image_url': cat.cat_image
        } for cat in featured_cats]

        return jsonify({
            'featured_cats': featured_cats_data,
            'message': 'Welcome to Room8Cattery!'
        })

    ##############################################################################################################
    #USER ROUTES

    #fetches profile information of the user currently authenticated
    @app.route('/api/users/me', methods=['GET'])
    @jwt_required()
    def get_current_user_details():
        user_id = get_jwt_identity()['id']
        user = User.query.get_or_404(user_id)
        return jsonify({
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone_number': user.phone_number,
            'is_admin': user.is_admin,
            'is_foster': user.is_foster
        })
    # Allows admins to access other users profiles
    @app.route('/api/users/<int:user_id>', methods=['GET'])
    @jwt_required()
    def get_user(user_id):
        current_user = get_jwt_identity()
        if not is_admin(current_user): 
            return jsonify({"error": "Unauthorized"}), 401

        user = User.query.get_or_404(user_id)
        return jsonify({
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'phone_number': user.phone_number,
            'is_admin': user.is_admin,
            'is_foster': user.is_foster
        })

    @app.route('/api/fosters', methods=['GET'])
    @jwt_required()
    def get_all_fosters():
        # Ensure the requester is an admin
        current_user_id = get_jwt_identity()['id']
        current_user = User.query.get(current_user_id)
        if not current_user.is_admin:
            return jsonify({'error': 'Unauthorized'}), 403

        # Fetch all fosters
        fosters = User.query.filter_by(is_foster=True).all()
        fosters_data = []
        for foster in fosters:
            # Count the cats for each foster
            cat_count = Cat.query.filter_by(foster_id=foster.id).count()
            fosters_data.append({
                'id': foster.id,
                'first_name': foster.first_name,
                'last_name': foster.last_name,
                'cat_count': cat_count
            })

        return jsonify(fosters_data)

    @app.route('/api/admins', methods=['GET'])
    @jwt_required()
    def get_all_admins():
        # Ensure the requester is an admin
        current_user_id = get_jwt_identity()['id']
        current_user = User.query.get(current_user_id)
        if not current_user.is_admin:
            return jsonify({'error': 'Unauthorized'}), 403

        # Fetch all admins
        admins = User.query.filter_by(is_admin=True).all()
        admins_data = []
        for admin in admins:
            admins_data.append({
                'id': admin.id,
                'username': admin.username,
                'first_name': admin.first_name,
                'last_name': admin.last_name,
                'email': admin.email,
                'phone_number': admin.phone_number,
                'is_admin': admin.is_admin
            })

        return jsonify(admins_data)


    @app.route('/api/users/<int:user_id>/update', methods=['PATCH'])
    @jwt_required()  # Require authentication for this route
    def update_user_info(user_id):
        jwt_claims = get_jwt_identity()
        current_user_id = jwt_claims['id']
        current_user = User.query.get_or_404(current_user_id)

        # Only allow the user to update their own profile unless they're an admin
        if current_user_id != user_id and not current_user.is_admin:
            return jsonify({'error': 'Unauthorized'}), 403

        user_to_update = User.query.get_or_404(user_id)
        data = request.json
        print("USER TO UPDATE:", user_to_update)
        print("IS THE USER A FOSTER?",current_user.is_foster)

        try:
            # Allows fosters to update email and phone number
            if current_user.is_foster:
                # user_to_update.email = data.get('email', user_to_update.email)
                if 'email' in data:
                    user_to_update.email = data['email']
                user_to_update.phone_number = data.get('phone_number', user_to_update.phone_number)
            # Allows admin to update all user information including foster user information    
            elif current_user.is_admin:
                user_to_update.first_name = data.get('first_name', user_to_update.first_name)
                user_to_update.last_name = data.get('last_name', user_to_update.last_name)
                # user_to_update.email = data.get('email', user_to_update.email)
                if 'email' in data:
                    user_to_update.email = data['email'] 
                user_to_update.phone_number = data.get('phone_number', user_to_update.phone_number)
                user_to_update.is_foster = data.get('is_foster', user_to_update.is_foster)
                user_to_update.is_admin = data.get('is_admin', user_to_update.is_admin)
            
            db.session.commit()
            return jsonify({'message': 'User information updated successfully'}), 200
    
        except ValueError as e:
            # Handle the validation error
            db.session.rollback()  # Rollback the session to avoid inconsistent states
            return jsonify({'error': str(e)}), 400

    @app.route('/api/users/<int:user_id>', methods=['DELETE'])
    @jwt_required()
    def delete_foster(user_id):
        # Fetch the current user's details from the JWT token
        current_user_id = get_jwt_identity()['id']
        current_user = User.query.get(current_user_id)

        # Check if the current user is an admin
        if not current_user.is_admin:
            return jsonify({'error': 'Unauthorized, admin access required'}), 403

        # Fetch the user to be deleted from the database
        user_to_delete = User.query.get_or_404(user_id)

        # Check if the user to be deleted is a foster
        if not user_to_delete.is_foster:
            return jsonify({'error': 'The specified user is not a foster'}), 400
        
        if user_to_delete.fostered_cats.first() is not None:
            return jsonify({'error': 'User cannot be deleted because they have fostered cats'}), 400

        # Delete the user from the database
        db.session.delete(user_to_delete)
        db.session.commit()

        # Return a success response
        return jsonify({'message': f'Foster user with ID {user_id} has been successfully deleted'}), 200


    @app.route('/api/fosters/<int:foster_id>/cats', methods=['GET'])
    @jwt_required()
    def get_foster_cats(foster_id):
        jwt_claims = get_jwt_identity()
        current_user_id = jwt_claims['id']  
        current_user = User.query.get_or_404(current_user_id)  # Retrieves the User model instance based on JWT claims.
        
        print("######################Current User:", current_user)
        print("#####################Type:", type(current_user))

        if current_user.id != foster_id and not current_user.is_admin:
            return jsonify({'error': 'Unauthorized, foster access required'}), 403

        foster_cats = Cat.query.filter_by(foster_id=foster_id).all()
        print("################FOSTER CATS:", foster_cats)
        cats_data = [{
            'id': cat.id,
            'name': cat.cat_name,
            'age': cat.age,
            'gender': cat.gender,
            'breed': cat.breed,
            'description': cat.description,
            'special_needs': cat.special_needs,
            'cat_image': cat.cat_image,
            'is_featured': cat.is_featured,
            'adopted': cat.adopted
        } for cat in foster_cats]

        return jsonify(cats_data)

    @app.route('/api/users/<int:user_id>/password', methods=['PATCH'])
    @jwt_required()
    def change_password(user_id):
        current_user_id = get_jwt_identity()['id']
        if current_user_id != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        
        user = User.query.get_or_404(user_id)
        data = request.json
        old_password = data.get('old_password')
        new_password = data.get('new_password')
        
        if not user or not bcrypt.check_password_hash(user.password, old_password):
            return jsonify({'error': 'Current password is incorrect'}), 403
        # Update the password
        user.password = bcrypt.generate_password_hash(new_password).decode('UTF-8')
        db.session.commit()
        
        return jsonify({'message': 'Password updated successfully'}), 200


    ##############################################################################################################
    # Route for stripe donation button - using test key as this will be a test account.

    @app.route('/create-charge', methods=['POST'])
    def create_charge():
        try:
            # Amount in cents
            amount = int(request.json.get('amount', 0))
            
            # Create a charge: this will charge the user's card
            charge = stripe.Charge.create(
                amount=amount,
                currency='usd',
                source=request.json.get('token'),  # obtained with Stripe.js on the frontend
                description="Donation"
            )

        
            donation = Donation(amount=amount, stripe_charge_id=charge['id'])
            db.session.add(donation)
            db.session.commit()

            return jsonify(charge), 200
        except stripe.error.StripeError as e:
            # Handle the error
            return jsonify(error=str(e)), 400
    #####################################################################################################################
    # CAT ROUTES
        
    #Route to display list of adoptable cats
    @app.route('/api/cats/adoptable', methods=['GET'])
    def get_adoptable_cats():
        adoptable_cats = Cat.query.filter(Cat.adopted == False).all()
        cats_data = [{
            'id': cat.id,
            'name': cat.cat_name,
            'age': cat.age,
            'gender': cat.gender,
            'breed': cat.breed,
            'description': cat.description,
            'image_url': cat.cat_image
        } for cat in adoptable_cats]

        return jsonify(cats_data)

    #Cat Details route
    @app.route('/api/cats/<int:cat_id>', methods=['GET'])
    def get_cat_details(cat_id):
        cat = Cat.query.get_or_404(cat_id)
        print("***********************************GET CAT DETAILS CATS**************************", cat)
        cat_details = {
            'id': cat.id,
            'name': cat.cat_name,
            'age': cat.age,
            'gender': cat.gender,
            'breed': cat.breed,
            'description': cat.description,
            'special_needs': cat.special_needs,
            "microchip": cat.microchip,
            'cat_image': cat.cat_image,
            'foster_id': cat.foster_id,
            'foster_name': f"{cat.foster_user.first_name} {cat.foster_user.last_name}" if cat.foster_user else None,
            'is_featured': cat.is_featured
            
        }
        return jsonify(cat_details)

    # Route for either Fosters or Admins to add cats to the Adoptable list
    @app.route('/api/cats', methods=['POST'])
    @jwt_required()
    def add_cat():
        current_user = get_jwt_identity()
        current_user_id = current_user['id']
        print("AM I AN ADMIN", current_user_id)
        # Verify direct role and ID checks with is_foster_or_admin()
        if not is_foster_or_admin(current_user):
            return jsonify({'error': 'Unauthorized'}), 403

        # adding new cat
        data =request.get_json()
        form = CatForm(formdata=None, data=data)
        
        print("CAT DATA!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", data)
        new_cat = Cat(
            cat_name=form.cat_name.data,
            age=form.age.data,
            gender=form.gender.data,
            breed=form.breed.data,
            description=form.description.data,
            special_needs=form.special_needs.data,
            microchip=form.microchip.data,
            cat_image=form.cat_image.data,
            is_featured=form.is_featured.data,
            adopted=False,  # New cats are not adopted by default
            foster_id=current_user_id  # Set the current user as the foster
        )
        print(new_cat, "THIS IS THE NEW CAT!!!!!!!!!!!!!!!!!!!!!!!!!!")
        db.session.add(new_cat)
        db.session.commit()

        # Return success response
        return jsonify({'message': 'New cat added successfully'}), 201

    ### Only admins can update if Cat isAdopted
    @app.route('/api/cats/<int:cat_id>/adopt', methods=['PATCH'])
    @jwt_required()
    def update_cat_adoption(cat_id):
        current_user = get_jwt_identity()
        if not is_admin(current_user):
            return jsonify({'error': 'Unauthorized'}), 403

        cat = Cat.query.get_or_404(cat_id)
        cat.adopted = True
        db.session.commit()

        return jsonify({'message': 'Cat adoption status updated'}), 200

    @app.route('/api/cats/<int:cat_id>', methods=['PATCH'])
    @jwt_required()  # Require authentication for this route
    def update_cat_info(cat_id):
        # Get the identity of the currently logged in user from the JWT
        jwt_claims = get_jwt_identity()
        current_user_id = jwt_claims['id']
        current_user = User.query.get_or_404(current_user_id)
        cat = Cat.query.get_or_404(cat_id)
        
        data =request.get_json()

        # Check if the current user is the foster of the cat or an admin
        if not(current_user.id == cat.foster_id or current_user.is_admin):
            return jsonify({'error': 'Unauthorized'}), 403
        
        # Update cat information
        cat.cat_name = data.get('cat_name', cat.cat_name)
        cat.age = data.get('age', cat.age)
        cat.gender = data.get('gender', cat.gender)
        cat.breed = data.get('breed', cat.breed)
        cat.description = data.get('description', cat.description)
        cat.special_needs = data.get('special_needs', cat.special_needs)
        cat.microchip = data.get('microchip', cat.microchip)
        cat.cat_image = data.get('cat_image', cat.cat_image)

        # Only allow admins to change the cat's foster
        if is_admin():
            cat.is_featured = data.get('is_featured', cat.is_featured)
            cat.adopted = data.get('adopted', cat.adopted)  # Admin can set the cat as adopted
            cat.foster_id = data.get('foster_id', cat.foster_id)  # Admin can reassign the foster

        db.session.commit()
        return jsonify({'message': 'Cat updated successfully'}), 200

    @app.route('/api/cats/<int:cat_id>', methods=['DELETE'])
    @jwt_required()  # Ensure the user is logged in
    def delete_cat(cat_id):
        current_user = get_jwt_identity()
        
        # Only allow admins to delete cats
        if not is_admin(current_user):
            return jsonify({'error': 'Unauthorized'}), 403
        
        cat = Cat.query.get_or_404(cat_id)
        db.session.delete(cat)
        db.session.commit()
        return jsonify({'message': 'Cat deleted successfully'}), 200


    @app.route('/api/cats/featured', methods=['GET'])
    def get_featured_cats():
        """Endpoint for fetching featured cats."""
        featured_cats = Cat.query.filter_by(is_featured=True).limit(4).all()  # Adjust the limit as needed
        featured_cats_data = [
            {
                'id': cat.id,
                'name': cat.cat_name,
                'age': cat.age,
                'gender': cat.gender,
                'breed': cat.breed,
                'description': cat.description,
                'cat_image': cat.cat_image if cat.cat_image else DEFAULT_IMAGE_URL
            } for cat in featured_cats
        ]

        return jsonify(featured_cats_data)


    @app.route('/api/cats/<int:cat_id>/feature', methods=['PATCH'])
    @jwt_required()
    def toggle_cat_featured(cat_id):
        # Verify if the user is an admin
        
        current_user = get_jwt_identity()
        if not is_admin(current_user):
            return jsonify({'error': 'Unauthorized, admin access required'}), 403
        
        # Get the cat by ID
        cat = Cat.query.get_or_404(cat_id)
        
        # Toggle the 'is_featured' attribute
        cat.is_featured = not cat.is_featured
        db.session.commit()
        
        return jsonify({
            'id': cat.id,
            'is_featured': cat.is_featured
        }), 200

    @app.route('/api/cats/<int:cat_id>/reassign', methods=['POST'])
    @jwt_required()
    def reassign_cat(cat_id):
        jwt_claims = get_jwt_identity()
        current_user_id = jwt_claims['id']
        current_user = User.query.get_or_404(current_user_id)

        
        # Check if the current user is an admin
        if not current_user.is_admin:
            # Check if the current user is an admin
            return jsonify({'error': 'Unauthorized, admin access required'}), 403

        cat = Cat.query.get_or_404(cat_id)
        data = request.json
        new_foster_id = data.get('new_foster_id')

        if new_foster_id:
            new_foster = User.query.get(new_foster_id)
            if not new_foster:
                # Check if the new foster exists
                return jsonify({'error': 'New foster not found'}), 404
            
            if not new_foster.is_foster and not new_foster.is_admin:
                # Ensure the new user is either a foster or an admin
                return jsonify({'error': 'New user must be a foster or an admin'}), 400
            
        # else:
        #     # If no new foster is provided, make the admin the cat's foster
        #     new_foster_id = current_user.id    
        else:
            # If no new foster is provided, retain the current foster
            return jsonify({'error': 'New foster ID required'}), 400


        cat.foster_id = new_foster_id
        db.session.commit()

        updated_cat = Cat.query.get(cat_id)
        print("################REASSIGN CAT UPDATED CAT:", updated_cat)
        db.session.refresh(updated_cat)  # Refresh from the database to ensure data is updated
        return jsonify({
            'message': 'Cat reassigned successfully',
            'cat_id': updated_cat.id,
            'new_foster_id': updated_cat.foster_id,
            'new_foster_name': f"{new_foster.first_name} {new_foster.last_name}"
        }), 200


    ####################################################################################################################
    #exporting cat data to spreadsheets using Google SpreadSheets API

    @app.route('/api/export/cats')
    @jwt_required()
    def export_cats_to_sheet():
        # Get the identity of the current user
        current_user_id = get_jwt_identity()['id']
        current_user = User.query.get(current_user_id)
        print("********EXPORT CAT DATA CURRENT USER*******:", current_user )
        # Check if the current user is an admin
        if not current_user.is_admin:
            return jsonify({'error': 'Unauthorized, admin access required'}), 403

        spreadsheet_id = '1g3ZoPFgyB7uEeYFu446DlRj3ITIkKpy1SMgUNXPMrBI'  #Google Sheet ID
        range_name = 'Cats!A1'  

        # Fetch cats data from your database
        cats = Cat.query.all()
        values = [['ID', 'Name', 'Age', 'Gender', 'Breed', 'Description', 'Special Needs', 'Foster Name', 'Microchip']]  # Column headers
        for cat in cats:
            # Utilizing the relationship between Cats and Fosters like cat.foster to get foster's name
            foster_name = cat.foster.first_name + ' ' + cat.foster.last_name if cat.foster else 'N/A'
            values.append([cat.id, cat.cat_name, cat.age, cat.gender, cat.breed, cat.description, cat.special_needs, foster_name, cat.microchip])

        # Initialize Google Sheets API
        sheet = initialize_google_sheets()
        body = {'values': values}
        result = sheet.values().update(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='RAW',
            body=body).execute()

        # Construct the URL to the Google Sheet
        sheet_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}"

        return jsonify({'updated_cells': result.get('updatedCells'), 'sheet_url': sheet_url})


    @app.route('/api/export/fosters')
    @jwt_required()
    def export_fosters_to_sheet():

        current_user_id = get_jwt_identity()['id']
        current_user = User.query.get(current_user_id)
        print("********EXPORT FOSTER DATA CURRENT USER*******:", current_user )
        # Check if the current user is an admin
        if not current_user.is_admin:
            return jsonify({'error': 'Unauthorized, admin access required'}), 403

        spreadsheet_id = '12yvi-j8rOJoKeWdbyL_Z7AdBxaPs6Is4Hk6AGMOpK7k'  # Google Sheet ID
        range_name = 'Fosters!A1'

        # Fetch foster data from your database
        fosters = User.query.filter_by(is_foster=True).all()
        values = [['User ID', 'First Name', 'Last Name', 'Email', 'Phone Number']]  # Column headers
        for foster in fosters:
            values.append([foster.id, foster.first_name, foster.last_name, foster.email, foster.phone_number or ''])

        # Initialize Google Sheets API
        sheet = initialize_google_sheets()
        body = {'values': values}
        result = sheet.values().update(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='RAW',
            body=body).execute()

        # Construct the URL to the Google Sheet
        sheet_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}"

        # Return the URL along with the updated cells count
        return jsonify({'updated_cells': result.get('updatedCells'), 'sheet_url': sheet_url})

    @app.route('/api/export/volunteers')
    @jwt_required()
    def export_volunteers_to_sheet():
        # Get the identity of the current user
        current_user_id = get_jwt_identity()['id']
        current_user = User.query.get(current_user_id)
        
        # Check if the current user is an admin
        if not current_user.is_admin:
            return jsonify({'error': 'Unauthorized, admin access required'}), 403

        spreadsheet_id = '1g3ZoPFgyB7uEeYFu446DlRj3ITIkKpy1SMgUNXPMrBI'  # Google Sheet ID
        range_name = 'Volunteers!A1'

        # Fetch volunteer data from your database
        volunteers = Volunteer.query.all()
        values = [['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Days Available', 'Start Date', 'About']]  # Column headers
        for volunteer in volunteers:
            values.append([
                volunteer.id, 
                volunteer.first_name, 
                volunteer.last_name, 
                volunteer.email, 
                volunteer.phone or '', 
                volunteer.days_available or '', 
                volunteer.start_date.strftime('%Y-%m-%d') if volunteer.start_date else '',
                volunteer.about or ''
            ])

        # Initialize Google Sheets API
        sheet = initialize_google_sheets()
        body = {'values': values}
        result = sheet.values().update(
            spreadsheetId=spreadsheet_id,
            range=range_name,
            valueInputOption='RAW',
            body=body).execute()

        # Construct the URL to the Google Sheet
        sheet_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}"

        # Return the URL along with the updated cells count
        return jsonify({'updated_cells': result.get('updatedCells'), 'sheet_url': sheet_url})

    #####################################################################################################################
    # Volunteer form - allows users to submit form indicating interest in volunteering

    @app.route('/api/volunteer', methods=['POST'])
    def volunteer():
        data = request.json  # Get data from POST request sent by React frontend
        form = VolunteerForm(meta={'csrf': False}, formdata=None, data=data)  # Disable CSRF for API usage

        if form.validate():
            volunteer = Volunteer(
                first_name=data.get('first_name'),
                last_name=data.get('last_name'),
                email=data.get('email'),
                phone=data.get('phone', ''),
                days_available=','.join(data.get('days_available', [])),  # Gets an array of days from React
                start_date=datetime.strptime(data.get('start_date'), '%Y-%m-%d'),
                about=data.get('about', '')
            )
            db.session.add(volunteer)
            db.session.commit()
            return jsonify({'message': 'Thank you for applying to be a volunteer!'}), 200  # Send a success response
        else:
            return jsonify({'errors': form.errors}), 400  # Send back form validation errors
    
    return app

if __name__ == '__main__':
    flask_app = create_app()
    with flask_app.app_context():   #the only thing under this line is the commented out app.run(debug = True) statement everything else was added after 
        db.create_all()     # app.app_context(), and db.create_all() are commented out above where they initially were
        flask_app.run(debug=True)  #
    # app.run(debug=True)

