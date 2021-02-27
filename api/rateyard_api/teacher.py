from functools import wraps

from flask import (Blueprint, request, jsonify, abort)
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from db import (
    get_db, close_db
)


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

@bp.route("/get_me", methods = ("GET", ))
@teacher_token_required
def get_me():
    identity = get_jwt_identity()
    cursor = get_db().cursor()

    cursor.execute('''
    SELECT id, username, full_name, email FROM teachers WHERE id=%s;
    ''', (identity['id'], )
    )

    exec_result = cursor.fetchone()

    if exec_result == None:
        abort(400)

    return jsonify({
        'id': exec_result[0],
        'username': exec_result[1],
        'full_name': exec_result[2],
        'email_name': exec_result[3],
    })