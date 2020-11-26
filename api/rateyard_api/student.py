import psycopg2

from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response,
    current_app
)
from flask_jwt_extended import jwt_required, get_jwt_identity

from .db import (
    get_db, close_db, get_student, get_teacher,
    create_student
)


bp = Blueprint("student", __name__)

@bp.route("/create", methods = ("POST", ))
def create():
    if not request.is_json:
        abort("400", "Expected json")
    data_form = ["username", "full_name", "email", "password", "class_id"]
    if all(key in request.json.keys() for key in data_form):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute('''
                INSERT INTO students (
                    username, 
                    full_name,
                    email, 
                    password_hash, 
                    class_id
                )
                VALUES (
                    %s, %s, %s, 
                    crypt(%s, gen_salt('md5')),
                    %s
                );
                ''', (
                request.json.get("username"),
                request.json.get("full_name"),
                request.json.get("email"),
                request.json.get("password"),
                request.json.get("class_id")
            ))
        except psycopg2.errors.UniqueViolation: 
            abort(409, "Student with same data already exists")
        except Exception:
            abort(400, "Unkonwn error")
        db.commit()
        return jsonify({
            "result": "OK"
        }), 200
    else:
        abort(400, "Wrong json")