from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from sqlalchemy.orm import validates
from sqlalchemy.schema import CheckConstraint
import re

db = SQLAlchemy()
bcrypt = Bcrypt()

DEFAULT_IMAGE_URL = "https://www.freeiconspng.com/uploads/cats-paw-icon-17.png" 

# class Foster(db.Model):
#     __tablename__ = "fosters"
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"), nullable=False)
#     cat_id = db.Column(db.Integer, db.ForeignKey('cats.id', ondelete="CASCADE"), nullable=False)
    


class User(db.Model):
    __tablename__ = "users"
    # This user model now can serve both as admin and foster
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(15), nullable=False, unique=True)
    email = db.Column(db.String(40), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(25), nullable=False)
    last_name = db.Column(db.String(25), nullable=False)
    phone_number = db.Column(db.BigInteger)
    is_admin = db.Column(db.Boolean, default=False)
    is_foster = db.Column(db.Boolean, default=False)

    fostered_cats = db.relationship('Cat', backref='foster_user', lazy='dynamic')

    def __repr__(self):
        return f"<User #{self.id}: {self.username}, {self.email}>"

    @classmethod
    def signup(cls, username, email, password, first_name, last_name, phone_number, is_admin=False, is_foster=False):
        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')
        """Sign up user.

        Hashes password and adds user to system.
        """
        
        user = User(
            username=username,
            email=email,
            password=hashed_pwd,
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            is_admin=is_admin,
            is_foster=is_foster
        )

        db.session.add(user)
        return user
    
    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.

        This is a class method (call it on the class, not an individual user.)
        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If can't find matching user (or if password is wrong), returns False.
        """
        user = cls.query.filter_by(username=username).first()

        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return False

    @validates('phone_number')
    def validate_phone_number(self, key, phone_number):
        assert len(str(phone_number)) == 10, "Phone number must be 10 digits"
        return phone_number
    
    @validates('email')
    def validate_email(self, key, email):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            raise ValueError('Invalid email format')
        return email
    
# class Admin(db.Model):
#     __tablename__ = "admins"

#     id = db.Column(db.Integer, primary_key = True)
#     user_id = db.Column (db.Integer, db.ForeignKey('users.id'))
    
class Cat(db.Model):
    __tablename__ = "cats"

    id = db.Column(db.Integer, primary_key=True)
    cat_name = db.Column(db.String, nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String, nullable=False)
    breed = db.Column(db.String, nullable=False)
    description = db.Column(db.Text, nullable=True)
    special_needs = db.Column(db.Text, nullable=True)
    microchip = db.Column(db.BigInteger)
    cat_image = db.Column(db.Text, nullable=False, default=DEFAULT_IMAGE_URL)
    is_featured = db.Column(db.Boolean, default=False, nullable=False)
    adopted = db.Column(db.Boolean, default=False, nullable=False)
    foster_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    foster = db.relationship('User', backref=db.backref('cats_fostered', lazy='dynamic'))
    
    __table_args__ = (
        CheckConstraint('age >= 0', name='age_positive'),
        CheckConstraint('microchip >= 0', name='microchip_positive'),
    )

class Adoption(db.Model):
    __tablename__ = "adoptions"

    id = db.Column(db.Integer, primary_key = True)
    cat_id = db.Column(db.Integer, db.ForeignKey('cats.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    adopted = db.Column(db.Boolean)
    adoption_date = db.Column(db.Date)

class Volunteer(db.Model):
    __tablename__ = 'volunteers'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    days_available = db.Column(db.String(50), nullable=True)  # Comma-separated days
    start_date = db.Column(db.Date, nullable=False)
    about = db.Column(db.Text, nullable=True)

    def __repr__(self):
        return f'<Volunteer {self.first_name} {self.last_name}>'
    

class Donation(db.Model):
    __tablename__ = 'donations'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer, nullable=False)  # Store amount in cents
    stripe_charge_id = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())


def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    db.app = app
    db.init_app(app)