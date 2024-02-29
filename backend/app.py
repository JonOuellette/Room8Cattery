import os

from flask import Flask, render_template, redirect, request, session, jsonify, g, flash, url_for
from flask_debugtoolbar import DebugToolbarExtension
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import joinedload

import requests
import re
import random

app = Flask(__name__)
app.app_context().push()


CURR_USER_KEY = "curr_user"

app.config['SQLALCHEMY_DATABASE_URI'] = (
    os.environ.get('DATABASE_URL', 'postgresql://postgres:postgres@localhost/Room8Cattery'))

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', MY_SECRET_KEY)
toolbar = DebugToolbarExtension(app)