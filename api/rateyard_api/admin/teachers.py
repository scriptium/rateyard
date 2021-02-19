from flask import Blueprint, request, abort, jsonify

from . import admin_token_required, get_db



def check_teacher_data(cursor, all_required=False):
    for teacher_index in range(len(request.json)):
        '''
        Error codes for teachers:
        0: username not found or has already taken
        1: full_name not found or has already taken
        2: password not found
        3: email not found or is already taken

        If something goes wrong this def will return json
        with error codes for each bad teacher index from request array.

        Example of json:
        [
            teacher_index: [error_code1, error_code2...],
            ...
        ]
        '''

        teacher = request.json[teacher_index]
        teacher_data_errors = {}

        was_error = False

        if "username" not in teacher.keys():
            if all_required:
                was_error = True
        elif (
            teacher["username"] == "" or
            type(teacher["username"]) != str or
            len(teacher["username"]) > 256
        ):
            was_error = True
        else:
            cursor.execute(
                "SELECT 1 FROM teachers WHERE username=%s;",
                (teacher['username'], )
            )
            if not cursor.fetchone() is None:
                was_error = True

        if was_error:
            teacher_data_errors[teacher_index] = [0]

        was_error = False

        if "full_name" not in teacher.keys():
            if all_required:
                was_error = True
        elif (
            type(teacher["full_name"]) != str or
            teacher["full_name"] == "" or
            len(teacher["full_name"]) > 256
        ):
            was_error = True
        else:
            cursor.execute(
                "SELECT 1 FROM teachers WHERE full_name=%s;",
                (teacher['full_name'], )
            )
            if not cursor.fetchone() is None:
                was_error = True

        if was_error:
            if type(teacher_data_errors.get(teacher_index)) != list:
                teacher_data_errors[teacher_index] = []
            teacher_data_errors[teacher_index].append(1)

        was_error = False

        if ("password" not in teacher.keys()):
            if all_required:
                was_error = True
        elif (
            teacher["password"] == "" or
            type(teacher["password"]) != str or
            len(teacher["password"]) > 256
        ):
            was_error = True

        if was_error:
            if type(teacher_data_errors.get(teacher_index)) != list:
                teacher_data_errors[teacher_index] = []
            teacher_data_errors[teacher_index].append(2)

        was_error = False

        if "email" not in teacher.keys():
            if all_required:
                was_error = True
        elif (
            teacher["email"] == "" or
            type(teacher["email"]) != str or
            len(teacher["email"]) > 320
        ):
            was_error = True
        else:
            cursor.execute(
                "SELECT 1 FROM teachers WHERE email=%s;",
                (teacher['email'], )
            )
            if not cursor.fetchone() is None:
                was_error = True

        if was_error:
            if type(teacher_data_errors.get(teacher_index)) != list:
                teacher_data_errors[teacher_index] = []
            teacher_data_errors[teacher_index].append(3)

    return teacher_data_errors


@admin_token_required
def get_teachers():
    exec_str = '''
    SELECT teachers.id, teachers.username, teachers.full_name, teachers.email
    FROM teachers
    '''
    exec_args = []

    if request.is_json:
        exec_str += " WHERE False"
        for teacher_id in request.json:
            print('id', teaher_id, flush=True)
            if type(teacher_id) != int:
                abort(400)
            exec_args.append(teacher_id)
            exec_str += " OR teachers.id=%s"

    db = get_db()
    cursor = db.cursor()
    cursor.execute(exec_str, exec_args)
    exec_result = cursor.fetchall()
    print(exec_result, flush=True)
    
    result = [{
        "id": data[0],
        "username": data[1],
        "full_name": data[2],
        "email": data[3],
        "type": "Teacher"
    } for data in exec_result
    ]
    return jsonify(result), 200

@admin_token_required
def create_teachers():
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of teachers")
        print("Expected array of teachers", flush=True)

    db = get_db()
    cursor = db.cursor()
    teacher_data_errors = check_teacher_data(cursor, True)

    if teacher_data_errors == {}:
        for teacher in request.json:
            cursor.execute('''
                INSERT INTO teachers (
                    username,
                    full_name,
                    email,
                    password_hash
                )
                VALUES (
                    %s, %s, %s,
                    crypt(%s, gen_salt('md5'))
                );
                ''', (
                teacher["username"],
                teacher["full_name"],
                teacher["email"],
                teacher["password"]
            ))
        db.commit()
        return jsonify({
            "result": "OK"
        })
    else:
        return jsonify(teacher_data_errors), 400


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

