from functools import wraps
from datetime import datetime

from flask import (Blueprint, json, request, jsonify, abort, current_app)
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

import db


bp = Blueprint("student", __name__)

def student_token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        if identity['type'] != 'student':
            return jsonify(msg='Students only!'), 403
        else:
            return fn(*args, **kwargs)
    return wrapper



@bp.route("/get_me", methods=("GET", ))
@student_token_required
def get_me():
    identity = get_jwt_identity()
    cursor = db.get_db().cursor()
    
    cursor.execute('''
    SELECT st.id, st.username, st.full_name, st.email, cl.id, cl.class_name
    FROM students AS st
    INNER JOIN classes AS cl ON cl.id=st.class_id
    WHERE st.id=%s;
    ''', (identity['id'], )
    )

    exec_result = cursor.fetchone()
    if exec_result == None:
        abort(400)

    response_json = {
        'id': exec_result[0],
        'username': exec_result[1],
        'full_name': exec_result[2],
        'email': exec_result[3],
        'class': {
        	'id': exec_result[4],
        	'name': exec_result[5],
        	'type': 'ClassShort'
        }
    }

    cursor.execute('''
    SELECT DISTINCT s.id, s.subject_name, (
        SELECT COUNT(1) FROM marks
        INNER JOIN marks_columns ON marks.column_id=marks_columns.id AND marks_columns.subject_id=s.id
        WHERE student_id=m.student_id AND is_read=False
    )
    FROM subjects AS s
    INNER JOIN marks_columns AS mc ON mc.subject_id=s.id
    INNER JOIN marks AS m ON m.column_id=mc.id AND m.student_id=%s;
    ''', (identity['id'], ))
    
    exec_result = cursor.fetchall()

    response_json['subjects'] = [{
        'id': data[0],
        'name': data[1],
        'new_marks': data[2],
        'type': 'Subject'
    } for data in exec_result
    ]
    
    return jsonify(response_json)

@bp.route("/edit_me", methods=("POST", ))
@student_token_required
def edit_me():
    if not request.is_json:
        abort(400, "Expected json")

    students_data_errors = db.check_students_data([request.json])
    if students_data_errors:
        return jsonify(students_data_errors[0]), 400

    db.edit_student(get_jwt_identity()['id'], request.json)
    return jsonify(result='ok')

@bp.route("/get_subject", methods=("POST", ))
@student_token_required
def get_marks():
    if not (
        request.is_json and
        type(request.json.get('id')) == int
    ):
        abort(400, 'Expected json with subject_id as int')

    identity = get_jwt_identity()
    cursor = db.get_db().cursor()

    cursor.execute(r'''
    SELECT m.id, m.points, m.edition_date, mc.column_date,
    m.comment, mc.column_name,
    t.id, t.full_name, m.is_read
    FROM marks AS m
    INNER JOIN marks_columns AS mc ON m.column_id=mc.id
    INNER JOIN teachers as t ON m.teacher_id=t.id
    WHERE m.student_id=%s AND mc.subject_id=%s
    ''', (identity['id'], request.json['id']))
    marks_exec_result = cursor.fetchall()

    cursor.execute(r'''
    SELECT subject_name FROM subjects WHERE id=%s;
    ''', (request.json['id'], ))
    subject_exec_result = cursor.fetchone()

    response_json = {
        'id': request.json['id'],
        'name': subject_exec_result[0],
        'marks': [
            {
                'id': data[0],
                'points': data[1],
                'edition_date': datetime.timestamp(data[2]),
                'date': datetime.timestamp(data[3]) if not data[3] is None else None,
                'comment': data[4],
                'type_of_work': data[5] if not data[5] is None else '',
                'type': 'MarkForStudent',
                'is_read': data[8],
                'teacher': {
                    'id': data[6],
                    'full_name': data[7],
                    'type': 'TeacherShort'
                }
            } for data in marks_exec_result
        ]
    }

    return jsonify(response_json)

@bp.route("/read_marks", methods=("POST", ))
@student_token_required
def read_marks():
    if not (
        request.is_json and
        type(request.json) == list and
        all(type(mark_id) == int for mark_id in request.json)
    ):
        abort(400, "Expected json with mark ids")
    
    database = db.get_db()
    cursor = database.cursor()

    exec_str = '''
    UPDATE marks
    SET is_read=True
    WHERE False
    '''

    exec_args = []

    for mark_id in request.json:
        exec_str += " OR id=%s"
        exec_args.append(mark_id)

    cursor.execute(exec_str, exec_args)

@bp.route("/send_verification_email", methods=("POST", ))
def send_verification_email():
    if not (request.is_json and 'username' in request.json.keys()):
        abort(400, 'Expected username in json.')
    database = db.get_db()
    cursor = database.cursor()
    cursor.execute('''
    SELECT email, full_name, password_hash, id 
    FROM students WHERE username=%s;
    ''', (request.json['username'], ))
    exec_result = cursor.fetchone()
    if exec_result is None:
        abort(400, description='This user does not exist.')
    current_app.extensions['email_verifier'].add_verifiable_user(
        exec_result[0], 
        exec_result[1],
        exec_result[2]
    )
    return jsonify({"email": exec_result[0], "id": exec_result[3]}), 200

@bp.route("/verify", methods=("POST", ))
def verify():
    if not request.is_json: abort(400, 'Expected json')
    if not 'code' in request.json.keys() or not 'email' in request.json.keys():
        abort(400, 'Expected code and email json objects.')
    verify_result = current_app.extensions['email_verifier'].verify(
        request.json['email'],
        request.json['code']
    )
    if verify_result is None:
        return jsonify({"message": "Wrong code"}), 400
    return jsonify({"verify_result": verify_result}), 200

@bp.route("/change_password", methods=("POST", ))
def change_password():
    if not request.is_json: abort(400, 'Expected json')
    if not 'password' in request.json.keys() or not 'id' in request.json.keys():
        abort(400, 'Expected password and id in json')

    db.edit_student(request.json['id'], {"password": request.json['password']})
    return jsonify(result='ok')


@bp.route("/check_token", methods=("GET",))
@student_token_required
def check_token():
    return jsonify(msg='ok')
    