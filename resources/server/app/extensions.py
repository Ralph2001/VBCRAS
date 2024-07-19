from flask import jsonify
from flask import request
from flask import Blueprint
from sqlalchemy.exc import IntegrityError


from flask_marshmallow import Marshmallow

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

ma = Marshmallow()
jwt = JWTManager()
db = SQLAlchemy()