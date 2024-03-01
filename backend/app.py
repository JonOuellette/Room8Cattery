import os

from flask import Flask, render_template, redirect, request, session, jsonify, g, flash, url_for
import stripe
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload

import requests
import re
import random

app = Flask(__name__)
app.app_context().push()

from secretkeys import MY_SECRET_KEY, STRIPE_API_KEY
from models import connect_db, User, db, Cat, Volunteer, Donation
from forms import RegisterForm, LoginForm, AddCatForm, VolunteerForm

CURR_USER_KEY = "curr_user"

app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost/Room8Cattery'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', MY_SECRET_KEY)
toolbar = DebugToolbarExtension(app)

stripe.api_key = STRIPE_API_KEY

connect_db(app)

####################################################
# User signup/login/logout

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

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]

@app.route('/signup', methods = ['GET', 'POST'])
def signup(): 
    """Handles user signup. 
        Creates new users and adds them to the database.
    """

    if CURR_USER_KEY in session:
        del session[CURR_USER_KEY]
    
    form = RegisterForm()

    if form.validate_on_submit():
        try:
            user = User.signup(
                username = form.username.data,
                password = form.password.data,
                email = form.email.data,
                first_name = form.first_name.data,
                last_name = form.last_name.data
            )
            db.session.commit()
        
        except IntegrityError as e:
            flash("Username already taken", 'danger'),
            return render_template('signup.html', form = form)
        
        user_login(user)

        return redirect("/")
    
    else: 
        return render_template('signup.html', form=form)

@app.route('/login', methods= ["GET", "POST"])
def login():
    """Handles user login"""

    form = LoginForm()

    if form.validate_on_submit():
        user = User.authenticate(form.username.data, form.password.data)

        if user:
            user_login(user)
            flash(f"Hello {user.username}!", "success")
            return redirect("/")
        
        flash("Invalid credentials", 'danger')
    
    return render_template('login.html' ,form=form)


@app.route('/logout', methods = ["GET", "POST"])
def logout():
    """Handles logging out user."""

    user_logout()

    flash("You have successfully logged out", 'success')

    return redirect("/login")

##############################################################################################################

@app.route('/')
def home():
    featured_cats = Cat.query.filter_by(is_featured = True).limit(4).all()
    
    featured_cats_data = [{
        'id': cat.id,
        'name': cat.name,
        'age': cat.age,
        'breed': cat.breed,
        'description': cat.description,
        'image_url': cat.image_url
    } for cat in featured_cats]

    return jsonify({
        'featured_cats': featured_cats_data,
        'message': 'Welcome to Room8Cattery!'
    })
#####################################################################################################################
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

        # Save this charge in your database
        donation = Donation(amount=amount, stripe_charge_id=charge['id'])
        db.session.add(donation)
        db.session.commit()

        return jsonify(charge), 200
    except stripe.error.StripeError as e:
        # Handle the error
        return jsonify(error=str(e)), 400

#####################################################################################################################
# Volunteer form - allows users to submit form indicating interest in volunteering

@app.route('/volunteer', methods=['POST'])
def volunteer():
    data = request.json  # Get data from POST request sent by React frontend
    form = VolunteerForm(meta={'csrf': False}, formdata=None, data=data)  # Disable CSRF for API usage

    if form.validate():
        volunteer = Volunteer(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=data.get('email'),
            phone=data.get('phone', ''),
            days_available=','.join(data.get('days_available', [])),  # Expecting an array of days from React
            start_date=datetime.strptime(data.get('start_date'), '%Y-%m-%d'),
            about=data.get('about', '')
        )
        db.session.add(volunteer)
        db.session.commit()
        return jsonify({'message': 'Thank you for applying to be a volunteer!'}), 200  # Send a success response
    else:
        return jsonify({'errors': form.errors}), 400  # Send back form validation errors
    


if __name__ == '__main__':
    app.run(debug=True)