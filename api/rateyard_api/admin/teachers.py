from flask import Blueprint, request, abort, jsonify

from . import admin_token_required, db


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
            print('id', teacher_id, flush=True)
            if type(teacher_id) != int:
                abort(400)
            exec_args.append(teacher_id)
            exec_str += " OR teachers.id=%s"

    cursor = db.get_db().cursor()
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
    print(1)
    if not request.is_json:
        print("Expected json", flush=True)
        abort(400, "Expected json")
    if type(request.json) != list:
        print("Expected array of teachers", flush=True)
        abort(400, "Expected array of teachers")

    database = db.get_db()
    cursor = database.cursor()
    teacher_data_errors = db.check_teachers_data(request.json, True)
    print ( teacher_data_errors)
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
        database.commit()
        return jsonify({
            "result": "OK"
        })
    else:
        return jsonify(teacher_data_errors), 400


@admin_token_required
def delete_teachers():
    if not request.is_json:
        abort(400, "Expected json")
    if type(request.json) != list:
        abort(400, "Expected array of teachers id")
    exec_str = '''
            DELETE FROM teachers
            WHERE False
            '''
    exec_args = []
    for teacher_id in request.json:
        print(teacher_id)
        exec_str += (" OR  id=%s")
        exec_args.append(teacher_id)
    database = db.get_db()
    cursor = db.cursor()
    cursor.execute(exec_str, exec_args)
    database.commit()
    return jsonify({
        "result": "OK"
    }), 200


@admin_token_required
def edit_teachers():
    print(request.json, flush=True)
    if not request.is_json:
        print("Expected json", flush=True)
        abort(400, "Expected json")
    if type(request.json) != list:
        print("Expected array of teachers id", flush=True)
        abort(400, "Expected array of teachers id")
       
    teacher_data_errors = db.check_teachers_data(request.json, False)

    for teacher_index in range(len(request.json)):
        '''
        Additional error code for teachers:
        5: wrong teacher id
        '''
        if not "id" in request.json[teacher_index].keys():
            teacher_data_errors[teacher_index].append(6)

    if teacher_data_errors == {}:
        for teacher in request.json:
            db.edit_teacher(int(teacher['id']), teacher) 
        return jsonify(result="ok")

    else:
        return jsonify(teacher_data_errors), 400

