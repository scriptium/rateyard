from functools import wraps

import psycopg2
from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response,
    current_app
)
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from .db import (
    get_db, close_db, get_student, get_teacher
)

bp = Blueprint("admin", __name__)

def admin_token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        if identity['type']!='admin':
            return jsonify(msg='Admins only!'), 403
        else:
            return fn(*args, **kwargs)
    return wrapper

@bp.route("check_token", methods=("POST",))
@admin_token_required
def check_token():
    return jsonify(msg='ok')

@bp.route("/create_students", methods = ("POST", ))
@admin_token_required
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
@admin_token_required
def delete_students():
    if not request.is_json:
        abort(400, "Expected json")
    if type(request.json) != list:
        abort(400, "Expected array of students id")
    exec_str = '''
            DELETE FROM students
            WHERE False
            '''
    exec_args = []
    for student_id in request.json:
        print(student_id)
        exec_str += (" OR  id=%s")
        exec_args.append(student_id)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(exec_str, exec_args)
    db.commit()
    return jsonify({
        "result": "OK"
    }), 200
    '''
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
    '''


@bp.route("/edit_students", methods = ("POST", ))
@admin_token_required
def edit_students():
    print(request.json, flush=True)
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of students id")
        print("Expected array of students id", flush=True)
    for student in request.json:
        if ("id" in student.keys() and
                "username" in student.keys() and
                "full_name" in student.keys() and
                "email" in student.keys() and
                "class_id" in student.keys()):
            db = get_db()
            cursor = db.cursor()
            cursor.execute('''
                UPDATE students
                SET username=%s, full_name=%s, email=%s, class_id=%s
                WHERE id=%s RETURNING True;
                ''', (
                student["username"],
                student["full_name"],
                student["email"],
                student["class_id"],
                student["id"],
            ))
            if cursor.fetchone() is None:
                abort(400, 'There are not students with on of ids')
            db.commit()
            print("OK", flush=True)
        else:
            print("Wrong json", flush=True)
            abort(400, "Wrong json")
    return jsonify({
        "result": "OK"
    }), 201


@bp.route("/create_teacher", methods = ("POST", ))
@admin_token_required
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
        else:
            db.commit()
    else:
        abort(400, "Wrong json")
    return jsonify({
                "result": "OK"
            }), 201


@bp.route("/delete_teachers", methods = ("POST", ))
@admin_token_required
def delete_teachers():
    if not request.is_json:
        abort(400, "Expected json")
    if type(request.json) != list:
        abort(400, "Expected array of teachers id")
    exec_str = '''
            DELETE FROM teachers
            WHERE False
            '''
    exec_args = []
    for teacher_id in request.json:
        print(teacher_id)
        exec_str += (" OR  id=%s")
        exec_args.append(teacher_id)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(exec_str, exec_args)
    db.commit()
    return jsonify({
        "result": "OK"
    }), 200

@bp.route("/edit_teachers", methods = ("POST", ))
@admin_token_required
def edit_teachers():
    print(request.json, flush=True)
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of teachers id")
        print("Expected array of teachers id", flush=True)
    for teacher in request.json:
        if ("id" in teacher.keys() and
                "username" in teacher.keys() and
                "full_name" in teacher.keys() and
                "email" in teacher.keys()):
            db = get_db()
            cursor = db.cursor()
            cursor.execute('''
                UPDATE teachers
                SET username=%s, full_name=%s, email=%s
                WHERE id=%s RETURNING True;
                ''', (
                teacher["username"],
                teacher["full_name"],
                teacher["email"],
                teacher["id"],
            ))
            if cursor.fetchone() is None:
                abort(400, 'There are not teachers with on of ids')
            db.commit()
            print("OK", flush=True)
        else:
            print("Wrong json", flush=True)
            abort(400, "Wrong json")
    return jsonify({
        "result": "OK"
    }), 201

@bp.route("/delete_subjects", methods = ("POST", ))
@admin_token_required
def delete_subjects():
    if not request.is_json:
        abort(400, "Expected json")
    if type(request.json) != list:
        abort(400, "Expected array of subjects id")
    exec_str = '''
            DELETE FROM subjects
            WHERE False
            '''
    exec_args = []
    for subject_id in request.json:
        print(subject_id)
        exec_str += (" OR  id=%s")
        exec_args.append(subject_id)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(exec_str, exec_args)
    db.commit()
    return jsonify({
        "result": "OK"
    }), 200

@bp.route("/edit_subjects", methods = ("POST", ))
@admin_token_required
def edit_subjects():
    print(request.json, flush=True)
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of subjects id")
        print("Expected array of subjects id", flush=True)
    for subject in request.json:
        if ("id" in subject.keys() and
                "name" in subject.keys()):
            db = get_db()
            cursor = db.cursor()
            cursor.execute('''
                UPDATE subjects
                SET subject_name=%s
                WHERE id=%s RETURNING True;
                ''', (
                subject["name"],
                subject["id"],
            ))
            if cursor.fetchone() is None:
                abort(400, 'There are not subjects with on of ids')
            db.commit()
            print("OK", flush=True)
        else:
            print("Wrong json", flush=True)
            abort(400, "Wrong json")
    return jsonify({
        "result": "OK"
    }), 201

@bp.route("/set_class", methods = ("POST", ))
@admin_token_required
def set_class():
    if not request.is_json:
        abort("400", "Expected json")
    if("student_id" in request.json.keys() and
            "class_id" in request.json.keys()):
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            UPDATE students
            SET class_id=%s
            WHERE id=%s;
            ''', (
            request.json["class_id"],
            request.json["student_id"]
        ))
        db.commit()
        return jsonify({
            "result": "OK"
        }), 200
    else:
        abort(400, "Wrong json")


@bp.route("/create_class", methods = ("POST", ))
@admin_token_required
def create_class():
    if not request.is_json:
        abort("400", "Expected json")
    if "class_name" in request.json.keys():
        db = get_db()
        cursor = db.cursor()
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
        db.commit()
        print(class_id, flush=True)
        return jsonify({
            "class_id": class_id[0]
        }), 200
    else:
        abort(400, "Wrong json")


@bp.route("/delete_classes", methods = ("POST", ))
@admin_token_required
def delete_classes():
    if not request.is_json:
        abort(400, "Expected json")
    if type(request.json) != list:
        abort(400, "Expected array of classes id")
    exec_str = '''
            DELETE FROM classes
            WHERE False
            '''
    exec_args = []
    for class_id in request.json:
        print(class_id)
        exec_str += (" OR  id=%s")
        exec_args.append(class_id)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(exec_str, exec_args)
    db.commit()
    return jsonify({
        "result": "OK"
    }), 200


@bp.route("/edit_classes", methods = ("POST", ))
@admin_token_required
def edit_classes():
    print(request.json, flush=True)
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of classes id")
        print("Expected array of classes id", flush=True)
    for class_ in request.json:
        if ("id" in class_.keys() and
                "name" in class_.keys()):
            db = get_db()
            cursor = db.cursor()
            cursor.execute('''
                UPDATE classes
                SET class_name=%s
                WHERE id=%s RETURNING True;
                ''', (
                class_["name"],
                class_["id"],
            ))
            if cursor.fetchone() is None:
                abort(400, 'There are not classes with on of ids')
            db.commit()
            print("OK", flush=True)
        else:
            print("Wrong json", flush=True)
            abort(400, "Wrong json")
    return jsonify({
        "result": "OK"
    }), 201



@bp.route("/get_classes", methods = ("GET", ))
@admin_token_required
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


@bp.route("/get_groups", methods = ("GET", ))
@admin_token_required
def get_groups():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT gr.id, gr.group_name, cl.id, cl.class_name
        FROM groups as gr
        LEFT JOIN classes as cl ON gr.class_id = cl.id
        '''
    )
    exec_result = cursor.fetchall()
    if exec_result is None:
        return None
    result = [{
        "id": data[0],
        "name": data[1],
        "class": {
            "type": "Class",
            "id": data[2],
            "name": data[3]
        },
        "type": "Group"
        } for data in exec_result
    ]
    return jsonify(result), 200


@bp.route("/get_students", methods = ("GET", ))
@admin_token_required
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


@bp.route("/get_teachers", methods = ("GET", ))
@admin_token_required
def get_teachers():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT teachers.id, teachers.username, teachers.full_name, teachers.email
        FROM teachers;
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
        "type": "Teacher"
        } for data in exec_result
    ]
    return jsonify(result), 200


@bp.route("/get_subjects", methods = ("GET", ))
@admin_token_required
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
@admin_token_required
def create_subject():
    if not request.is_json:
        abort("400", "Expected json")
    if "subject_name" in request.json.keys():
        db = get_db()
        cursor = db.cursor()
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
        db.commit()
        return jsonify({
            "result": "OK"
        }), 200
    else:
        abort(400, "Wrong json")


@bp.route("/create_group", methods = ("POST", ))
@admin_token_required
def create_group():
    if not request.is_json:
        abort("400", "Expected json")
    if ("group_name" in request.json.keys() and
            "subject_id" in request.json.keys()):
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO groups (
                group_name, subject_id
            )
            VALUES (
                %s, %s
            ) RETURNING id;
            ''', (
            request.json["group_name"], 
            request.json["subject_id"], 
        ))
        group_id = cursor.fetchone()
        db.commit()
        print(group_id, flush=True)
        return jsonify({
            "group_id": group_id[0]
        }), 200
    else:
        abort(400, "Wrong json")

@bp.route("/add_students_to_group", methods = ("POST", ))
@admin_token_required
def add_students_to_group():
    if not request.is_json:
        abort("400", "Expected json")
    print(request.json, flush=True)
    if ("group_id" in request.json.keys() and
            "students_ids" in request.json.keys() and
            type(request.json["students_ids"]) != list):
        abort(400, "Expected group id and array of students ids")
    for student_id in request.json["students_ids"]:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO students_groups (
                student_id, group_id
            )
            VALUES (
                %s, %s
            );
            ''', (
            student_id, 
            request.json["group_id"], 
        ))
    db.commit()
    return jsonify({
        "result": "OK"
    }), 200


@bp.route("/add_teachers_to_group", methods = ("POST", ))
@admin_token_required
def add_teachers_to_group():
    if not request.is_json:
        abort("400", "Expected json")
    if ("group_id" in request.json.keys() and
            "teachers_ids" in request.json.keys() and
            type(request.json["teachers_ids"]) != list):
        abort(400, "Expected group id and array of teachers ids")
    for teacher_id in request.json["teachers_ids"]:
        db = get_db()
        cursor = db.cursor()
        cursor.execute('''
            INSERT INTO teachers_groups (
                teacher_id, group_id
            )
            VALUES (
                %s, %s
            );
            ''', (
            teacher_id, 
            request.json["group_id"], 
        ))
    db.commit()
    return jsonify({
        "result": "OK"
    }), 200
