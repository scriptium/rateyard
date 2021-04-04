from flask import Blueprint, request, abort, jsonify

from . import admin_token_required, db

@admin_token_required
def create_students():
    if not request.is_json:
        abort(400, "Expected json")
        print("Expected json", flush=True)
    if type(request.json) != list:
        abort(400, "Expected array of students")
        print("Expected array of students", flush=True)

    database = db.get_db()
    cursor = database.cursor()
    student_data_errors = db.check_students_data(request.json, True)
    was_error = False
    if student_data_errors == {}:
        for student in request.json:
            try:
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
            except Exception:
                was_error = True
                
        database.commit()
        if was_error:
            return jsonify({'result': 'Not all students have created'})
        else:
            return jsonify({
                "result": "OK",
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
    database = db.get_db()
    cursor = database.cursor()
    cursor.execute(exec_str, exec_args)
    database.commit()
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

    student_data_errors = db.check_students_data(request.json, False)

    for student_index in range(len(request.json)):
        '''
        Additional error code for students:
        5: wrong student id
        '''
        if not "id" in request.json[student_index].keys():
            student_data_errors[student_index].append(6)

    if student_data_errors == {}:
        for student in request.json:
            db.edit_student(int(student['id']), student) 
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

    cursor = db.get_db().cursor()
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
