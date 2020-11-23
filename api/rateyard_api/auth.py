import functools

from flask import (Blueprint, request, jsonify, 
    abort, send_file, Response,
    current_app
)
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    jwt_refresh_token_required, create_refresh_token,
)

from .db import get_db, close_db

bp = Blueprint("auth", __name__, url_prefix="/auth")

@bp.route("/login", methods = ('GET', ))
def login():
	if not request.is_json:
		print (request.json)
		abort(400, "Bad request")
	login_form = ["username", "password"]
	if all(key in request.form for key in login_form):
		db = get_db()
		cursor = db.cursor()
		cursor.execute('''
			SELECT id
			FROM (students OR teachers) WHERE username=%s
			AND password_hash=crypt(%s, password_hash);
		''', ( 
			request.form["username"],
			request.form["password"]
			)
		)
		user_id = cursor.fetchone()
	else: 
		abort(400, "Wrong json")
	if user_id is None:
		abort(404, "Wrong login data")
	else:
		return jsonify({
			"access_token": create_access_token(identity=user_id),
			"refresh_token": create_refresh_token(identity=user_id)
		}), 200


@bp.route("/refresh", methods=["POST"])
@jwt_refresh_token_required
def refresh():
	user_id = get_jwt_identity()
	return jsonify({
		"access_token": create_access_token(identity=user_id)
	}), 200