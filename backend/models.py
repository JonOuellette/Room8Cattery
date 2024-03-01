from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

DEFAULT_IMAGE_URL = "https://www.freeiconspng.com/uploads/cats-paw-icon-17.png" 

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String(15), nullable=False, unique = True)
    email = db.Column(db.String(40), nullable=False, unique=True)
    first_name = db.Column(db.String(25), nullable=False)
    last_name = db.Column(db.String(25), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    is_foster = db.Column(db.Boolean, default=False, nullable=False)

    fosters = db.relationship('Foster', backref='user', lazy=True)
    adoptions = db.relationship('Adoption', backref='user', lazy=True)


    def __repr__(self):
        return f"<User #{self.id}: {self.username}, {self.email}>"

    @classmethod
    def signup(cls, username, email, password, first_name, last_name):
        """Sign up user.

        Hashes password and adds user to system.
        """

        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            email=email,
            password=hashed_pwd,
            first_name = first_name,
            last_name = last_name
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

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False

class Admin(db.Model):
    __tablename__ = "admins"

    id = db.Column(db.Integer, primary_key = True)
    user_id = db.Column (db.Integer, db.ForeignKey('users.id'))
    

class Fosters(db.Model):
    __tablename__ = "fosters"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete="CASCADE"))
    cat_id = db.Column(db.Integer, db.ForeignKey('cats.id'), nullable=False)

    # Relationship to Cats
    cat = db.relationship('Cat', back_populates='foster')

class Cats(db.Model):
    __tablename__ = "cats"
    
    id = db.Column(db.Integer, primary_key = True)
    cat_name = db.Column(db.String, nullable = False)
    age = db.Column(db.Integer, nullable = False)
    breed = db.Column(db.String, nullable = False)
    description = db.Column(db.Text nullable = True)
    special_needs = db.Column(db.Text nullable = True)
    image_url = db.Column(db.Text, nullable = False, default = DEFAULT_IMAGE_URL)
    is_featured = db.Column(db.Boolean, default = False, nullable = False)
    foster_id = db.Column(db.Integer, db.ForeignKey("fosters.id"), nullable=False)

    # Reverse Relationship
    foster = db.relationship('Foster', back_populates='cat')
    # Relationship for adoptions
    adoptions = db.relationship('Adoption', backref='cat', lazy=True)

class Adoptions(db.Model):
    __tablename__ = "adoptions"

    id = db.Column(db.Integer, primary_key = True)
    cat_id = db.Column(db.Ineger, db.ForeignKey('cats.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    adopted = db.Column(db.Boolean)
    adoption_date = db.Column(db.Date)


def connect_db(app):
    """Connect this database to provided Flask app.

    You should call this in your Flask app.
    """

    db.app = app
    db.init_app(app)