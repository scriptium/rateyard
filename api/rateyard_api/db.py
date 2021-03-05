import psycopg2

from flask import current_app, g


def get_db():
    if "db" not in g:
        g.db = psycopg2.connect(
            dbname=current_app.config["DB_NAME"],
            user=current_app.config["DB_USER"],
            password=current_app.config["DB_PASSWORD"],
            host=current_app.config["DB_HOST"]
        )
    return g.db


def close_db(e=None):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def get_group_full(id):
    cursor = get_db().cursor()
    cursor.execute('''
    SELECT gr.id, gr.group_name, cl.id, cl.class_name
    FROM groups as gr
    LEFT JOIN classes as cl ON gr.class_id = cl.id
    WHERE gr.id = %s;
    ''', (id, ))

    exec_result = cursor.fetchone()

    if exec_result is None:
        return None

    result = {
        "id": exec_result[0],
        "name": exec_result[1],
        "class": {
            "type": "ClassShort",
            "id": exec_result[2],
            "name": exec_result[3]
        },
        "type": "GroupFull"
    }

    cursor.execute('''
    SELECT students.id, students.username, students.full_name, students.email,
    EXISTS(
        SELECT 1 FROM students_groups
        WHERE students.id=students_groups.student_id AND
        students_groups.group_id=%s
    )
    FROM students
    INNER JOIN classes ON students.class_id=classes.id
    WHERE classes.id = %s;
    ''', (id, exec_result[2]))

    result["group_class_students"] = [
        {
            "id": data[0],
            "username": data[1],
            "full_name": data[2],
            "email": data[3],
            "is_group_member": data[4],
            "type": "GroupClassStudent"
        } for data in cursor.fetchall()
    ]

    cursor.execute('''
        SELECT teachers.id, teachers.username, teachers.full_name, teachers.email, subjects.id, subjects.subject_name
        FROM teachers_groups
        INNER JOIN teachers ON teachers_groups.teacher_id=teachers.id
        INNER JOIN subjects ON teachers_groups.subject_id=subjects.id
        WHERE teachers_groups.group_id=%s
    ''', (id, ))

    result["group_lecturers"] = [
        {
            "id": data[0],
            "username": data[1],
            "full_name": data[2],
            "email": data[3],
            "subject": {
                "id": data[4],
                "name": data[5],
                "type": "Subject"
            },
            "type": "GroupLecturer"
        } for data in cursor.fetchall()
    ]

    return result

def edit_teacher(id, changes):
    teacher_mutable_attributes = (
        "username", "full_name", "email")
    exec_args = []
    exec_sets = []

    for attribute_name in teacher_mutable_attributes:
        if attribute_name in changes.keys():
            exec_sets.append(f"{attribute_name}=%s")
            exec_args.append(changes[attribute_name])

    if "password" in changes.keys():
        exec_sets.append("password_hash=crypt(%s, gen_salt('md5'))")
        exec_args.append(changes["password"])

    if len(exec_sets) == 0: 
        return

    exec_sets_joined = ', '.join(exec_sets)

    print(exec_sets_joined, exec_args)
    db = get_db()
    cursor = db.cursor()
    cursor.execute(
        f"UPDATE teachers SET {exec_sets_joined} WHERE id=%s",
        exec_args + [id]
    )

    db.commit()


def check_teachers_data(data, all_required=False):
    cursor = get_db().cursor()
    for teacher_index in range(len(data)):
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

        teacher = data[teacher_index]
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