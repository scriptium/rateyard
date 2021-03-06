CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE classes (
    id SERIAL PRIMARY KEY NOT NULL,
    class_name VARCHAR(15) UNIQUE NOT NULL
);
CREATE TABLE students (
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(256) UNIQUE NOT NULL,
    full_name VARCHAR(256) NOT NULL,
    email VARCHAR(320) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    password_hash TEXT NOT NULL,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE NOT NULL
);
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(256) UNIQUE NOT NULL,
    full_name VARCHAR(256) NOT NULL,
    email VARCHAR(320) UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    password_hash TEXT NOT NULL,
    block_after_minutes INT DEFAULT 0 NOT NULL
);
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY NOT NULL,
    subject_name VARCHAR(256) UNIQUE NOT NULL
);
CREATE TABLE groups (
    id SERIAL PRIMARY KEY NOT NULL,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    group_name VARCHAR(256) NOT NULL,
    is_full_class_group BOOLEAN NOT NULL
);
CREATE TABLE students_groups (
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE NOT NULL
);
CREATE TABLE teachers_groups (
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE NOT NULL,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE NOT NULL
);
CREATE TABLE marks_columns (
    id SERIAL PRIMARY KEY NOT NULL,
    subject_id INTEGER REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
    column_name VARCHAR(256),
    column_date TIMESTAMPTZ,
    creation_date TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE TABLE marks (
    id SERIAL PRIMARY KEY NOT NULL,
    points INTEGER NOT NULL,
    edition_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    comment VARCHAR(256),
    is_read BOOLEAN NOT NULL DEFAULT False,
    teacher_id INTEGER REFERENCES teachers(id) NOT NULL,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE NOT NULL,
    column_id INTEGER REFERENCES marks_columns(id) ON DELETE CASCADE NOT NULL
);
INSERT INTO classes (class_name)
VALUES ('8А');
INSERT INTO classes (class_name)
VALUES ('8Б');
INSERT INTO classes (class_name)
VALUES ('8В');
INSERT INTO classes (class_name)
VALUES ('8Г');
INSERT INTO classes (class_name)
VALUES ('9А');
INSERT INTO classes (class_name)
VALUES ('9Б');
INSERT INTO classes (class_name)
VALUES ('9В');
INSERT INTO classes (class_name)
VALUES ('9Г');
INSERT INTO classes (class_name)
VALUES ('10А');
INSERT INTO classes (class_name)
VALUES ('10Б');
INSERT INTO classes (class_name)
VALUES ('10В');
INSERT INTO classes (class_name)
VALUES ('10Г');
INSERT INTO classes (class_name)
VALUES ('11А');
INSERT INTO classes (class_name)
VALUES ('11Б');
INSERT INTO classes (class_name)
VALUES ('11В');
INSERT INTO classes (class_name)
VALUES ('11Г');
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 1, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 2, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 3, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 4, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 5, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 6, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 7, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 8, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 9, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 10, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 11, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 12, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 13, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 14, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 15, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Весь клас', 16, True);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Група 1', 16, False);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Група 2', 16, False);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Група 3', 16, False);
INSERT INTO groups (group_name, class_id, is_full_class_group)
VALUES ('Група 4', 16, False);
INSERT INTO students (
        username,
        full_name,
        email,
        password_hash,
        class_id
    )
VALUES (
        'shevel',
        'Шевель Денис',
        'shevel@mail.com',
        crypt('1', gen_salt('md5')),
        16
    );
INSERT INTO students (
        username,
        full_name,
        email,
        password_hash,
        class_id
    )
VALUES (
        'stetsiuk',
        'Стецюк Юрій',
        'stetsiuk@mail.com',
        crypt('1', gen_salt('md5')),
        16
    );
INSERT INTO students (
        username,
        full_name,
        email,
        password_hash,
        class_id
    )
VALUES (
        'patraboy',
        'Патрабой Назарій',
        'patraboy@mail.com',
        crypt('1', gen_salt('md5')),
        16
    );
INSERT INTO students (
        username,
        full_name,
        email,
        password_hash,
        class_id
    )
VALUES (
        'borovyi',
        'Боровий Іван',
        'borovyi@mail.com',
        crypt('1', gen_salt('md5')),
        16
    );
INSERT INTO students (
        username,
        full_name,
        email,
        password_hash,
        class_id
    )
VALUES (
        'gavrysh',
        'Гавриш Олексій',
        'gavrysh@mail.com',
        crypt('1', gen_salt('md5')),
        16
    );
INSERT INTO teachers (username, full_name, email, password_hash)
VALUES (
        'moroz',
        'Мороз Микола Петрович',
        'moroz@mail.com',
        crypt('1', gen_salt('md5'))
    );
INSERT INTO teachers (username, full_name, email, password_hash)
VALUES (
        'sklyar',
        'Скляр Ірина Вільївна',
        'sklyar@mail.com',
        crypt('1', gen_salt('md5'))
    );
INSERT INTO teachers (username, full_name, email, password_hash)
VALUES (
        'perga',
        'Перга Вікторія Віталіївна',
        'perga@mail.com',
        crypt('1', gen_salt('md5'))
    );
INSERT INTO teachers (username, full_name, email, password_hash)
VALUES (
        'rzhanska',
        'Ржанська Тетяна Миколаївна',
        'rzhanska@mail.com',
        crypt('1', gen_salt('md5'))
    );
INSERT INTO subjects (subject_name)
VALUES ('Алгебра');
INSERT INTO subjects (subject_name)
VALUES ('Геометрія');
INSERT INTO subjects (subject_name)
VALUES ('Фізика');
INSERT INTO subjects (subject_name)
VALUES ('Інформатика');
INSERT INTO subjects (subject_name)
VALUES ('Фізична культура');
INSERT INTO teachers_groups (teacher_id, group_id, subject_id)
VALUES (1, 16, 1);
INSERT INTO marks_columns (subject_id, column_name)
VALUES (1, 'Зошит за вересень');
INSERT INTO marks (
        points,
        comment,
        is_read,
        teacher_id,
        student_id,
        column_id
    )
VALUES (1, 'Не перездаєтся', False, 1, 3, 1);

INSERT INTO marks_columns (subject_id, column_date)
VALUES (1, NOW());
INSERT INTO marks (
        points,
        comment,
        is_read,
        teacher_id,
        student_id,
        column_id
    )
VALUES (1, 'dfsfsd', False, 1, 3, 2);

INSERT INTO marks_columns (subject_id, column_name)
VALUES (5, 'Розтяжка');
INSERT INTO marks (
        points,
        comment,
        is_read,
        teacher_id,
        student_id,
        column_id
    )
VALUES (1, 'Погано розтягуєшся', False, 4, 3, 3);

INSERT INTO marks_columns (subject_id, column_date, column_name)
VALUES (1, NOW(), 'КР 1');
INSERT INTO marks (
        points,
        comment,
        is_read,
        teacher_id,
        student_id,
        column_id
    )
VALUES (1, 'dfsfsd', False, 1, 3, 4);



INSERT INTO teachers_groups (teacher_id, group_id, subject_id)
VALUES (1, 17, 2);
INSERT INTO teachers_groups (teacher_id, group_id, subject_id)
VALUES (3, 15, 3);
INSERT INTO teachers_groups (teacher_id, group_id, subject_id)
VALUES (2, 2, 4);