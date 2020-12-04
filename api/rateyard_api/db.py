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


def get_student(student_id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT id, username, full_name, email, class_id
        FROM students WHERE id=%s;
    ''', (
        student_id
    ))
    data = cursor.fetchone()
    if data is None:
        raise ObjectNotExists
    return {
        "id": data[0],
        "username": data[1],
        "full_name": data[2],
        "email": data[3],
        "class_id": data[4],
        "type": "student"
    }


def get_teacher(teacher_id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT id, username, full_name, email
        FROM teachers WHERE id=%s;
    ''', (
        teacher_id
    ))
    data = cursor.fetchone()
    if data is None:
        raise ObjectNotExists
    return {
        "id": data[0],
        "username": data[1],
        "full_name": data[2],
        "email": data[3],
        "type": "teacher"
    }


def set_class(student_id: int, class_id: int):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        UPDATE students
        SET class_id=%s
        WHERE id=%s
    ''', (
        class_id,
        student_id
    ))
    db.commit()


def get_class_id(class_name: str):
    db = get_db()
    cursor = db.cursor()
    cursor.execute('''
        SELECT id
        FROM classes WHERE class_name=%s
    ''', (
        class_name,
    ))
    data = cursor.fetchone()
    if data is None:
        raise ObjectNotExists
    return data[0]

