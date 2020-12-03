import psycopg2

from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response,
    current_app
)
from flask_jwt_extended import jwt_required, get_jwt_identity

from .db import get_db, close_db, get_student, get_teacher


bp = Blueprint("api", __name__)


