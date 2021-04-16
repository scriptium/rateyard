let adminRateyardApiClient = new RateyardApiClient(
    localStorage.getItem('admin_access_token'),
    localStorage.getItem('admin_refresh_token'),
    '/admin/',
    (accessToken, refreshToken) => {
        localStorage.setItem('admin_access_token', accessToken),
            localStorage.setItem('admin_refresh_token', refreshToken)
    },
    () => {
        console.log('Wrong token')
        document.location.replace('/admin/login.php');
    }
)

async function createStudents(students) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'create_students', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(students), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function getStudents(ids) {
    let headers;
    let body;
    if (ids != undefined) {
        headers = { 'Content-type': 'application/json' }
        body = JSON.stringify(ids);
    }
    let xhr = await adminRateyardApiClient.sendRequest('get_students', 'POST', headers, body, true);
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function editStudents(studentsChanges) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'edit_students', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(studentsChanges), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function deleteStudents(ids) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'delete_students', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(ids), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}


async function createTeachers(teachers) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'create_teachers', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(teachers), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function getTeachers(ids) {
    let headers;
    let body;
    if (ids != undefined) {
        headers = { 'Content-type': 'application/json' }
        body = JSON.stringify(ids);
    }
    let xhr = await adminRateyardApiClient.sendRequest('get_teachers', 'POST', headers, body, true);
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function editTeachers(teachersChanges) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'edit_teachers', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(teachersChanges), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function deleteTeachers(ids) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'delete_teachers', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(ids), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}


async function createGroup(name, classId, studentsIds) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'create_group', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify({
            name,
            class_id: classId,
            students_ids: studentsIds
        }), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function getGroupsShort(editable, student_id, teacher_id, class_id) {
    let body = null;
    let headers = {};
    if (typeof editable != 'undefined' || typeof student_id != undefined ||
         typeof teacher_id != undefined || typeof class_id != undefined) {
        headers = { 'Content-type': 'application/json' };
        let requestJSON = {};
        if (typeof editable != 'undefined') requestJSON.editable = editable;
        if (typeof student_id != 'undefined') requestJSON.student_id = student_id;
        if (typeof teacher_id != 'undefined') requestJSON.teacher_id = teacher_id;
        if (typeof class_id != 'undefined') requestJSON.class_id = class_id;
        
        body = JSON.stringify(requestJSON);
    }
    let xhr = await adminRateyardApiClient.sendRequest('get_groups_short', 'POST', headers, body, true);
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function getGroupFull(id) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'get_group_full', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify({ id }), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function editGroup(groupChanges) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'edit_group', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(groupChanges), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function deleteGroup(id) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'delete_group', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify({ id }), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}


async function getClassesShort() {
    let xhr = await adminRateyardApiClient.sendRequest('get_classes_short', 'GET', {}, null, true);
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function getClassFull(id) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'get_class_full', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify({ id }), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}

async function deleteStudentsFromClass(class_id) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'delete_students_from_class', 'POST', { 'Content-Type': 'application/json'},
        JSON.stringify({ class_id }), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}

async function moveStudentsToClass(class_id_from, class_id_to) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'move_students_to_class', 'POST', { 'Content-Type': 'application/json'},
        JSON.stringify({ class_id_from, class_id_to }), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}

async function createLecturer(lecturer) {
    console.log(lecturer);
    let xhr = await adminRateyardApiClient.sendRequest(
        'create_lecturer', 'POST', { 'Content-Type': 'application/json'},
        JSON.stringify(lecturer), true
    );
    return {
        status: xhr.status, 
        json: JSON.parse(xhr.responseText)
    }
}

async function deleteLecturer(lecturer) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'delete_lecturer', 'POST', { 'Content-Type': 'application/json'},
        JSON.stringify(lecturer), true
    );
    return {
        status: xhr.status, 
        json: JSON.parse(xhr.responseText)
    }
}

async function createSubject(subject_name) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'create_subject', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify({ subject_name }), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function getSubjects() {
    let xhr = await adminRateyardApiClient.sendRequest(
        'get_subjects', 'GET', {}, null, true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function editSubjects(subjectsChanges) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'edit_subjects', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(subjectsChanges), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function deleteSubjects(subjectsId) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'delete_subjects', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(subjectsId), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function importStudentsFromExcel(students_table) {
    let xhr = await adminRateyardApiClient.sendRequest(
        'import_from_excel', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(students_table), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}