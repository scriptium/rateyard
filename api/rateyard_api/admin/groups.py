from flask import json, request, abort, jsonify

from . import admin_token_required, db


def check_group_data(cursor, edit=False):
    '''
    Error codes for groups:
    0: class_id not found or is wrong (If edit is True class_id will be ignored)
    1: name not found or has already taken
    2: found wrong student id
    '''

    group_data_errors = []

    was_error = False

    if edit:
        pass
    elif (
        not "class_id" in request.json.keys() or
        type(request.json["class_id"]) != int
    ):
        was_error = True
    else:
        cursor.execute('''
        SELECT 1 FROM classes WHERE id=%s;
        ''', (request.json["class_id"], ))

        if cursor.fetchone() is None:
            was_error = True

    if was_error: group_data_errors.append(0)


    was_error = False

    if not edit: pass
    elif (
        not request.is_json or
        not "id" in request.json.keys() or 
        type(request.json["id"]) != int
    ):
        was_error = True
    else:
        cursor.execute("SELECT 1 FROM groups WHERE id=%s", (request.json["id"], ))
        if cursor.fetchone() is None:
            was_error = True

    if was_error:
        '''
        Additional error code from groups
        3: wrong group id
        '''
        group_data_errors.append(3)


    was_error = False

    if not "name" in request.json.keys():
        if not edit: was_error = True
    elif (
        request.json["name"] == "" or
        type(request.json["name"]) != str or
        len(request.json["name"]) > 256
    ):
        was_error = True
    elif not 0 in group_data_errors: 
        if edit:
            if not 3 in group_data_errors:
                cursor.execute('''
                SELECT 1 FROM groups
                WHERE class_id IN 
                (SELECT class_id FROM groups WHERE id=%s) AND
                group_name=%s;
                ''', (request.json["id"], request.json["name"]))
                if not cursor.fetchone() is None:
                    was_error = True 
            else: was_error = True
        else:
            cursor.execute('''
            SELECT 1 FROM groups WHERE group_name=%s AND class_id=%s
            ''', (request.json["name"], request.json["class_id"]))
            if not cursor.fetchone() is None:
                was_error = True 


    else: was_error = True

    if was_error: group_data_errors.append(1)

    was_error = False

    if not "students_ids" in request.json.keys():
        if not edit:
            was_error = True
    elif type(request.json["students_ids"]) != list:
        was_error = True
    else:
        for student_id in request.json["students_ids"]:
            if type(student_id) != int:
                group_data_errors.append(2)
                break
            
            cursor.execute('''
            SELECT 1 FROM students WHERE id=%s
            ''', (student_id, ))

            if cursor.fetchone() is None:
                group_data_errors.append(2)
                break


    return group_data_errors


def set_group_students(cursor, group_id):
    cursor.execute("DELETE FROM students_groups WHERE group_id=%s;", (group_id, ))
    for student_id in request.json["students_ids"]:
        cursor.execute('''
        INSERT INTO students_groups (group_id, student_id)
        VALUES (%s, %s);
        ''', (group_id, student_id))


@admin_token_required
def create_group():
    if not request.is_json:
        abort("400", "Expected json")

    database = db.get_db()
    cursor = database.cursor()

    group_data_errors = check_group_data(cursor)

    if group_data_errors != []:
        return jsonify(group_data_errors), 400

    cursor.execute('''
    INSERT INTO groups (class_id, group_name, is_editable)
    VALUES (%s, %s, True) RETURNING id;
    ''', (request.json["class_id"], request.json["name"]))

    group_id = cursor.fetchone()[0]
    set_group_students(cursor, group_id)
    database.commit()

    return jsonify(result="ok")


@admin_token_required
def get_groups_short():
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
        if "teacher_id" in request.json.keys():
            if type(request.json["teacher_id"]) == int:
                exec_main_str += '''
                INNER JOIN teachers_groups as tcgr ON tcgr.group_id=gr.id
                '''
                exec_args.append(request.json["teacher_id"])
                exec_where_str = " WHERE tcgr.teacher_id=%s"
            else:
                abort(400)
        if "class_id" in request.json.keys():
            if(type(request.json["class_id"])) == int:
                exec_where_str += " WHERE class_id=%s"
                exec_args.append(request.json["class_id"])
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

    cursor = db.get_db().cursor()
    cursor.execute(exec_main_str + exec_where_str, exec_args)
    exec_result = cursor.fetchall()

    result = [{
        "id": data[0],
        "name": data[1],
        "class": {
            "type": "ClassShort",
            "id": data[2],
            "name": data[3]
        },
        "type": "GroupShort"
    } for data in exec_result
    ]
    return jsonify(result)


@admin_token_required
def get_group_full():
    if (
        not request.is_json or
        not "id" in request.json.keys() or
        type(request.json["id"]) != int
    ):
        abort(400)

    response_json = db.get_group_full(request.json['id'])

    if response_json is None:
        abort(400)
    
    return jsonify(response_json)


@admin_token_required
def edit_group():
    database = db.get_db()
    cursor = database.cursor()

    group_data_errors = check_group_data(cursor, True)

    if group_data_errors != []:
        return jsonify(group_data_errors), 400

    was_edit = False

    if "name" in request.json.keys():
        was_edit = True
        cursor.execute('''
        UPDATE groups SET group_name=%s WHERE id=%s;
        ''', (request.json["name"], request.json["id"]))

    if "students_ids" in request.json.keys():
        was_edit = True
        set_group_students(cursor, request.json["id"])

    if was_edit:
        database.commit()
        return jsonify(result="ok")
    else:
        abort(400, "No changes provided")


@admin_token_required
def delete_group():
    if (
        not request.is_json or
        not "id" in request.json.keys() or
        type(request.json["id"]) != int
    ):
        abort(400)

    database = db.get_db()
    cursor = database.cursor()

    cursor.execute('''
    DELETE FROM groups WHERE id=%s RETURNING 1;
    ''', (request.json["id"], ))

    if cursor.fetchone() is None:
        abort(400)

    database.commit()
    return jsonify(result="ok")

#     @bp.route("/add_students_to_group", methods=("POST", ))
# @admin_token_required
# def add_students_to_group():
#     if not request.is_json:
#         abort("400", "Expected json")
#     print(request.json, flush=True)
#     if ("group_id" in request.json.keys() and
#             "students_ids" in request.json.ke     ys() and
#             type(request.json["students_ids"]) != list):
#         abort(400, "Expected group id and array of students ids")
#     for student_id in request.json["students_ids"]:
#         db = db.get_db()
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
#         db = db.get_db()
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
