from functools import wraps

from flask import (Blueprint, json, request, jsonify, abort)
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
    SELECT DISTINCT s.id, s.subject_name
    FROM marks AS m
    INNER JOIN marks_columns AS mc ON m.column_id=mc.id
    INNER JOIN subjects AS s ON mc.subject_id=s.id
    WHERE m.student_id = %s;
    ''', (identity['id'], ))
    exec_result = cursor.fetchall()

    response_json['subjects'] = [{
        'id': data[0],
        'name': data[1],
        'type': 'Subject'
    } for data in exec_result
    ]
    
    return jsonify(response_json)

@bp.route("/get_marks", methods=("GET", ))
def get_marks():
    if not (
        request.is_json and
        type(request.json.get('subject_id')) == int
    ):
        abort(400, 'Expected json with subject_id as int')

    # identity = get_jwt_identity()
    identity = {
        'id': 3
    }
    cursor = db.get_db().cursor()

    cursor.execute('''
    SELECT m.id, m.points, m.edition_date,
    m.comment, mc.column_name,
    t.id, t.full_name
    FROM marks AS m
    INNER JOIN marks_columns AS mc ON m.column_id=mc.id
    INNER JOIN teachers as t ON m.teacher_id=t.id
    WHERE m.student_id=%s AND mc.subject_id=%s
    ''', (identity['id'], request.json['subject_id']))
    exec_result = cursor.fetchall()

    response_json = [{
        'id': data[0],
        'points': data[1],
        'date': data[2],
        'comment': data[3],
        'type_of_work': data[4] if not data[4] is None else '',
        'type': 'MarkForStudent',
        'teacher': {
            'id': data[5],
            'full_name': data[6],
            'type': 'TeacherShort'
        }
    } for data in exec_result
    ]

    return jsonify(response_json)