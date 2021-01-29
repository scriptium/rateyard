import os
import json
from functools import wraps


from flask import (Flask, Blueprint, request, jsonify,
    abort, send_file, Response, redirect,
    current_app, render_template, make_response, url_for
)
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies,
    verify_jwt_in_request, verify_jwt_in_request_optional
)
import requests

bp = Blueprint("admin", __name__)


#def get_me():
#    pass


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request_optional()
        identity = get_jwt_identity()
        if identity is None or identity["type"] != "admin":
            return redirect(url_for(".login"), 302) #jsonify(message = "Not admin"), 403
        else:
            return fn(*args, **kwargs)
    return wrapper


def assign_jwt_tokens(access_token: str, refresh_token: str, url: str):
    response = make_response(redirect(url, 302))
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response


def unset_jwt_tokens():
    response = make_response(redirect(current_app.config["BASE_URL"], 302))
    unset_jwt_cookies(response)
    return response


def get_students():
    students = requests.get(
        current_app.config["API_HOST"] + "/admin/get_students"
    )
    return students


def get_teachers():
    teachers = requests.get(
        current_app.config["API_HOST"] + "/admin/get_teachers"
    )
    return teachers


def get_classes():
    classes = requests.get(
        current_app.config["API_HOST"] + "/admin/get_classes"
    )
    return classes


def get_subjects():
    subjects = requests.get(
        current_app.config["API_HOST"] + "/admin/get_subjects"
    )
    return subjects


def get_groups():
    groups = requests.get(
        current_app.config["API_HOST"] + "/admin/get_groups"
    )
    return groups


@bp.route("/", methods=("GET", ))
@admin_required
def home():
    if request.method == "GET":
        return render_template("./admin/base.html")  


@bp.route("/students", methods=("GET", ))
@admin_required
def students():
    if request.method == "GET":
        classes = get_classes();
        students = get_students();
        return render_template("./admin/students.html", 
                                classes = classes.json(),
                                students = students.json(),
                                section = "students")    


@bp.route("/classes", methods=("GET", ))
@admin_required
def classes():
    classes = get_classes();
    if request.method == "GET":
        return render_template("./admin/classes.html",
                                classes = classes.json(), 
                                section = "classes")    


@bp.route("/teachers", methods=("GET", ))
@admin_required
def teachers():
    teachers = get_teachers();
    print(teachers)
    if request.method == "GET":
        return render_template("./admin/teachers.html",
                                teachers = teachers.json(), 
                                section = "teachers")


@bp.route("/groups", methods=("GET", ))
@admin_required
def groups():
    subjects = get_subjects();
    students = get_students();
    teachers = get_teachers();
    groups = get_groups();
    if request.method == "GET":
        return render_template("./admin/groups.html",
                                subjects = subjects.json(), 
                                students = students.json(), 
                                teachers = teachers.json(), 
                                groups = groups.json(),
                                section = "groups")


@bp.route("/subjects", methods=("GET", ))
@admin_required
def subjects():
    subjects = get_subjects();
    if request.method == "GET":
        return render_template("./admin/subjects.html",
                                subjects = subjects.json(), 
                                section = "subjects")


@bp.route("/students/save_changes", methods=("POST", ))
@admin_required
def students_save_changes():
    print(request.json["students_to_edit"])
    print(request.json["students_to_delete"])
    if request.json["students_to_delete"]:
        response_delete_students = requests.post(
            current_app.config["API_HOST"] + "/admin/delete_students",
            json = request.json["students_to_delete"]
        )
        if not response_delete_students.ok:
            abort(response_delete_students.status_code,
            f'''Api error while deleting.
                Response body:
                {response_delete_students.text}
            ''')
    if request.json["students_to_edit"]:
        response_edit_students = requests.post(
            current_app.config["API_HOST"] + "/admin/edit_students",
            json = request.json["students_to_edit"]
        )
        if not response_edit_students.ok:
            abort(response_edit_students.status_code, 
            f'''
                Api error while editing.
                Response body:
                {response_edit_students.text}
            ''')
    return '', 200

@bp.route("/classes/save_changes", methods=("POST", ))
@admin_required
def classes_save_changes():
    print(request.json["classes_to_edit"])
    print(request.json["classes_to_delete"])
    if request.json["classes_to_delete"]:
        response_delete_classes = requests.post(
            current_app.config["API_HOST"] + "/admin/delete_classes",
            json = request.json["classes_to_delete"]
        )
        if not response_delete_classes.ok:
            abort(response_delete_classes.status_code,
            f'''Api error while deleting.
                Response body:
                {response_delete_classes.text}
            ''')
    if request.json["classes_to_edit"]:
        response_edit_classes = requests.post(
            current_app.config["API_HOST"] + "/admin/edit_classes",
            json = request.json["classes_to_edit"]
        )
        if not response_edit_classes.ok:
            abort(response_edit_classes.status_code, 
            f'''
                Api error while editing.
                Response body:
                {response_edit_classes.text}
            ''')
    return '', 200


@bp.route("/teachers/save_changes", methods=("POST", ))
@admin_required
def teachers_save_changes():
    print(request.json["teachers_to_edit"])
    print(request.json["teachers_to_delete"])
    if request.json["teachers_to_delete"]:
        response_delete_teachers = requests.post(
            current_app.config["API_HOST"] + "/admin/delete_teachers",
            json = request.json["teachers_to_delete"]
        )
        if not response_delete_teachers.ok:
            abort(response_delete_teachers.status_code,
            f'''Api error while deleting.
                Response body:
                {response_delete_teachers.text}
            ''')
    if request.json["teachers_to_edit"]:
        response_edit_teachers = requests.post(
            current_app.config["API_HOST"] + "/admin/edit_teachers",
            json = request.json["teachers_to_edit"]
        )
        if not response_edit_teachers.ok:
            abort(response_edit_teachers.status_code, 
            f'''
                Api error while editing.
                Response body:
                {response_edit_teachers.text}
            ''')
    return '', 200

@bp.route("/subjects/save_changes", methods=("POST", ))
@admin_required
def subjects_save_changes():
    print(request.json["subjects_to_edit"])
    print(request.json["subjects_to_delete"])
    if request.json["subjects_to_delete"]:
        response_delete_subjects = requests.post(
            current_app.config["API_HOST"] + "/admin/delete_subjects",
            json = request.json["subjects_to_delete"]
        )
        if not response_delete_subjects.ok:
            abort(response_delete_subjects.status_code,
            f'''Api error while deleting.
                Response body:
                {response_delete_subjects.text}
            ''')
    if request.json["subjects_to_edit"]:
        response_edit_subjects = requests.post(
            current_app.config["API_HOST"] + "/admin/edit_subjects",
            json = request.json["subjects_to_edit"]
        )
        if not response_edit_subjects.ok:
            abort(response_edit_subjects.status_code, 
            f'''
                Api error while editing.
                Response body:
                {response_edit_subjects.text}
            ''')
    return '', 200


@bp.route("/add_class", methods=("POST", ))
def add_class():
    print(request.form, flush=True)
    form_data = request.form.to_dict(flat=False)
    print(form_data, flush=True)
    response_create_class = requests.post(
        current_app.config["API_HOST"] + "/admin/create_class",
        json = {
            "class_name": request.form["class_name"]
        }
    )
    if not response_create_class.ok:
        return render_template("./error.html", error_code=response_create_class.raise_for_status)
    try: 
        students = [
            {
                "username": username,
                "full_name": full_name,
                "email": email,
                "password": password,
                "class_id": response_create_class.json()["class_id"]
            } for (
                username, full_name, email,
                password) in zip(
                form_data["username"], form_data["full_name"],
                form_data["email"], form_data["password"])
        ]
    except Exception:
        abort(400, "Oops... Something went wrong")
    print(students, flush=True)
    response_create_students = requests.post(
        current_app.config["API_HOST"] + "/admin/create_students",
        json = students
    )
    if not response_create_students.ok:
        return render_template("./error.html", error_code=response_create_students.raise_for_status)
    resp = make_response(redirect(url_for("admin.classes")))
    return resp


@bp.route("/add_group", methods=("POST", ))
def add_group():
    form_data = request.form.to_dict(flat=False)
    print(form_data)
    response_create_group = requests.post(
        current_app.config["API_HOST"] + "/admin/create_group",
        json = {
            "group_name": form_data["group_name"][0],
            "subject_id": form_data["subject_id"][0]
        }
    )
    if not response_create_group.ok:
        abort(response_create_group.status_code,
            f'''Api error while deleting.
                Response body:
                {response_create_group.text}
            ''')
    print(response_create_group.json()["group_id"])
    print(form_data["student_id"])
    response_add_students_to_group = requests.post(
        current_app.config["API_HOST"] + "/admin/add_students_to_group",
        json = {
            "group_id": response_create_group.json()["group_id"],
            "students_ids": form_data["student_id"]
        }
    )
    if not response_add_students_to_group.ok:
        abort(response_add_students_to_group.status_code,
            f'''Api error while deleting.
                Response body:
                {response_add_students_to_group.text}
            ''')

    response_add_teachers_to_group = requests.post(
        current_app.config["API_HOST"] + "/admin/add_teachers_to_group",
        json = {
            "group_id": response_create_group.json()["group_id"],
            "teachers_ids": form_data["teacher_id"]
        }
    )
    if not response_add_teachers_to_group.ok:
        abort(response_add_students_to_group.status_code,
            f'''Api error while deleting.
                Response body:
                {response_add_students_to_group.text}
            ''')
    resp = make_response(redirect(url_for("admin.groups")))
    return resp


@bp.route("/delete_class", methods=("POST", ))
def delete_class():
    print(request.form, flush=True)
    response_delete_class = requests.post(
        current_app.config["API_HOST"] + "/admin/delete_class",
        json = {
            "class_id": request.form["class_id"]
        }
    )
    if not response_delete_class.ok:
        return render_template("./error.html", error_code=response_delete_class.raise_for_status)
    resp = make_response(redirect(url_for("admin.classes")))
    return resp
    



@bp.route("/add_subject", methods=("POST", ))
def add_subject():
    response = requests.post(
        current_app.config["API_HOST"] + "/admin/create_subject",
        json = {
            "subject_name": request.form["subject_name"]
        }
    )
    if not response.ok:
        return render_template("./error.html", error_code=response.raise_for_status)
    resp = make_response(redirect(url_for("admin.subjects")))
    return resp
    


@bp.route("/add_student", methods=("POST", ))
def add_student():
    print(request.form, flush=True)
    response = requests.post(
        current_app.config["API_HOST"] + "/admin/create_students",
        json = [{
                "username": request.form["username"],
                "full_name": request.form["full_name"],
                "password": request.form["password"],
                "email": request.form["email"],
                "class_id": request.form["class_id"]
            }]
    )
    if not response.ok:
        return render_template("./error.html", error_code=response.raise_for_status)
    resp = make_response(redirect(url_for("admin.students")))
    return resp
    


@bp.route("/add_teacher", methods=("POST", ))
def add_teacher():
    response = requests.post(
        current_app.config["API_HOST"] + "/admin/create_teacher",
        json = {
            "username": request.form["username"],
            "full_name": request.form["full_name"],
            "password": request.form["password"],
            "email": request.form["email"],
        }
    )
    if not response.ok:
        return render_template("./error.html", error_code=response.raise_for_status)
    resp = make_response(redirect(url_for("admin.teachers")))
    return resp




@bp.route("/login", methods=("GET", "POST"))
def login():
    if request.method == "GET":
        return render_template("./admin/login.html")
    if request.method == "POST":
        response = requests.post(
            current_app.config["API_HOST"] + "/auth/login_admin",
            json = {
                "username": request.form["username"],
                "password": request.form["password"]
            }
            
        )
        if not response.ok:
            return render_template("./error.html", error_code=response.raise_for_status)
        resp = make_response(redirect(url_for("admin.home")))
        set_access_cookies(resp, response.json()["access_token"])
        set_refresh_cookies(resp, response.json()["refresh_token"])
        return resp
       


@bp.route("/logout", methods=("POST", ))
def logout():
    response = make_response(redirect(request.url_root, 302))
    unset_jwt_cookies(response)
    return response
