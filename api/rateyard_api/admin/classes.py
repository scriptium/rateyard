from flask import Blueprint, request, abort, jsonify

from . import admin_token_required, get_db


# @bp.route("/create_class", methods=("POST", ))
# @admin_token_required
# def create_class():
#     if not request.is_json:
#         abort("400", "Expected json")
#     if "class_name" in request.json.keys():
#         db = get_db()
#         cursor = db.cursor()
#         cursor.execute('''
#             INSERT INTO classes (
#                 class_name
#             )
#             VALUES (
#                 %s
#             ) RETURNING id;
#             ''', (
#             request.json["class_name"],
#         ))
#         class_id = cursor.fetchone()
#         db.commit()
#         print(class_id, flush=True)
#         return jsonify({
#             "class_id": class_id[0]
#         }), 200
#     else:
#         abort(400, "Wrong json")


# @bp.route("/delete_classes", methods=("POST", ))
# @admin_token_required
# def delete_classes():
#     if not request.is_json:
#         abort(400, "Expected json")
#     if type(request.json) != list:
#         abort(400, "Expected array of classes id")
#     exec_str = '''
#             DELETE FROM classes
#             WHERE False
#             '''
#     exec_args = []
#     for class_id in request.json:
#         print(class_id)
#         exec_str += (" OR  id=%s")
#         exec_args.append(class_id)
#     db = get_db()
#     cursor = db.cursor()
#     cursor.execute(exec_str, exec_args)
#     db.commit()
#     return jsonify({
#         "result": "OK"
#     }), 200


# @bp.route("/edit_classes", methods=("POST", ))
# @admin_token_required
# def edit_classes():
#     print(request.json, flush=True)
#     if not request.is_json:
#         abort(400, "Expected json")
#         print("Expected json", flush=True)
#     if type(request.json) != list:
#         abort(400, "Expected array of classes id")
#         print("Expected array of classes id", flush=True)
#     for class_ in request.json:
#         if ("id" in class_.keys() and
#                 "name" in class_.keys()):
#             db = get_db()
#             cursor = db.cursor()
#             cursor.execute('''
#                 UPDATE classes
#                 SET class_name=%s
#                 WHERE id=%s RETURNING True;
#                 ''', (
#                 class_["name"],
#                 class_["id"],
#             ))
#             if cursor.fetchone() is None:
#                 abort(400, 'There are not classes with on of ids')
#             db.commit()
#             print("OK", flush=True)
#         else:
#             print("Wrong json", flush=True)
#             abort(400, "Wrong json")
#     return jsonify({
#         "result": "OK"
#     }), 201


@admin_token_required
def get_classes():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT id, class_name
        FROM classes;
        '''
                   )
    exec_result = cursor.fetchall()
    if exec_result is None:
        return None
    result = [{
        "id": data[0],
        "name": data[1],
        "type": "Class"
    } for data in exec_result
    ]
    return jsonify(result), 200
