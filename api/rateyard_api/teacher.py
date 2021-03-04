from functools import wraps

from flask import (Blueprint, json, request, jsonify, abort)
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

import db


bp = Blueprint("teacher", __name__)


def teacher_token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        if identity['type'] != 'teacher':
            return jsonify(msg='Teachers only!'), 403
        else:
            return fn(*args, **kwargs)
    return wrapper


@bp.route("/get_me", methods=("GET", ))
@teacher_token_required
def get_me():
    identity = get_jwt_identity()
    cursor = db.get_db().cursor()

    cursor.execute('''
    SELECT id, username, full_name, email FROM teachers WHERE id=%s;
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
    }
    cursor.execute('''
    SELECT g.id, g.group_name, c.id, c.class_name, s.id, s.subject_name
    FROM teachers_groups AS tg
    INNER JOIN groups AS g ON tg.group_id=g.id
    INNER JOIN classes AS c ON g.class_id=c.id
    INNER JOIN subjects AS s ON tg.subject_id=s.id
    WHERE tg.teacher_id=%s; 
    ''', (identity['id'], ))
    exec_result = cursor.fetchall()
    response_json['groups'] = [
        {
            'id': data[0],
            'name': data[1],
            'class': {
                'id': data[2],
                'name': data[3],
                'type': 'ClassShort'
            },
            'subject': {
                'id': data[4],
                'name': data[5],
                'type': 'Subject'
            },
            'type': 'groupShort'
        } for data in exec_result
    ]
    return jsonify(response_json)


@bp.route("/get_group_full", methods=("GET", ))
@teacher_token_required
def get_group_full():
    if (
        not request.is_json or
        not "id" in request.json.keys() or
        type(request.json["id"]) != int
    ):
        abort(400)

    result_json = db.get_group_full()
    if result_json is None:
        abort(400)
    cursor = db.get_db().cursor()
    cursor.execute('''
    SELECT 1 FROM teachers_groups WHERE teacher_id=%s AND group_id=%s;
    ''', (get_jwt_identity()['id'], result_json['id']))
    if cursor.fetchone() is None:
        abort(400)

    return jsonify(result_json)


@bp.route('/edit_me', methods=('POST', ))
@teacher_token_required
def edit_me():
    if not request.is_json:
        abort(400, "Expected json")

    teachers_data_errors = db.check_teachers_data([request.json])
    if teachers_data_errors:
        return jsonify(teachers_data_errors[0]), 400

    db.edit_teacher(get_jwt_identity()['id'], request.json)
    return jsonify(result='ok')