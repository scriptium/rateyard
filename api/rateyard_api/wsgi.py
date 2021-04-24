import os

from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from verifier import Verifier


def create_app():
    app = Flask(__name__, instance_relative_config=True)
    
    app.config.from_pyfile(os.path.join(os.path.dirname( __file__ ), 'config.py'), silent=False)

    JWTManager(app)
    CORS(app)
    
    import auth
    import student
    import teacher
    import admin

    app.extensions['student_reset_password_verifier'] = Verifier('Ось код для відновлення паролю:')
    app.extensions['teacher_reset_password_verifier'] = Verifier('Ось код для відновлення паролю:')
    app.extensions['student_account_changes_verifier'] = Verifier('Ось код для підтвердження змін данних аккаунту:')
    app.extensions['teacher_account_changes_verifier'] = Verifier('Ось код для підтвердження змін данних аккаунту:')
    app.extensions['teacher_email_verifier'] = Verifier('Ось код для підтвердження електронної пошти:')
    app.extensions['student_email_verifier'] = Verifier('Ось код для підтвердження електронної пошти:')

    @app.errorhandler(HTTPException)
    def handle_exception(e):
        return jsonify({
            "code": e.code,
            "name": e.name,
            "description": e.description,
        }), e.code

    app.register_blueprint(auth.bp, url_prefix="/auth")
    app.register_blueprint(student.bp, url_prefix="/student")
    app.register_blueprint(teacher.bp, url_prefix="/teacher")
    app.register_blueprint(admin.bp, url_prefix="/admin")

    return app
