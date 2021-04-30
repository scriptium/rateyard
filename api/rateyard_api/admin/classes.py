from flask import Blueprint, request, abort, jsonify

from . import admin_token_required, db

@admin_token_required
def delete_students_from_class():
    if not request.is_json:
        abort(400, "Expected json")
    if (not "class_id" in request.json or
            type(request.json["class_id"]) != int):
        abort(400, "Expected class id as int")
    database = db.get_db()
    cursor = database.cursor()
    cursor.execute('''
            DELETE FROM students
            WHERE class_id=%s
            ''', 
            (request.json["class_id"], )
    )
    database.commit()
    return jsonify({
        "result": "OK"
    }), 200


@admin_token_required
def get_classes_short():
    cursor = db.get_db().cursor()
    cursor.execute('''
        SELECT id, class_name
        FROM classes ORDER BY id;
        '''
                   )
    exec_result = cursor.fetchall()
    if exec_result is None:
        return None
    result = [{
        "id": data[0],
        "name": data[1],
        "type": "ClassShort"
    } for data in exec_result
    ]
    return jsonify(result), 200


@admin_token_required
def get_class_full():
    print(request.json)
    if (
            not request.is_json or
            not "id" in request.json.keys() or
            type(request.json["id"]) != int
    ):
        abort(400)

    cursor = db.get_db().cursor()
    cursor.execute(
        "SELECT id, class_name FROM classes WHERE id=%s",
        (request.json["id"], )
    )
    class_exec_result = cursor.fetchone()

    if class_exec_result is None:
        abort(400)

    cursor.execute(
        '''
        SELECT id, username, full_name, email 
        FROM students WHERE class_id=%s ORDER BY full_name
        ''',
        (request.json["id"], )
    )
    students_exec_result = cursor.fetchall()

    return jsonify({
        "type": "ClassFull",
        "id": class_exec_result[0],
        "name": class_exec_result[1],
        "students": [
            {
                "id": student_data[0],
                "username": student_data[1],
                "full_name": student_data[2],
                "email": student_data[3],
                "type": "StudentWithoutClass"
            } for student_data in students_exec_result
        ]
    })

@admin_token_required
def move_students_to_class():
    if (
            not request.is_json or
            not "class_id_from" in request.json.keys() or
            type(request.json["class_id_from"]) != int or
            not "class_id_to" in request.json.keys() or
            type(request.json["class_id_to"]) != int
    ):
        abort(400, "Expected json with class_id_from and class_id_to as ints")
    database = db.get_db()
    cursor = database.cursor()
    try:
        cursor.execute('''
            UPDATE students
            SET class_id=%s
            WHERE class_id=%s
        ''', (request.json["class_id_to"], request.json["class_id_from"]))
        cursor.execute('''
            UPDATE groups
            SET class_id=%s
            WHERE class_id=%s AND is_full_class_group=False
        ''', (request.json["class_id_to"], request.json["class_id_from"]))
        cursor.execute('''
            DELETE FROM teachers_groups AS tg
            WHERE tg.group_id=%s AND EXISTS(
            SELECT 1 FROM teachers_groups AS tcgr
            WHERE tcgr.group_id=%s AND
            tcgr.teacher_id=tg.teacher_id AND
            tcgr.subject_id=tg.subject_id
            )
        ''', (request.json["class_id_to"], request.json["class_id_from"]))
        cursor.execute('''
            UPDATE teachers_groups AS tg
            SET group_id=%s
            WHERE group_id=%s
        ''', (request.json["class_id_to"], request.json["class_id_from"]))
    except db.psycopg2.errors.ForeignKeyViolation:
        abort(400, "Class with class_id_to doesn't exist")
    else:
        database.commit()
    return jsonify(result="ok")

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
#             db = db.get_db()
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
def create_class():
    if not (
        request.is_json and
        type(request.json.get("name")) is str and
        len(request.json['name']) in range(1, 257) and
        type(request.json.get("students_ids")) == list
    ): 
        abort(400, "Expected json with name and students_ids")

    database = db.get_db()
    cursor = database.cursor()
    cursor.execute(r'''
    SELECT EXISTS(SELECT 1 FROM classes WHERE class_name=%s);
    ''', (request.json['name'], ))
    if cursor.fetchone()[0]:
        abort(400, 'Class with this name already exists')

    cursor.execute('''
        INSERT INTO classes (class_name)
        VALUES (%s) RETURNING id;
    ''', (request.json["name"], ))
    class_id = cursor.fetchone()[0]
    cursor.execute('''
        INSERT INTO groups (group_name, class_id, is_full_class_group)
        VALUES ('Весь клас', %s, True); 
    ''', (class_id, ))
    for id_ in request.json["students_ids"]:
        db.edit_student(id_, {"class_id": class_id})
    
    database.commit()
    return jsonify({"result": "ok"}), 200
