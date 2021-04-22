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
    SELECT st.id, st.username, st.full_name, st.email, cl.id, cl.class_name, st.email_verified
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
        'email_verified': exec_result[6],
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
    t.id, t.full_name, m.is_read,
    mc.creation_date
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
                'column_creation_date': datetime.timestamp(data[9]),
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
    WHERE (False
    '''

    exec_args = []

    for mark_id in request.json:
        exec_str += " OR id=%s"
        exec_args.append(mark_id)
    

    exec_str += r') AND student_id=%s;'
    exec_args.append(get_jwt_identity()['id'])
    cursor.execute(exec_str, exec_args)
    database.commit()
    return jsonify(result='OK')


@bp.route('send_reset_password_code', methods=("POST", ))
def send_reset_password_code():
    if not (
        request.is_json and
        type(request.json.get('email')) is str
    ):
        abort(400, 'Invalid json data')

    cursor = db.get_db().cursor()
    print(request.json)
    cursor.execute(r'''
    SELECT id, full_name FROM students WHERE email=%s;
    ''', (request.json['email'], ))

    exec_result = cursor.fetchone()
    if exec_result is None:
        abort(400, 'Wrong email')

    current_app.extensions['student_reset_password_verifier'].add_verifiable_user(
        request.json['email'],
        exec_result[1],
        exec_result[0]
    )

    return jsonify(result='OK')


@bp.route('check_reset_password_code', methods=("POST", ))
def check_reset_password_code():
    if not (
        request.is_json and
        type(request.json['email']) is str and
        type(request.json['code']) is str
    ):
        abort(400, 'Invalid json data')

    check_result = current_app.extensions['student_reset_password_verifier'].check_code(
        request.json['email'], request.json['code']
    )
    if check_result is None:
        abort(400, 'Wrong email or code')

    return jsonify(result='OK')


@bp.route('reset_password', methods=("POST", ))
def reset_password():
    if not (
        request.is_json and
        type(request.json['email']) is str and
        type(request.json['code']) is str and
        type(request.json['new_password']) is str
    ):
        abort(400, 'Invalid json data')

    verify_result = current_app.extensions['student_reset_password_verifier'].verify(
        request.json['email'], request.json['code']
    )
    if verify_result is None:
        abort(402, 'Failed to verify')

    id_ = verify_result[1]
    if len(request.json['new_password']) == 0:
        abort(403, 'Password must\'t be empty')

    db.edit_student(id_, {'password': request.json['new_password']})
    return jsonify(result='OK')  

@bp.route("/check_token", methods=("GET",))
@student_token_required
def check_token():
    return jsonify(msg='ok')


@bp.route('send_email_verification_code', methods=('GET',))
@student_token_required
def send_verification_email_code():
    id_ = get_jwt_identity()['id']
    cursor = db.get_db().cursor()
    cursor.execute(r'''
    SELECT email, email_verified, full_name FROM students WHERE id=%s;
    ''', (id_, ))

    exec_result = cursor.fetchone()
    if exec_result[1]:
        abort(400, 'Email has already verified')

    if exec_result[0] is None:
        abort(400, 'Set email before verifying')

    current_app.extensions['student_email_verifier'].add_verifiable_user(
        exec_result[0],
        exec_result[2],
    )

    return jsonify(result='OK')

@bp.route('verify_email', methods=('POST',))
@student_token_required
def verify_email():
    if not (
        request.is_json and
        type(request.json['code']) is str
    ):
        abort(400, 'Invalid json data')

    id_ = get_jwt_identity()['id']
    database = db.get_db()
    cursor = database.cursor()
    cursor.execute(r'''
    SELECT email, email_verified FROM students WHERE id=%s;
    ''', (id_, ))

    exec_result = cursor.fetchone()
    if exec_result[1]:
        abort(400, 'Email has already verified')

    if exec_result[0] is None:
        abort(400, 'Set email before verifying')

    verify_result = current_app.extensions['student_email_verifier'].verify(exec_result[0], request.json['code'])
    if verify_result is None:
        abort(403, 'Wrong code')

    cursor.execute(r'''
    UPDATE students SET email_verified=true WHERE id=%s; 
    ''', (id_, ))
    database.commit()

    return jsonify(result='OK')
    
    