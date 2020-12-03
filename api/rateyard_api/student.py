import psycopg2

from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response,
    current_app
)
from flask_jwt_extended import jwt_required, get_jwt_identity

from .db import (
    get_db, close_db, get_student
)


bp = Blueprint("student", __name__)


@bp.route("/get_me", methods = ("GET", ))
@jwt_required
def get_me():
    identity = get_jwt_identity()
    return jsonify(get_student(identity["id"])), 200