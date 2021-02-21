import os

from flask import Flask, redirect
from flask_jwt_extended import JWTManager
from flask_cors import CORS


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    
    app.config.from_pyfile(os.path.join(os.path.dirname( __file__ ), 'config.py'), silent=False)

    JWTManager(app)
    CORS(app)
    
    import auth
    import student
    import teacher
    import admin

    app.register_blueprint(auth.bp, url_prefix="/auth")
    app.register_blueprint(student.bp, url_prefix="/student")
    app.register_blueprint(teacher.bp, url_prefix="/teacher")
    app.register_blueprint(admin.bp, url_prefix="/admin")
    @app.route("/test", methods=["GET"])
    def test():
        return "HEYOO"
    return app
