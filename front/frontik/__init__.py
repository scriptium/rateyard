import os


from flask import (Flask, Blueprint, request, jsonify,
    abort, send_file, Response, redirect,
    current_app, render_template
)
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    jwt_refresh_token_required, create_refresh_token,
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
            print(response.json)
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
            print(response.json)
            return request.data


    @app.route("/test", methods=("GET", "POST"))
    def test():
        if request.method == "GET":
            return render_template("test.html")
        elif request.method == "POST":
            if request.data is None:
                abort(400, "")
            return request.data
    
    
    @app.route("/main_page", methods=("GET", "POST"))
    def main_page():
        if request.method == "GET":
            return render_template("test.html")
        elif request.method == "POST":
            if request.data is None:
                abort(400, "")
            return request.data
    return app