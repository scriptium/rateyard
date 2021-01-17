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

@bp.route("/", methods=("GET", ))
@admin_required
def home():
    if request.method == "GET":
        return render_template("./admin/base.html")  

@bp.route("/students", methods=("GET", ))
@admin_required
def students():
    if request.method == "GET":
        classes = requests.get(
            current_app.config["API_HOST"] + "/admin/get_classes"
        )
        students = requests.get(
            current_app.config["API_HOST"] + "/admin/get_students"
        )
        return render_template("./admin/students.html", 
                                classes = classes.json(),
                                students = students.json(),
                                section = "students")    


@bp.route("/classes", methods=("GET", ))
@admin_required
def classes():
    classes = requests.get(
        current_app.config["API_HOST"] + "/admin/get_classes"
    )
    if request.method == "GET":
        return render_template("./admin/classes.html",
                                classes = classes.json(), 
                                section = "classes")    


@bp.route("/teachers", methods=("GET", ))
@admin_required
def teachers():
    teachers = requests.get(
        current_app.config["API_HOST"] + "/admin/get_teachers"
    )
    print(teachers)
    if request.method == "GET":
        return render_template("./admin/teachers.html",
                                teachers = teachers.json(), 
                                section = "teachers")


@bp.route("/groups", methods=("GET", ))
@admin_required
def groups():
    groups = requests.get(
        current_app.config["API_HOST"] + "/admin/get_groups"
    )
    if request.method == "GET":
        return render_template("./admin/groups.html",
                                groups = groups.json(), 
                                section = "groups")


@bp.route("/subjects", methods=("GET", ))
@admin_required
def subjects():
    subjects = requests.get(
        current_app.config["API_HOST"] + "/admin/get_subjects"
    )
    if request.method == "GET":
        return render_template("./admin/subjects.html",
                                subjects = subjects.json(), 
                                section = "subjects")


@bp.route("/students/save_changes", methods=("POST", ))
@admin_required
def save_changes():
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
