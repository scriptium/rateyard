from flask import (Blueprint, request, jsonify, 
    abort, Response, current_app
)
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    jwt_refresh_token_required, create_refresh_token,
)

from db import get_db, close_db

bp = Blueprint("auth", __name__)

@bp.route("/login_student", methods = ("POST", ))
def login_student():
    if not request.is_json:
        abort(400, "Request is not json")
    if ("username" in request.json.keys() and
            "password" in request.json.keys()):
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
        abort(403, "Wrong login data")
    else:
        identity = {
            "type": "student",
            "id": student_id[0]
        }
        response = jsonify(result="ok")
        response.headers["Access-Token"] = create_access_token(identity=identity)
        response.headers["Refresh-Token"] = create_refresh_token(identity=identity)
        return response


@bp.route("/login_teacher", methods = ("POST", ))
def login_teacher():
    if not request.is_json:
        abort(400, "Request is not json")
    if ("username" in request.json.keys() and
            "password" in request.json.keys()):
        db = get_db()
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            SELECT id
            FROM teachers WHERE username=%s
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
        abort(403, "Wrong login data")
    else:
        identity = {
            "type": "teacher",
            "id": teacher_id[0]
        }
        response = jsonify(result="ok")
        response.headers["Access-Token"] = create_access_token(identity=identity)
        response.headers["Refresh-Token"] = create_refresh_token(identity=identity)
        return response


@bp.route("/login_admin", methods = ("POST", ))
def login_admin():
    if not request.is_json:
        abort(400, "Request is not json")
    if ("username" in request.json.keys() and
            "password" in request.json.keys()):
        if(request.json.get("username") == current_app.config["ADMIN_USERNAME"] and
                request.json.get("password") == current_app.config["ADMIN_PASSWORD"]):
            identity = {
                "type": "admin",
            }
            response = jsonify(result="ok")
            response.headers["Access-Token"] = create_access_token(identity=identity)
            response.headers["Refresh-Token"] = create_refresh_token(identity=identity)
            return response
        else:
            abort(403, "Wrong login data")
    else:
        abort(400, "Wrong json")


@bp.route("/refresh", methods=("POST", "GET"))
@jwt_refresh_token_required
def refresh():
    identity = get_jwt_identity()
    response = jsonify(result="ok")
    response.headers["Access-Token"] = create_access_token(identity=identity)
    response.headers["Refresh-Token"] = create_refresh_token(identity=identity)
    return response