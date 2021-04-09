from functools import wraps
from datetime import datetime

from flask import Blueprint, json, request, jsonify, abort, current_app
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


@bp.route("/get_group_full", methods=("POST", ))
@teacher_token_required
def get_group_full():
    if (
        not request.is_json or
        type(request.json.get("id")) != int or
        type(request.json.get('subject_id')) != int
    ):
        abort(400)

    cursor = db.get_db().cursor()
    cursor.execute('''
    SELECT s.id, s.subject_name
    FROM teachers_groups AS tg INNER JOIN subjects AS s ON tg.subject_id=s.id
    WHERE tg.teacher_id=%s AND tg.group_id=%s AND s.id=%s;
    ''', (get_jwt_identity()['id'], request.json['id'], request.json['subject_id']))
    exec_result = cursor.fetchone()
    if exec_result is None:
        abort(400)

    group_json = db.get_group_full(request.json['id'], exec_result[0])
    if group_json is None:
        abort(400)

    del group_json['group_lecturers']
    students_to_remove = []
    for student in group_json['group_class_students']:
        if not student['is_group_member']:
            students_to_remove.append(student)
        else:
            student['type'] = 'GroupStudent'
            del student['is_group_member']
    for student in students_to_remove:
        group_json['group_class_students'].remove(student)

    group_json['students'] = group_json.pop('group_class_students')

    result_json = {
        'subject': {
            'id': exec_result[0],
            'name': exec_result[1]
        },
        'group': group_json
    }

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


@bp.route('delete_mark', methods=('POST', ))
@teacher_token_required
def delete_mark():
    print(type(request.json.get('id')))
    if not (
        request.is_json and
        type(request.json.get('id')) == int
    ):
        abort(400, 'Invalid json data.')

    database = db.get_db()
    cursor = database.cursor()
    print(request.json['id'], get_jwt_identity()['id'])
    cursor.execute('''
    SELECT 1 FROM marks AS m
    INNER JOIN students AS s ON m.student_id=s.id
    INNER JOIN groups AS g ON s.class_id=g.class_id AND (
        g.is_full_class_group OR
        EXISTS(
            SELECT 1 FROM students_groups
            WHERE student_id=s.id AND group_id=g.id
        )
    )
    INNER JOIN marks_columns AS mc ON m.column_id=mc.id
    INNER JOIN teachers_groups AS tg ON tg.teacher_id=%s AND tg.group_id=g.id
    AND tg.subject_id=mc.subject_id
    WHERE m.id=%s;
    ''', (get_jwt_identity()['id'], request.json['id']))
    if cursor.fetchone() is None:
        abort(400, 'Wrong id.')

    cursor.execute('''
    DELETE FROM marks
    WHERE id=%s
    RETURNING column_id;
    ''', (request.json['id'], ))
    cursor.execute('''
    DELETE FROM marks_columns AS mc
    WHERE id=%s AND NOT EXISTS(SELECT 1 FROM marks AS m WHERE m.column_id=mc.id);
    ''', (cursor.fetchone()[0], ))
    database.commit()
    return jsonify(result='ok')


@bp.route('create_mark', methods=('POST', ))
@teacher_token_required
def crete_mark():
    print(request.json)
    if not (
        request.is_json and
        (
            request.json.get('points') == -1 or
            request.json.get('points') in current_app.config['MARKS_VALUES']
        ) and
        type(request.json.get('student_id')) == int and
        (
            (
                type(request.json.get('new_column')) == dict and
                (
                    (
                        type(request.json['new_column'].get('date')) == int or
                        type(request.json['new_column'].get('name')) == str
                    ) and
                    type(request.json['new_column'].get('subject_id')) == int
                )
            ) or
            type(request.json.get('column_id')) == int
        )

    ):
        abort(400)

    database = db.get_db()
    cursor = database.cursor()
    if type(request.json.get('column_id')) == int:
        cursor.execute('''
        SELECT subject_id
        FROM marks_columns
        WHERE id=%s
        ''', (request.json['column_id'], ))
        exec_result = cursor.fetchone()
        if exec_result is None:
            abort(400)
        else:
            subject_id = exec_result[0]
            column_id = request.json['column_id']
    else:
        subject_id = request.json['new_column']['subject_id']

    cursor.execute('''
    SELECT 1 FROM students AS s
    INNER JOIN groups AS g ON s.class_id=g.class_id AND (
        g.is_full_class_group OR
        EXISTS(
            SELECT 1 FROM students_groups
            WHERE student_id=s.id AND group_id=g.id
        )
    )
    INNER JOIN teachers_groups AS tg ON tg.teacher_id=%s AND tg.group_id=g.id
    AND tg.subject_id=%s
    WHERE s.id=%s;
    ''', (get_jwt_identity()['id'], subject_id, request.json['student_id']))

    if cursor.fetchone() is None:
        abort(400)

    if type(request.json.get('column_id')) != int:
        if type(request.json['new_column'].get('date')) == int:
            request.json['new_column']['date'] = datetime.fromtimestamp(
                request.json['new_column']['date'])
        cursor.execute('''
        INSERT INTO marks_columns (subject_id, column_name, column_date)
        VALUES (%s, %s, %s) RETURNING id;
        ''', (
            subject_id,
            request.json['new_column'].get('name'),
            request.json['new_column'].get('date')
        ))
        column_id = cursor.fetchone()[0]
    else:
        cursor.execute('''
        SELECT 1 FROM marks AS m
        WHERE m.student_id=%s AND m.column_id=%s
        ''', (request.json['student_id'], request.json['column_id']))
        if not cursor.fetchone() is None:
            abort(400, 'Mark already exists')

    cursor.execute('''
    INSERT INTO marks (points, comment, teacher_id, column_id, student_id)
    VALUES (%s, %s, %s, %s, %s) RETURNING id;
    ''', (
        request.json['points'],
        request.json.get('comment'),
        get_jwt_identity()['id'],
        column_id,
        request.json['student_id']
    ))
    database.commit()
    return jsonify(mark_id=cursor.fetchone()[0], column_id=column_id)


@bp.route('/edit_mark', methods=('POST', ))
@teacher_token_required
def edit_mark():
    if not (
        request.is_json and
        type(request.json.get('id')) == int
    ):
        abort(400, 'Invalid json data')
    database = db.get_db()
    cursor = database.cursor()
    cursor.execute('''
    SELECT 1 FROM marks AS m
    INNER JOIN marks_columns AS mc ON m.column_id=mc.id
    INNER JOIN teachers_groups AS tg ON tg.subject_id=mc.subject_id
    WHERE m.id=%s AND tg.teacher_id=%s;
    ''', (request.json['id'], get_jwt_identity()['id']))
    if cursor.fetchone() is None:
        abort(400, 'Wrong id')

    changes = {}
    if not request.json.get('points') is None:
        if type(request.json['points']) != int:
            abort(400, 'Points must be int')
        if request.json['points'] != -1 and not request.json['points'] in current_app.config['MARKS_VALUES']:
            abort(400, 'Invalid mark value')
        changes['points'] = request.json['points']

    if not request.json.get('comment') is None:
        if type(request.json['comment']) != str:
            abort(400, 'Comment must be string')
        if len(request.json['comment']) > 256:
            abort(400, 'Comment is too long')
        changes['comment'] = request.json['comment']

    keys = []
    exec_args = []
    for key, value in changes.items():
        keys.append(key)
        exec_args.append(value)

    if len(keys) == 0:
        abort(400, 'No changes provided')

    exprs = (*(f'{key}=%s' for key in keys), 'edition_date=NOW()')
    set_exec_part_str = ', '.join(exprs)
    exec_args.append(request.json['id'])
    cursor.execute(f'''
    UPDATE marks
    SET {set_exec_part_str}
    WHERE id=%s;
    ''', exec_args)
    database.commit()
    return jsonify(result='OK')


@bp.route('/edit_column', methods=('POST', ))
@teacher_token_required
def edit_column():
    if not (
        request.is_json and
        type(request.json.get('id')) == int and
        (
            request.json.get('name') is None or
            type(request.json.get('name')) == str
        ) and
        (
            request.json.get('date') is None or
            type(request.json.get('date')) == int
        )
    ):
        abort(400, 'Invalid data')

    database = db.get_db()
    cursor = database.cursor()
    cursor.execute(r'''
    SELECT 1 FROM marks_columns AS mc
    INNER JOIN teachers_groups AS tg ON tg.subject_id = mc.subject_id AND tg.teacher_id=%s
    WHERE mc.id = %s;
    ''', (get_jwt_identity()['id'], request.json['id']))
    if cursor.fetchone() is None:
        abort(400, 'Invalid column id')

    changes = {}
    if 'name' in request.json.keys():
        changes['column_name'] = request.json['name']

    if 'date' in request.json.keys():
        if request.json['date'] is None:
            changes['column_date'] = None
        else:
            try:
                changes['column_date'] = datetime.fromtimestamp(request.json['date'])
            except TypeError:
                abort(400, 'Invalid date')

    set_exec_part = ', '.join([f'{key}=%s' for key in changes.keys()])
    exec_args = []
    for key, value in changes.items():
        exec_args.append(value)

    if len(set_exec_part) == 0:
        abort('No changes provided')

    exec_args.append(request.json['id'])
    exec_str = f'''
    UPDATE marks_columns
    SET {set_exec_part} WHERE id = %s;
    '''
    cursor.execute(exec_str, exec_args)
    database.commit()
    return jsonify(result='OK')


@bp.route("/send_verification_email", methods=("POST", ))
@teacher_token_required
def send_verification_email():
    if not (request.is_json and 'username' in request.json.keys()):
        abort(400, 'Expected username in json.')
    database = db.get_db()
    cursor = database.cursor()
    cursor.execute('''
    SELECT email, full_name, password_hash, id 
    FROM teachers WHERE username=%s;
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
@teacher_token_required
def verify():
    if not request.is_json:
        abort(400, 'Expected json')
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
@teacher_token_required
def change_password():
    if not request.is_json:
        abort(400, 'Expected json')
    if not 'password' in request.json.keys() or not 'id' in request.json.keys():
        abort(400, 'Expected password and id in json')

    db.edit_teacher(request.json['id'], {"password": request.json['password']})
    return jsonify(result='ok')
