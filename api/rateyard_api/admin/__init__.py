from functools import wraps

from flask import Blueprint, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

from db import get_db


def admin_token_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        if identity['type'] != 'admin':
            return jsonify(msg='Admins only!'), 403
        else:
            return fn(*args, **kwargs)
    return wrapper

bp = Blueprint("admin", __name__)

@bp.route("check_token", methods=("POST",))
@admin_token_required
def check_token():
    return jsonify(msg='ok')

from . import teachers
from . import groups
from . import students
from . import classes

bp.add_url_rule("/create_students", methods=("POST", ), view_func=students.create_students)
bp.add_url_rule("/delete_students", methods=("POST", ), view_func=students.delete_students)
bp.add_url_rule("/edit_students", methods=("POST", ), view_func=students.edit_students)
bp.add_url_rule("/get_students", methods=("POST", ), view_func=students.get_students)

bp.add_url_rule("/get_classes", methods=("GET", ), view_func=classes.get_classes)