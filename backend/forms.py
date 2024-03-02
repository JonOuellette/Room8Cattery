from flask_wtf import FlaskForm
from models import Cat, User
from wtforms import StringField, IntegerField, TextAreaField, BooleanField, SubmitField, SelectField, SelectMultipleField, widgets
from wtforms.validators import DataRequired, Length, Optional, NumberRange, InputRequired, Email, PasswordField, Optional, DateField, SubmitField
from wtforms_sqlalchemy.fields import QuerySelectField


class RegisterForm(FlaskForm):
    """Form for registering new users"""

    username = StringField('Username', validators=[InputRequired(), Length(min=5, max=15)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=6, max=20)])
    email = StringField('Email', validators = [InputRequired(), Email(), Length(max=40)])
    first_name = StringField('First Name', validators=[InputRequired(), Length(max =25)])
    last_name = StringField('Last Name', validators=[InputRequired(), Length(max=30)])

class LoginForm(FlaskForm):
    """Form to login users"""
    username = StringField('Username', validators=[InputRequired(), Length(min=5, max=15)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=6, max=20)])

class AddCatForm(FlaskForm):
    """Form to add cats"""
    cat_name = StringField('Cat Name', validators=[DataRequired(), Length(max=100)])
    age = IntegerField('Age', validators=[DataRequired(), NumberRange(min=0)])
    breed = StringField('Breed', validators=[DataRequired(), Length(max=100)])
    description = TextAreaField('Description', validators=[Optional(), Length(max=500)])
    special_needs = TextAreaField('Special Needs', validators=[Optional(), Length(max=500)])
    microchip = IntegerField("Microchip Number", validatiors =[Optional()])
    cat_image = StringField('Cat Image URL', validators=[DataRequired(), Length(max=255)])
    is_featured = BooleanField('Feature this Cat?', default=False)
    foster_id = SelectField('Foster', coerce=int, choices=[])  # You need to populate choices in the view or controller
    submit = SubmitField('Submit')

class AdoptionForm(FlaskForm):
    cat_id = QuerySelectField('Cat', query_factory=lambda: Cat.query.all(), get_label='cat_name', allow_blank=False, validators=[DataRequired()])
    user_id = QuerySelectField('User', query_factory=lambda: User.query.all(), get_label='username', allow_blank=False, validators=[DataRequired()])
    adopted = BooleanField('Adopted')
    adoption_date = DateField('Adoption Date', validators=[Optional()])
    submit = SubmitField('Submit')

class AdminForm(FlaskForm):
    user_id = QuerySelectField('User', query_factory=lambda: User.query.all(), get_label='username', allow_blank=False, validators=[DataRequired()])
    submit = SubmitField('Assign Admin')

class FosterForm(FlaskForm):
    user_id = QuerySelectField('User', query_factory=lambda: User.query.filter(User.is_foster == True).all(), get_label='username', allow_blank=False, validators=[DataRequired()])
    cat_id = QuerySelectField('Cat', query_factory=lambda: Cat.query.all(), get_label='name', allow_blank=False, validators=[DataRequired()])
    submit = SubmitField('Assign Foster')

class MultiCheckboxField(SelectMultipleField):
    widget = widgets.ListWidget(prefix_label=False)
    option_widget = widgets.CheckboxInput()

class VolunteerForm(FlaskForm):
    first_name = StringField('First Name', validators=[DataRequired()])
    last_name = StringField('Last Name', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    phone = StringField('Phone', validators=[Optional()])
    days_available = MultiCheckboxField('Days Available', choices=[('Mon', 'Monday'), ('Tue', 'Tuesday'), ('Wed', 'Wednesday'),
                                                                    ('Thu', 'Thursday'), ('Fri', 'Friday'), ('Sat', 'Saturday'),
                                                                    ('Sun', 'Sunday')], validators=[Optional()])
    start_date = DateField('Available Start Date', validators=[DataRequired()], format='%Y-%m-%d')
    about = TextAreaField('Tell us about yourself', validators=[Optional()])
    submit = SubmitField('Submit')