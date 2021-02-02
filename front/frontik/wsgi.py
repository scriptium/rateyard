import os
import json

from flask import (Flask, Blueprint, request, jsonify,
    abort, send_file, Response, redirect,
    current_app, render_template, make_response, url_for,
    redirect
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
    
    jwt = JWTManager(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile(
                os.path.join(os.path.dirname( __file__ ), 'config.py'), silent=False)
    else:
        app.config.from_mapping(test_config)

        
    @app.after_request
    def remove_redirect_body(response):
        print(response.status_code, end='')
        if response.status_code in range(300, 400):
            print(' data removed', end='')
            response.data = ''
        print()
        return response

    
    import student
    import teacher
    import admin

    app.register_blueprint(student.bp, url_prefix="/student")
    app.register_blueprint(teacher.bp, url_prefix="/teacher")
    app.register_blueprint(admin.bp, url_prefix="/admin")

    @app.route("/", methods=("GET", ))
    def login():
        if request.method == "GET":
            return render_template("login.html")
        return 'HELLO THERE!'


    @app.route("/test", methods=("GET", "POST"))
    def test():
        if request.method == "GET":
            return render_template("test.html")
        elif request.method == "POST":
            if request.data is None:
                abort(400, "")
            return request.datasu
    
    return app