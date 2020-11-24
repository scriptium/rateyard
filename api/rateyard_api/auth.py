import functools

from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response, 
    current_app
)
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    jwt_refresh_token_required, create_refresh_token,
)

from .db import get_db, close_db

bp = Blueprint("auth", __name__, url_prefix="/auth")

@bp.route("/login_student", methods = ("POST", ))
def login_student():
    if not request.is_json:
        abort(400, "Request is not json")
    login_form = ["username", "password"]
    print (request.json)
    if all(key in request.json.keys() for key in login_form):
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            SELECT id
            FROM students WHERE username=%s
            AND password_hash=crypt(%s, password_hash);
        ''', ( 
            request.json.get("username"),
            request.json.get("password")
            )
        )
        student_id = cursor.fetchone()
    else: 
        abort(400, "Wrong json")
    if student_id is None:
        abort(404, "Wrong login data")
    else:
        identity = {
            "type": "student",
            "id": student_id 
        }
        return jsonify({
            "access_token": create_access_token(identity=identity),
            "refresh_token": create_refresh_token(identity=identity)
        }), 200


@bp.route("/login_teacher", methods = ("GET", "POST"))
def login_teacher():
    if not request.is_json:
        abort(400, "Request is not json")
    login_form = ["username", "password"]
    if all(key in request.json.keys() for key in login_form):
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            SELECT id
            FROM teacher WHERE username=%s
            AND password_hash=crypt(%s, password_hash);
        ''', ( 
            request.json.get("username"),
            request.json.get("password")
            )
        )
        teacher_id = cursor.fetchone()
    else: 
        abort(400, "Wrong json")
    if teacher_id is None:
        abort(404, "Wrong login data")
    else:
        identity = {
            "type": "teacher",
            "id": teacher_id
        }
        return jsonify({
            "access_token": create_access_token(identity=identity),
            "refresh_token": create_refresh_token(identity=identity)
        }), 200


@bp.route("/refresh", methods=["POST"])
@jwt_refresh_token_required
def refresh():
    identity = get_jwt_identity()
    return jsonify({
        "access_token": create_access_token(identity=identity)
    }), 200