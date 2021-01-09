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


@bp.route("/create_students", methods = ("POST", ))
def create_students():
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of students")
        print("Expected array of students", flush=True)
    for student in request.json:
        if ("username" in student.keys() and
                "full_name" in student.keys() and
                "email" in student.keys() and
                "password" in student.keys() and
                "class_id" in student.keys()):
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
                    student["username"],
                    student["full_name"],
                    student["email"],
                    student["password"],
                    student["class_id"]
                ))
            except psycopg2.errors.UniqueViolation: 
                abort(409, "Student with same data already exists")
                print("Student with same data already exists", flush=True)
            except Exception as e:
                print(e, flush=True)
                abort(400, "Unknown error")
            else:
                db.commit()
                print("OK", flush=True)
        else:
            print("Wrong json", flush=True)
            abort(400, "Wrong json")
    return jsonify({
        "result": "OK"
    }), 201


@bp.route("/delete_students", methods = ("POST", ))
def delete_students():
    print(request.json, flush=True)
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of students id")
        print("Expected array of students id", flush=True)
    for student in request.json:
        if "student_id" in student.keys():
            db = get_db()
            cursor = db.cursor()
            try:
                cursor.execute('''
                    DELETE FROM students
                    WHERE id=%s RETURNING True
                    ''', (
                    student["student_id"], 
                ))
            except Exception as e:
                print(e, flush=True)
                abort(400, "Unknown error")
            else:
                db.commit()
                if cursor.fetchone() is None:
                    abort(400, 'There are not students with on of ids')
                print("OK", flush=True)
        else:
            print("Wrong json", flush=True)
            abort(400, "Wrong json")
    return jsonify({
        "result": "OK"
    }), 201


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
                request.json["username"],
                request.json["full_name"],
                request.json["email"],
                request.json["password"]
            ))
        except psycopg2.errors.UniqueViolation: 
            abort(409, "Teacher with same data already exists")
        except Exception:
            abort(400, "Unkonwn error")
        else:
            db.commit()
    else:
        abort(400, "Wrong json")
    return jsonify({
                "result": "OK"
            }), 201


@bp.route("/delete_teacher", methods = ("POST", ))
def delete_teacher():
    print(request.json, flush=True)
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if "teacher_id" in request.json.keys():
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute('''
                DELETE FROM teachers
                WHERE id=%s RETURNING True
                ''', (
                request.json["teacher_id"], 
            ))
        except Exception as e:
            print(e, flush=True)
            abort(400, "Unknown error")
        else:
            db.commit()
            if cursor.fetchone() is None:
                abort(400, 'There are no teachers with on of ids')
            print("OK", flush=True)
    else:
        print("Wrong json", flush=True)
        abort(400, "Wrong json")
    return jsonify({
        "result": "OK"
    }), 201



@bp.route("/set_class", methods = ("POST", ))
def set_class():
    if not request.is_json:
        abort("400", "Expected json")
    if("student_id" in request.json.keys() and
            "class_id" in request.json.keys()):
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute('''
                UPDATE students
                SET class_id=%s
                WHERE id=%s;
                ''', (
                request.json["class_id"],
                request.json["student_id"]
            ))
        except Exception as e:
            print(e, flush=True)
            abort(400, "Unkonwn error")
        db.commit()
        return jsonify({
            "result": "OK"
        }), 200
    else:
        abort(400, "Wrong json")


@bp.route("/create_class", methods = ("POST", ))
def create_class():
    if not request.is_json:
        abort("400", "Expected json")
    if "class_name" in request.json.keys():
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute('''
                INSERT INTO classes (
                    class_name
                )
                VALUES (
                    %s
                ) RETURNING id;
                ''', (
                request.json["class_name"],
            ))
            class_id = cursor.fetchone()
        except Exception as e:
            print(e, flush=True)
            abort(400, "Unknown Error")
        else:
            db.commit()
            print(class_id, flush=True)
            return jsonify({
                "class_id": class_id[0]
            }), 200
    else:
        abort(400, "Wrong json")


@bp.route("/delete_class", methods = ("POST", ))
def delete_class():
    if not request.is_json:
        abort("400", "Expected json")
    if "class_id" in request.json.keys():
        db = get_db()
        cursor = db.cursor()
        try:
            cursor.execute('''
                DELETE FROM classes
                WHERE id=%s RETURNING True
                ''', (
                request.json["class_id"], 
            ))
        except Exception as e:
            print(e, flush=True)
            abort(400, "Unknown error")
        else:
            db.commit()
            if cursor.fetchone() is None:
                abort(400, 'There is no class with this id')
            print("OK", flush=True)
    else:
        print("Wrong json", flush=True)
        abort(400, "Wrong json")
    return jsonify({
        "result": "OK"
    }), 201


@bp.route("/get_classes", methods = ("GET", ))
def get_classes():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT id, class_name
        FROM classes;
        '''
    )
    exec_result = cursor.fetchall()
    if exec_result is None:
        return None
    result = [{
        "id": data[0],
        "name": data[1],
        "type": "Class"
        } for data in exec_result
    ]
    return jsonify(result), 200


@bp.route("/get_students", methods = ("GET", ))
def get_students():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT students.id, students.username, students.full_name, 
               students.email, students.class_id, classes.class_name
        FROM students 
        LEFT OUTER JOIN classes ON students.class_id=classes.id;
    ''')
    exec_result = cursor.fetchall()
    print(exec_result, flush=True)
    if exec_result is None:
        return None
    result = [{
        "id": data[0],
        "username": data[1],
        "full_name": data[2],
        "email": data[3],
        "class": {
            "id": data[4],
            "name": data[5],
            "type": "Class"
        },
        "type": "Student"
        } for data in exec_result
    ]
    return jsonify(result), 200


@bp.route("/get_subjects", methods = ("GET", ))
def get_subjects():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT id, subject_name
        FROM subjects;
        '''
    )
    exec_result = cursor.fetchall()
    if exec_result is None:
        return None
    result = [{
        "id": data[0],
        "name": data[1],
        "type": "Subject"
        } for data in exec_result
    ]
    return jsonify(result), 200


@bp.route("/create_subject", methods = ("POST", ))
def create_subject():
    if not request.is_json:
        abort("400", "Expected json")
    if "subject_name" in request.json.keys():
        db = get_db()
        cursor = db.cursor()
        try:
             cursor.execute('''
                INSERT INTO subjects (
                    subject_name
                )
                VALUES (
                    %s
                );
                ''', (
                request.json["subject_name"],
            ))
        except Exception as e:
            print(e, flush=True)
            abort(400, "Unknown Error")
        db.commit()
        return jsonify({
            "result": "OK"
        }), 200
    else:
        abort(400, "Wrong json")