from functools import wraps

from flask import Blueprint, jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

import db


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

@bp.route("check_token", methods=("GET",))
@admin_token_required
def check_token():
    return jsonify(msg='ok')

from . import teachers
from . import groups
from . import students
from . import classes
from . import subjects

bp.add_url_rule("/create_students", methods=("POST", ), view_func=students.create_students)
bp.add_url_rule("/delete_students", methods=("POST", ), view_func=students.delete_students)
bp.add_url_rule("/edit_students", methods=("POST", ), view_func=students.edit_students)
bp.add_url_rule("/get_students", methods=("POST", ), view_func=students.get_students)
bp.add_url_rule("/import_from_excel", methods=("POST", ), view_func=students.import_from_excel)

bp.add_url_rule("/get_classes_short", methods=("GET", ), view_func=classes.get_classes_short)
bp.add_url_rule("/get_class_full", methods=("POST", ), view_func=classes.get_class_full)
bp.add_url_rule("/delete_students_from_class", methods=("POST", ), view_func=classes.delete_students_from_class)
bp.add_url_rule("/move_students_to_class", methods=("POST", ), view_func=classes.move_students_to_class)
bp.add_url_rule("/create_class", methods=("POST", ), view_func=classes.create_class)

bp.add_url_rule("/get_groups_short", methods=("POST", "GET"), view_func=groups.get_groups_short)
bp.add_url_rule("/get_group_full", methods=("POST", ), view_func=groups.get_group_full)
bp.add_url_rule("/create_group", methods=("POST", ), view_func=groups.create_group)
bp.add_url_rule("/edit_group", methods=("POST", ), view_func=groups.edit_group)
bp.add_url_rule("/delete_group", methods=("POST", ), view_func=groups.delete_group)

bp.add_url_rule("/create_teachers", methods=("POST", ), view_func=teachers.create_teachers)
bp.add_url_rule("/get_teachers", methods=("POST", ), view_func=teachers.get_teachers)
bp.add_url_rule("/delete_teachers", methods=("POST", ), view_func=teachers.delete_teachers)
bp.add_url_rule("/edit_teachers", methods=("POST", ), view_func=teachers.edit_teachers)
bp.add_url_rule("/create_lecturer", methods=("POST", ), view_func=teachers.create_lecturer)
bp.add_url_rule("/delete_lecturer", methods=("POST", ), view_func=teachers.delete_lecturer)

bp.add_url_rule("/create_subject", methods=("POST", ), view_func=subjects.create_subject)
bp.add_url_rule("/get_subjects", methods=("GET", ), view_func=subjects.get_subjects)
bp.add_url_rule("/delete_subjects", methods=("POST", ), view_func=subjects.delete_subjects)
bp.add_url_rule("/edit_subjects", methods=("POST", ), view_func=subjects.edit_subjects)

