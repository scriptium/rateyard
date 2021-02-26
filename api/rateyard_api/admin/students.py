from flask import Blueprint, request, abort, jsonify

from . import admin_token_required, get_db


def check_students_data(cursor, all_required=False):
    for student_index in range(len(request.json)):
        '''
        Error codes for students:
        0: username not found or has already taken
        1: full_name not found or has already taken
        2: class_id not found or is wrong
        3: password not found
        4: email not found or is already taken

        If something will go wrong this def will return json
        with error codes for each bad student index from request array.

        Example of json:
        [
            student_index: [error_code1, error_code2...],
            ...
        ]
        '''

        student = request.json[student_index]
        student_data_errors = {}

        was_error = False

        if "username" not in student.keys():
            if all_required:
                was_error = True
        elif (
            student["username"] == "" or
            type(student["username"]) != str or
            len(student["username"]) > 256
        ):
            was_error = True
        else:
            cursor.execute(
                "SELECT 1 FROM students WHERE username=%s;",
                (student['username'], )
            )
            if not cursor.fetchone() is None:
                was_error = True

        if was_error:
            student_data_errors[student_index] = [0]

        was_error = False

        if "full_name" not in student.keys():
            if all_required:
                was_error = True
        elif (
            type(student["full_name"]) != str or
            student["full_name"] == "" or
            len(student["full_name"]) > 256
        ):
            was_error = True

        if was_error:
            if type(student_data_errors.get(student_index)) != list:
                student_data_errors[student_index] = []
            student_data_errors[student_index].append(1)

        was_error = False

        if "class_id" not in student.keys():
            if all_required:
                was_error = True
        else:
            cursor.execute(
                "SELECT 1 FROM classes WHERE id=%s;",
                (student["class_id"], )
            )
            if cursor.fetchone() is None:
                was_error = True

        if was_error:
            if type(student_data_errors.get(student_index)) != list:
                student_data_errors[student_index] = []
            student_data_errors[student_index].append(2)

        was_error = False

        if ("password" not in student.keys()):
            if all_required:
                was_error = True
        elif (
            student["password"] == "" or
            type(student["password"]) != str or
            len(student["password"]) > 256
        ):
            was_error = True

        if was_error:
            if type(student_data_errors.get(student_index)) != list:
                student_data_errors[student_index] = []
            student_data_errors[student_index].append(3)

        was_error = False

        if "email" not in student.keys():
            if all_required:
                was_error = True
        elif (
            student["email"] == "" or
            type(student["email"]) != str or
            len(student["email"]) > 320
        ):
            was_error = True
        else:
            cursor.execute(
                "SELECT 1 FROM students WHERE email=%s;",
                (student['email'], )
            )
            if not cursor.fetchone() is None:
                was_error = True

        if was_error:
            if type(student_data_errors.get(student_index)) != list:
                student_data_errors[student_index] = []
            student_data_errors[student_index].append(4)

    return student_data_errors

@admin_token_required
def create_students():
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of students")
        print("Expected array of students", flush=True)

    db = get_db()
    cursor = db.cursor()
    student_data_errors = check_students_data(cursor, True)

    if student_data_errors == {}:
        for student in request.json:
            cursor.execute('''
                INSERT INTO students (
                    username,
                    full_name,
                    email,
                    password_hash,
                    class_id
                )
                VALUES (
                    %s, %s, %s,
                    crypt(%s, gen_salt('md5')),
                    %s
                );
                ''', (
                student["username"],
                student["full_name"],
                student["email"],
                student["password"],
                student["class_id"]
            ))
        db.commit()
        return jsonify({
            "result": "OK"
        })
    else:
        return jsonify(student_data_errors), 400

@admin_token_required
def delete_students():
    if not request.is_json:
        abort(400, "Expected json")
    if type(request.json) != list:
        abort(400, "Expected array of students id")
    exec_str = '''
            DELETE FROM students
            WHERE False
            '''
    exec_args = []
    for student_id in request.json:
        print(student_id)
        exec_str += (" OR  id=%s")
        exec_args.append(student_id)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(exec_str, exec_args)
    db.commit()
    return jsonify({
        "result": "OK"
    }), 200

@admin_token_required
def edit_students():
    print(request.json, flush=True)
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of students id")
        print("Expected array of students id", flush=True)

    db = get_db()
    cursor = db.cursor()
    student_data_errors = check_students_data(cursor, False)

    for student_index in range(len(request.json)):
        '''
        Additional error code for students:
        5: wrong student id
        '''
        if not "id" in request.json[student_index].keys():
            student_data_errors[student_index].append(6)

    if student_data_errors == {}:
        for student in request.json:
            student_mutable_attributes = (
                "username", "full_name", "email", "class_id")
            exec_args = []
            exec_sets = []

            for attribute_name in student_mutable_attributes:
                if attribute_name in student.keys():
                    exec_sets.append(f"{attribute_name}=%s")
                    exec_args.append(student[attribute_name])

            if "password" in student.keys():
                exec_sets.append("password_hash=crypt(%s, gen_salt('md5'))")
                exec_args.append(student["password"])

            if len(exec_sets) == 0:
                continue

            exec_sets_joined = ', '.join(exec_sets)

            print(exec_sets_joined, exec_args)
            cursor.execute(
                f"UPDATE students SET {exec_sets_joined} WHERE id=%s",
                exec_args + [student["id"]]
            )

            if "class_id" in student.keys():
                cursor.execute(
                    "DELETE FROM students_groups WHERE student_id=%s;",
                    (student["id"], )
                )
            db.commit()
            return jsonify(result="ok")

    else:
        return jsonify(student_data_errors), 400

@admin_token_required
def get_students():
    exec_str = '''
    SELECT students.id, students.username, students.full_name,
    students.email, students.class_id, classes.class_name
    FROM students
    LEFT OUTER JOIN classes ON students.class_id=classes.id
    '''
    exec_args = []

    if request.is_json:
        exec_str += " WHERE False"
        for student_id in request.json:
            print('id', student_id, flush=True)
            if type(student_id) != int:
                abort(400)
            exec_args.append(student_id)
            exec_str += " OR students.id=%s"

    db = get_db()
    cursor = db.cursor()
    cursor.execute(exec_str, exec_args)
    exec_result = cursor.fetchall()

    result = [{
        "id": data[0],
        "username": data[1],
        "full_name": data[2],
        "email": data[3],
        "class": {
            "id": data[4],
            "name": data[5],
            "type": "ClassShort"
        },
        "type": "Student"
    } for data in exec_result
    ]
    return jsonify(result)
