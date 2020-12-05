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

bp = Blueprint("teacher", __name__)


def get_me(cookies):
    #print(cookies, flush=True)
    response = requests.get(
            current_app.config["API_HOST"] + "/teacher/get_me",
            headers = {
                "Authorization": "Bearer {}".format(cookies.get("access_token_cookie"))
            }
    )
    return response.json()

def teacher_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        #verify_jwt_in_request()
        verify_jwt_in_request_optional()
        identity = get_jwt_identity()
        if identity is None or identity["type"] != "teacher":
            return redirect(url_for(".login"), 302) #jsonify(message = "Not teacher"), 403
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
@teacher_required
def home():
    me = get_me(request.cookies)
    print(me, flush=True)
    return render_template("./teacher/teacher.html",
                            name=me["username"], teacher_name = me["full_name"])


@bp.route("/login/", methods=("GET", "POST"))
def login():
    if(request.method == "GET"):
        return render_template("./teacher/login.html")
    if(request.method == "POST"):
        response = requests.post(
            current_app.config["API_HOST"] + "/auth/login_teacher",
            json = {
                "username": request.form["username"],
                "password": request.form["password"]
            }
        )
        if response.ok:
            resp = make_response(redirect(url_for("teacher.home")))
            set_access_cookies(resp, response.json()["access_token"])
            set_refresh_cookies(resp, response.json()["refresh_token"])
            return resp, 200
        return render_template("./error.html", error_code=response.raise_for_status)


@bp.route("/logout", methods=("POST", ))
def logout():
    response = make_response(redirect(request.url_root, 302))
    unset_jwt_cookies(response)
    return response