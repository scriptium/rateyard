from functools import wraps

import psycopg2
from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response,
    current_app
)
from flask_jwt_extended import jwt_required, get_jwt_identity

from .db import get_db, close_db, get_student, get_teacher


bp = Blueprint("api", __name__)

def json_obejcts_required(objects):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            if not request.is_json:
                raise ValueError
            if all(co in request.json.keys() for co in objects):
                return f(*args, **kwargs)
            abort(400)
        return wrapper
    return decorator