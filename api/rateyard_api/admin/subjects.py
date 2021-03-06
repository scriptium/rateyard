from flask import jsonify, request, abort


from . import admin_token_required, db

@admin_token_required
def get_subjects():
    cursor = db.get_db().cursor()
    cursor.execute('''
        SELECT id, subject_name
        FROM subjects
    ''')
    exec_result = cursor.fetchall()
    result = [{
        "id": data[0],
        "name": data[1],
        "type": "Subject"
    } for data in exec_result
    ]
    return jsonify(result)

@admin_token_required
def create_subject():
    if not request.is_json:
        abort("400", "Expected json")

    database = db.get_db()
    cursor = database.cursor()

    subject_data_errors = db.check_subject_data(request.json)
    if subject_data_errors == []:
        cursor.execute('''
            INSERT INTO subjects (
                subject_name
            )
            VALUES (
                %s
            );
            ''', (
            request.json["subject_name"],
        ))
        database.commit()
        return jsonify(result="ok")
    else:
        return jsonify(subject_data_errors), 400

@admin_token_required
def edit_subjects():
    print(request.json, flush=True)
    if not request.is_json:
        print("Expected json", flush=True)
        abort(400, "Expected json")
    if type(request.json) != list:
        print("Expected array of subjects id", flush=True)
        abort(400, "Expected array of subjects id")
    for subject in request.json:
        if ("subject_id" in subject.keys() and
                "subject_name" in subject.keys()):
            database = db.get_db()
            cursor = database.cursor()
            cursor.execute('''
                UPDATE subjects
                SET subject_name=%s
                WHERE id=%s RETURNING True;
                ''', (
                subject["subject_name"],
                subject["subject_id"],
            ))
            if cursor.fetchone() is None:
                abort(400, 'There are no subjects with on of ids')
            database.commit()
            print("OK", flush=True)
        else:
            print("Wrong json", flush=True)
            abort(400, "Wrong json")
    return jsonify(result="OK")


@admin_token_required
def delete_subjects():
    if not request.is_json:
        abort(400, "Expected json")
    if type(request.json) != list:
        abort(400, "Expected array of subjects id")
    exec_str = '''
            DELETE FROM subjects
            WHERE False
            '''
    exec_args = []
    for subject_id in request.json:
        print(subject_id)
        exec_str += (" OR  id=%s")
        exec_args.append(subject_id)
    database = db.get_db()
    cursor = database.cursor()
    cursor.execute(exec_str, exec_args)
    database.commit()
    return jsonify({
        "result": "OK"
    }), 200