from app import db
from models import User, Cat, Foster, Adoption, Volunteer, Donation
from flask_bcrypt import Bcrypt

# Create all tables
db.create_all()

# Create an instance of Bcrypt
bcrypt = Bcrypt()

DEFAULT_IMAGE_URL = "https://www.freeiconspng.com/uploads/cats-paw-icon-17.png" 

# Add one admin user
hashed_pwd = bcrypt.generate_password_hash('71l$S3m^O59j').decode('utf-8')
admin_user = User(username='adminuser', email='akaid01@hotmail.com', password=hashed_pwd, first_name='Admin', last_name='User', is_admin=True)
db.session.add(admin_user)

# Add some cats
cats = [
    Cat(cat_name='Whiskers', age=2, breed='Tabby', gender='Male', description='A playful little cat.', special_needs='', microchip=1234567890, cat_image=DEFAULT_IMAGE_URL, is_featured=True),
    Cat(cat_name='Shadow', age=5, breed='Black Shorthair', gender='Female', description='A loveable cuddly cat.', special_needs='', microchip=9876543210, cat_image=DEFAULT_IMAGE_URL, is_featured=False),
    Cat(cat_name='Sunny', age=1, breed='Siamese', gender='Male', description='Loves to sunbathe.', special_needs='', microchip=1928374650, cat_image=DEFAULT_IMAGE_URL, is_featured=True)
]

db.session.bulk_save_objects(cats)
db.session.commit()  # Ensure cats are committed to get their IDs

# Add a foster user
hashed_pwd_foster = bcrypt.generate_password_hash('fosterpassword').decode('utf-8')
foster_user = User(username='fosteruser', email='foster@example.com', password=hashed_pwd_foster, first_name='Foster', last_name='User', is_foster=True)
db.session.add(foster_user)
db.session.commit()  # Commit to save the foster user

# Assign cats to the foster
for cat in cats:
    new_foster = Foster(user_id=foster_user.id, cat_id=cat.id)
    db.session.add(new_foster)

db.session.commit()  # Commit changes for fosters
