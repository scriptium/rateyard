CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE classes (
    id SERIAL PRIMARY KEY NOT NULL, 
    class_name VARCHAR(15) UNIQUE NOT NULL
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY NOT NULL, 
    username VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(320) UNIQUE,
    password_hash TEXT NOT NULL,
    class_id INTEGER REFERENCES classes(id) NOT NULL
);

CREATE TABLE teachers (
    id SERIAL PRIMARY KEY NOT NULL, 
    username VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(320) UNIQUE,
    password_hash TEXT NOT NULL
);

CREATE TABLE subjects (
    id SERIAL PRIMARY KEY NOT NULL,
    subject_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE groups (
    id SERIAL PRIMARY KEY NOT NULL, 
    group_name VARCHAR(100) NOT NULL,
    subject_id INTEGER REFERENCES subjects(id) NOT NULL
);

CREATE TABLE students_groups (
    student_id INTEGER REFERENCES students(id) NOT NULL, 
    group_id INTEGER REFERENCES groups(id) NOT NULL
);

CREATE TABLE teachers_groups (
    teacher_id INTEGER REFERENCES teachers(id) NOT NULL, 
    group_id INTEGER REFERENCES groups(id) NOT NULL
);

CREATE TABLE grades (
    id SERIAL PRIMARY KEY NOT NULL,
    grade_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    type_of_work VARCHAR(100) NOT NULL,
    description_text TEXT,
    student_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL
)
