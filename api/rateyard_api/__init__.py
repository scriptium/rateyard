import os

from flask import Flask
from flask_jwt_extended import JWTManager


def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)

    jwt = JWTManager(app)

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile(
                os.path.join(os.path.dirname( __file__ ), 'config.py'), silent=False)
    else:
        app.config.from_mapping(test_config)
    
    from . import auth
    from . import api
    from . import student
    app.register_blueprint(auth.bp, url_prefix="/auth")
    app.register_blueprint(api.bp, url_prefix="/api")
    app.register_blueprint(student.bp, url_prefix="/student")
    @app.route("/test", methods=["GET"])
    def test():
        return "HEYOO"
    return app