import psycopg2

from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response,
    current_app
)
from flask_jwt_extended import jwt_required, get_jwt_identity

from .db import (
    get_db, close_db, get_teacher
)


bp = Blueprint("teacher", __name__)


@bp.route("/get", methods = ("GET", ))
@jwt_required
def get():
    identity = get_jwt_identity()
    return jsonify(get_teacher(identity["id"])), 200