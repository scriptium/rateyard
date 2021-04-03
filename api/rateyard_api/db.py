import psycopg2
import requests

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

def check_email(email: str) -> bool:
    response = requests.get(
        "https://isitarealemail.com/api/email/validate",
        params = {'email': email},
        headers = {'Authorization': "Bearer " + current_app.config["EMAIL_VALIDATION_API_KEY"]}
    )
    return response.json()["status"] == "valid"


def get_group_full(id, marks_subject_id=None):
    cursor = get_db().cursor()
    cursor.execute('''
    SELECT gr.id, gr.group_name, cl.id, cl.class_name, gr.is_full_class_group
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
        "is_full_class_group": exec_result[4],
        "type": "GroupFull"
    }
    if (exec_result[4]):
        cursor.execute('''
        SELECT students.id, students.username, students.full_name, students.email, True
        FROM students
        INNER JOIN classes ON students.class_id=classes.id
        WHERE classes.id = %s;
        ''', (exec_result[2], ))
    else:
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

    fetched_marks_columns = {}
    for student in result['group_class_students']:
        exec_args = []
        if not marks_subject_id is None:
            exec_join_str = 'INNER JOIN marks_columns AS mc ON m.column_id=mc.id AND mc.subject_id=%s'
            exec_args.append(marks_subject_id)
        else: 
            exec_join_str = ''
        exec_args.append(student['id'])
        cursor.execute(f'''
        SELECT m.id, m.points, m.edition_date, m.comment, m.column_id
        FROM marks AS m {exec_join_str}
        WHERE m.student_id=%s;
        ''', exec_args)
        student['marks'] = []
        for mark_data in cursor.fetchall():
            if mark_data[4] in fetched_marks_columns.keys():
                column = fetched_marks_columns[mark_data[4]]
            else:
                cursor.execute('''
                SELECT column_name, column_date, creation_date
                FROM marks_columns
                WHERE id=%s
                ''', (mark_data[4], ))
                exec_result = cursor.fetchone()
                column = {
                    'id': mark_data[4],
                    'name': exec_result[0],
                    'date': exec_result[1].timestamp() if not exec_result[1] is None else None,
                    'creation_date': exec_result[2].timestamp()
                }
                fetched_marks_columns[mark_data[4]] = column

            student['marks'].append({
                'id': mark_data[0],
                'points': mark_data[1],
                'edition_date': mark_data[2].timestamp(),
                'comment': mark_data[3],
                'column': column,
            })

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

def edit_student(id, changes):
    student_mutable_attributes = (
        "username", "full_name", "email", "class_id")
    exec_args = []
    exec_sets = []

    for attribute_name in student_mutable_attributes:
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
        f"UPDATE students SET {exec_sets_joined} WHERE id=%s",
        exec_args + [id]
    )

    if "class_id" in changes.keys():
        cursor.execute(
            "DELETE FROM students_groups WHERE student_id=%s;",
            (id, )
        )

    db.commit()

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



def check_students_data(data, all_required=False):
    cursor = get_db().cursor()
    for student_index in range(len(data)):
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

        student = data[student_index]
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


def check_lecturer_data(lecturer):
    '''
        Error codes for lectures:
        0: teacher_id not found or teacher with this id doesn't exist
        1: group_id not found or group with this id doesn't exist
        2: subject_id not found or subject with this id doesn't exist
        3: lecturer with same data already exists 
    '''
    cursor = get_db().cursor()
    lecturer_data_errors = []
    print(lecturer)
    if (not "teacher_id" in lecturer.keys() or
        type(lecturer["teacher_id"]) != int):
        lecturer_data_errors.append(0)
    else:
        cursor.execute(
            "SELECT 1 FROM teachers WHERE id=%s",
            (lecturer["teacher_id"], )
        )
        if cursor.fetchone() is None:
            lecturer_data_errors.append(0)
    
    if (not "group_id" in lecturer.keys() or
        type(lecturer["group_id"]) != int):
        lecturer_data_errors.append(1)
    else:
        cursor.execute(
            "SELECT 1 FROM groups WHERE id=%s",
            (lecturer["group_id"], )
        )
        if cursor.fetchone() is None:
            lecturer_data_errors.append(1)

    if (not "subject_id" in lecturer.keys() or
        type(lecturer["subject_id"]) != int):
        lecturer_data_errors.append(2)
    else:
        cursor.execute(
            "SELECT 1 FROM subjects WHERE id=%s",
            (lecturer["subject_id"], )
        )
        if cursor.fetchone() is None:
            lecturer_data_errors.append(2)

    if lecturer_data_errors == []:
        cursor.execute('''
            SELECT 1
            FROM teachers_groups
            WHERE teacher_id=%s AND group_id=%s AND subject_id=%s
        ''', (lecturer["teacher_id"], lecturer["group_id"], lecturer["subject_id"]))

        if not cursor.fetchone() is None:
            lecturer_data_errors.append(3)

    return lecturer_data_errors


def check_subject_data(subject):
    '''
        Error codes for subject:
        0: subject_name not found or has already taken 
    '''
    cursor = get_db().cursor()
    subject_data_errors = []

    if (not "subject_name" in subject.keys() or
        type(subject["subject_name"]) != str or
        len(subject["subject_name"]) > 256):
        subject_data_errors.append(0)
    else:
        cursor.execute(
            "SELECT 1 FROM subjects WHERE subject_name=%s",
            (subject["subject_name"],)
        )
        if not cursor.fetchone() is None:
            subject_data_errors.append(0)

    return subject_data_errors
