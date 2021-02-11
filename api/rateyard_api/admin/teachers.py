# @bp.route("/create_teacher", methods=("POST", ))
# @admin_token_required
# def create_teacher():
#     if not request.is_json:
#         abort("400", "Expected json")
#     if ("username" in request.json.keys() and
#             "full_name" in request.json.keys() and
#             "email" in request.json.keys() and
#             "password" in request.json.keys()):
#         db = get_db()
#         cursor = db.cursor()
#         try:
#             cursor.execute('''
#                 INSERT INTO teachers (
#                     username,
#                     full_name,
#                     email,
#                     password_hash
#                 )
#                 VALUES (
#                     %s, %s, %s,
#                     crypt(%s, gen_salt('md5'))
#                 );
#                 ''', (
#                 request.json["username"],
#                 request.json["full_name"],
#                 request.json["email"],
#                 request.json["password"]
#             ))
#         except Exception:
#             abort(409, "Teacher with same data already exists")
#         else:
#             db.commit()
#     else:
#         abort(400, "Wrong json")
#     return jsonify({
#         "result": "OK"
#     }), 201


# @bp.route("/delete_teachers", methods=("POST", ))
# @admin_token_required
# def delete_teachers():
#     if not request.is_json:
#         abort(400, "Expected json")
#     if type(request.json) != list:
#         abort(400, "Expected array of teachers id")
#     exec_str = '''
#             DELETE FROM teachers
#             WHERE False
#             '''
#     exec_args = []
#     for teacher_id in request.json:
#         print(teacher_id)
#         exec_str += (" OR  id=%s")
#         exec_args.append(teacher_id)
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute(exec_str, exec_args)
#     db.commit()
#     return jsonify({
#         "result": "OK"
#     }), 200


# @bp.route("/edit_teachers", methods=("POST", ))
# @admin_token_required
# def edit_teachers():
#     print(request.json, flush=True)
#     if not request.is_json:
#         abort(400, "Expected json")
#         print("Expected json", flush=True)
#     if type(request.json) != list:
#         abort(400, "Expected array of teachers id")
#         print("Expected array of teachers id", flush=True)
#     for teacher in request.json:
#         if ("id" in teacher.keys() and
#                 "username" in teacher.keys() and
#                 "full_name" in teacher.keys() and
#                 "email" in teacher.keys()):
#             db = get_db()
#             cursor = db.cursor()
#             cursor.execute('''
#                 UPDATE teachers
#                 SET username=%s, full_name=%s, email=%s
#                 WHERE id=%s RETURNING True;
#                 ''', (
#                 teacher["username"],
#                 teacher["full_name"],
#                 teacher["email"],
#                 teacher["id"],
#             ))
#             if cursor.fetchone() is None:
#                 abort(400, 'There are not teachers with on of ids')
#             db.commit()
#             print("OK", flush=True)
#         else:
#             print("Wrong json", flush=True)
#             abort(400, "Wrong json")
#     return jsonify({
#         "result": "OK"
#     }), 201

# @bp.route("/get_teachers", methods=("GET", ))
# @admin_token_required
# def get_teachers():
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute('''
#         SELECT teachers.id, teachers.username, teachers.full_name, teachers.email
#         FROM teachers;
#     ''')
#     exec_result = cursor.fetchall()
#     print(exec_result, flush=True)
#     if exec_result is None:
#         return None
#     result = [{
#         "id": data[0],
#         "username": data[1],
#         "full_name": data[2],
#         "email": data[3],
#         "type": "Teacher"
#     } for data in exec_result
#     ]
#     return jsonify(result), 200