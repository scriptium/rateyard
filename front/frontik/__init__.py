import os

from flask import (Flask, Blueprint, request, jsonify,
    abort, send_file, Response,
    current_app, render_template
)
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    jwt_refresh_token_required, create_refresh_token,
)

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    
    @app.route("/login", methods=("GET", "POST"))
    def login():
        if request.method == "GET":
            return render_template("login.html")
        elif request.method == "POST":
            if request.data is None:
                abort(400, "")
            return request.data
    return app