import os


from flask import (Flask, Blueprint, request, jsonify,
    abort, send_file, Response, redirect,
    current_app, render_template
)
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    jwt_refresh_token_required, create_refresh_token,
    get_jwt_identity, set_access_cookies,
    set_refresh_cookies, unset_jwt_cookies
)
import requests

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile(
                os.path.join(os.path.dirname( __file__ ), 'config.py'), silent=False)
    else:
        app.config.from_mapping(test_config)
    

    @app.route("/", methods=("GET",))
    def login():
        return render_template("login.html")
        if request.method == "GET":
            return render_template("login.html")
        return 'HELLO THERE!'


    @app.route("/student/login", methods=("GET", "POST"))
    def student_login():
        if(request.method == "GET"):
            return render_template("./student/login.html")
        if(request.method == "POST"):
            response = requests.post(
                current_app.config["API_HOST"] + "/auth/login_student",
                {
                    "username": request.form["username"],
                    "password": request.form["password"]
                }
            )
            return request.data


    @app.route("/teacher/login", methods=("GET", "POST"))
    def teacher_login():
        if(request.method == "GET"):
            return render_template("./teacher/login.html")
        if(request.method == "POST"):
            response = requests.post(
                current_app.config["API_HOST"] + "/auth/login_teacher",
                {
                    "username": request.form["username"],
                    "password": request.form["password"]
                }
            )
            return request.data


    @app.route("/admin/login", methods=("GET", "POST"))
    def admin_login():
        if(request.method == "GET"):
            return render_template("./admin/login.html")
        if(request.method == "POST"):
            response = requests.post(
                current_app.config["API_HOST"] + "/auth/login_admin",
                {
                    "username": request.form["username"],
                    "password": request.form["password"]
                }
            )
            return request.data


    @app.route("/test", methods=("GET", "POST"))
    def test():
        if request.method == "GET":
            return render_template("test.html")
        elif request.method == "POST":
            if request.data is None:
                abort(400, "")
            return request.data
    
    return app