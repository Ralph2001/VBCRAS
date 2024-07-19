from datetime import timedelta

from flask import jsonify, render_template, request, Blueprint
from sqlalchemy.exc import IntegrityError
from flask_cors import CORS

from flask_marshmallow import Marshmallow

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

ma = Marshmallow()
jwt = JWTManager()
db = SQLAlchemy()
cors = CORS