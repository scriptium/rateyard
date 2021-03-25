let teacherRateyardApiClient = new RateyardApiClient(
    localStorage.getItem('teacher_access_token'),
    localStorage.getItem('teacher_refresh_token'),
    '/teacher/',
    (accessToken, refreshToken) => {
        localStorage.setItem('teacher_access_token', accessToken),
            localStorage.setItem('teacher_refresh_token', refreshToken)
    },
    () => {
        console.log('Wrong token')
        document.location.replace('/teacher/login.php');
    }
)

async function getMe() {
    let xhr = await teacherRateyardApiClient.sendRequest(
        'get_me', 'GET', {}, null, true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function editMe(changes) {
    let xhr = await teacherRateyardApiClient.sendRequest(
        'edit_me', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(changes), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function getGroupFull(id) {
    let xhr = await teacherRateyardApiClient.sendRequest(
        'get_group_full', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify({id}), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function deleteMark(id) {
    let xhr = await teacherRateyardApiClient.sendRequest(
        'delete_mark', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify({id}), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function createMark(markJSON) {
    let xhr = await teacherRateyardApiClient.sendRequest(
        'create_mark', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(markJSON), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function editMark(markJSON) {
    let xhr = await teacherRateyardApiClient.sendRequest(
        'edit_mark', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(markJSON), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}