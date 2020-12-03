import psycopg2

from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response,
    current_app
)
from flask_jwt_extended import jwt_required, get_jwt_identity

from .db import (
    get_db, close_db, get_student, get_teacher
)

bp = Blueprint("admin", __name__)

@bp.route("/create_student", methods = ("POST", ))
def create_student():
    if not request.is_json:
        abort("400", "Expected json")
    if ("username" in request.json.keys() and
            "full_name" in request.json.keys() and
            "email" in request.json.keys() and
            "password" in request.json.keys() and
            "class_id" in request.json.keys()):
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
        }), 201
    else:
        abort(400, "Wrong json")


@bp.route("/create_teacher", methods = ("POST", ))
def create_teacher():
    if not request.is_json:
        abort("400", "Expected json")
    if ("username" in request.json.keys() and
            "full_name" in request.json.keys() and
            "email" in request.json.keys() and
            "password" in request.json.keys()):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute('''
                INSERT INTO teachers (
                    username, 
                    full_name,
                    email, 
                    password_hash
                )
                VALUES (
                    %s, %s, %s, 
                    crypt(%s, gen_salt('md5'))
                );
                ''', (
                request.json.get("username"),
                request.json.get("full_name"),
                request.json.get("email"),
                request.json.get("password")
            ))
        except psycopg2.errors.UniqueViolation: 
            abort(409, "Teacher with same data already exists")
        except Exception:
            abort(400, "Unkonwn error")
        db.commit()
        return jsonify({
            "result": "OK"
        }), 201
    else:
        abort(400, "Wrong json")

@bp.route("/set_class", methods = ("POST", ))
def set_class():
    if not request.is_json:
        abort("400", "Expected json")
    if(request.json.get("student_id") in request.json.keys() and
            request.json.get("class_id") in request.json.keys()):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute('''
                UPDATE students
                SET class_id=%s
                WHERE id=%s
                ''', (
                request.json.get("class_id"),
                request.json.get("student_id")
            ))
        except Exception:
            abort(400, "Unkonwn error")
        db.commit()
        return jsonify({
            "result": "OK"
        }), 200
    else:
        abort(400, "Wrong json")