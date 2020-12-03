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
    verify_jwt_in_request
)
import requests

bp = Blueprint("teacher", __name__)


def get_me():
    pass


def teacher_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        identity = get_jwt_identity()
        if identity["type"] != "teacher":
            return jsonify(message = "Not teacher"), 403
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
    identity = get_jwt_identity()
    return render_template("./teacher/teacher.html",
                            name=identity["id"])


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