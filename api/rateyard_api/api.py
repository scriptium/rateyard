import psycopg2

from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response,
    current_app
)
from flask_jwt_extended import jwt_required, get_jwt_identity

from .db import get_db, close_db


bp = Blueprint("api", __name__)
'''
@bp.route("/create_class", methods("POST", ))
def
''' 

