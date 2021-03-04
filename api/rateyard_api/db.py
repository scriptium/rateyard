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

        

def get_group_full_from_db(id):
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
