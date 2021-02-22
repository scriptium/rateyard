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

async function getGroupsShort(editable, student_id) {
    let body = null;
    let headers = {};
    if (typeof editable != 'undefined' || typeof student_id != undefined) {
        headers = { 'Content-type': 'application/json' };
        let requestJSON = {};
        if (typeof editable != 'undefined') requestJSON.editable = editable;
        if (typeof student_id != 'undefined') requestJSON.student_id = student_id;

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
    }
}















