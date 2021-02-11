from flask import Blueprint, request, abort, jsonify

from . import admin_token_required, get_db

# @bp.route("/create_group", methods=("POST", ))
# @admin_token_required
# def create_group():
#     if not request.is_json:
#         abort("400", "Expected json")
#     if ("group_name" in request.json.keys() and
#             "subject_id" in request.json.keys()):
#         db = get_db()
#         cursor = db.cursor()
#         cursor.execute('''
#             INSERT INTO groups (
#                 group_name, subject_id
#             )
#             VALUES (
#                 %s, %s
#             ) RETURNING id;
#             ''', (
#             request.json["group_name"],
#             request.json["subject_id"],
#         ))
#         group_id = cursor.fetchone()
#         db.commit()
#         print(group_id, flush=True)
#         return jsonify({
#             "group_id": group_id[0]
#         }), 200
#     else:
#         abort(400, "Wrong json")

@admin_token_required
def get_groups():
    exec_main_str = '''
    SELECT gr.id, gr.group_name, cl.id, cl.class_name
    FROM groups as gr
    LEFT JOIN classes as cl ON gr.class_id = cl.id
    '''
    exec_args = []
    exec_where_str = ""

    if request.is_json:
        if "student_id" in request.json.keys():
            if type(request.json["student_id"]) == int:
                exec_main_str += '''
                INNER JOIN students_groups as stgr ON stgr.group_id=gr.id
                '''
                exec_args.append(request.json["student_id"])
                exec_where_str = " WHERE stgr.student_id=%s"
            else:
                abort(400)

        if "editable" in request.json.keys():
            if type(request.json["editable"]) == bool:
                if exec_where_str == "":
                    exec_where_str = " WHERE"
                if request.json["editable"]:
                    exec_where_str += " is_editable=True"
                else:
                    exec_where_str += " is_editable=False"
            else:
                abort(400)

    cursor = get_db().cursor()
    cursor.execute(exec_main_str + exec_where_str, exec_args)
    exec_result = cursor.fetchall()

    result = [{
        "id": data[0],
        "name": data[1],
        "class": {
            "type": "Class",
            "id": data[2],
            "name": data[3]
        },
        "type": "Group"
    } for data in exec_result
    ]
    return jsonify(result)


#     @bp.route("/add_students_to_group", methods=("POST", ))
# @admin_token_required
# def add_students_to_group():
#     if not request.is_json:
#         abort("400", "Expected json")
#     print(request.json, flush=True)
#     if ("group_id" in request.json.keys() and
#             "students_ids" in request.json.keys() and
#             type(request.json["students_ids"]) != list):
#         abort(400, "Expected group id and array of students ids")
#     for student_id in request.json["students_ids"]:
#         db = get_db()
#         cursor = db.cursor()
#         cursor.execute('''
#             INSERT INTO students_groups (
#                 student_id, group_id
#             )
#             VALUES (
#                 %s, %s
#             );
#             ''', (
#             student_id,
#             request.json["group_id"],
#         ))
#     db.commit()
#     return jsonify({
#         "result": "OK"
#     }), 200


# @bp.route("/add_teachers_to_group", methods=("POST", ))
# @admin_token_required
# def add_teachers_to_group():
#     if not request.is_json:
#         abort("400", "Expected json")
#     if ("group_id" in request.json.keys() and
#             "teachers_ids" in request.json.keys() and
#             type(request.json["teachers_ids"]) != list):
#         abort(400, "Expected group id and array of teachers ids")
#     for teacher_id in request.json["teachers_ids"]:
#         db = get_db()
#         cursor = db.cursor()
#         cursor.execute('''
#             INSERT INTO teachers_groups (
#                 teacher_id, group_id
#             )
#             VALUES (
#                 %s, %s
#             );
#             ''', (
#             teacher_id,
#             request.json["group_id"],
#         ))
#     db.commit()
#     return jsonify({
#         "result": "OK"
#     }), 200
