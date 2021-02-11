# @bp.route("/create_subject", methods=("POST", ))
# @admin_token_required
# def create_subject():
#     if not request.is_json:
#         abort("400", "Expected json")
#     if "subject_name" in request.json.keys():
#         db = get_db()
#         cursor = db.cursor()
#         cursor.execute('''
#             INSERT INTO subjects (
#                 subject_name
#             )
#             VALUES (
#                 %s
#             );
#             ''', (
#             request.json["subject_name"],
#         ))
#         db.commit()
#         return jsonify({
#             "result": "OK"
#         }), 200
#     else:
#         abort(400, "Wrong json")

# @bp.route("/delete_subjects", methods=("POST", ))
# @admin_token_required
# def delete_subjects():
#     if not request.is_json:
#         abort(400, "Expected json")
#     if type(request.json) != list:
#         abort(400, "Expected array of subjects id")
#     exec_str = '''
#             DELETE FROM subjects
#             WHERE False
#             '''
#     exec_args = []
#     for subject_id in request.json:
#         print(subject_id)
#         exec_str += (" OR  id=%s")
#         exec_args.append(subject_id)
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute(exec_str, exec_args)
#     db.commit()
#     return jsonify({
#         "result": "OK"
#     }), 200


# @bp.route("/edit_subjects", methods=("POST", ))
# @admin_token_required
# def edit_subjects():
#     print(request.json, flush=True)
#     if not request.is_json:
#         abort(400, "Expected json")
#         print("Expected json", flush=True)
#     if type(request.json) != list:
#         abort(400, "Expected array of subjects id")
#         print("Expected array of subjects id", flush=True)
#     for subject in request.json:
#         if ("id" in subject.keys() and
#                 "name" in subject.keys()):
#             db = get_db()
#             cursor = db.cursor()
#             cursor.execute('''
#                 UPDATE subjects
#                 SET subject_name=%s
#                 WHERE id=%s RETURNING True;
#                 ''', (
#                 subject["name"],
#                 subject["id"],
#             ))
#             if cursor.fetchone() is None:
#                 abort(400, 'There are not subjects with on of ids')
#             db.commit()
#             print("OK", flush=True)
#         else:
#             print("Wrong json", flush=True)
#             abort(400, "Wrong json")
#     return jsonify({
#         "result": "OK"
#     }), 201

# @bp.route("/get_subjects", methods=("GET", ))
# @admin_token_required
# def get_subjects():
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute('''
#         SELECT id, subject_name
#         FROM subjects;
#         '''
#                    )
#     exec_result = cursor.fetchall()
#     if exec_result is None:
#         return None
#     result = [{
#         "id": data[0],
#         "name": data[1],
#         "type": "Subject"
#     } for data in exec_result
#     ]
#     return jsonify(result), 200