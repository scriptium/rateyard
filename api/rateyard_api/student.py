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
    SELECT s.id, s.subject_name, 
    m.id, m.points, m.edition_date, m.comment, m.is_read,
    mc.column_name,
    t.id, t.full_name
    FROM marks AS m
    INNER JOIN marks_columns AS mc ON m.column_id=mc.id
    INNER JOIN subjects AS s ON mc.subject_id=s.id
    INNER JOIN teachers AS t ON m.teacher_id=t.id
    WHERE m.student_id = %s;
    ''', (identity['id'], ))
    exec_result = cursor.fetchall()

    subjects = {}
    for data in exec_result:
        if not data[0] in subjects:
            subjects[data[0]] = {
                'id': data[0],
                'name': data[1],
                'type': 'Subject',
                'marks': [] 
            }
        subjects[data[0]]['marks'].append({
            'id': data[2],
            'points': data[3],
            'date': data[4],
            'comment': data[5],
            'is_read': data[6],
            'type_of_work': data[7],
            'type': 'MarkForStudent',
            'teacher': {
                'id': data[8],
                'full_name': data[9],
                'type': 'TeacherShort'
            }
        })
    response_json['subjects'] = list(subjects.values())
    
    return jsonify(response_json)