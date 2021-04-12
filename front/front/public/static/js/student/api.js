let studentRateyardApiClient = new RateyardApiClient(
    localStorage.getItem('student_access_token'),
    localStorage.getItem('student_refresh_token'),
    '/student/',
    (accessToken, refreshToken) => {
        localStorage.setItem('student_access_token', accessToken),
            localStorage.setItem('student_refresh_token', refreshToken)
    },
    () => {
        console.log('Wrong token')
        document.location.replace('/student/login.php');
    }
);

async function getMe() {
    let xhr = await studentRateyardApiClient.sendRequest(
        'get_me', 'GET', {}, null, true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}

async function editMe(changes) {
    let xhr = await studentRateyardApiClient.sendRequest(
        'edit_me', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(changes), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function getSubject(id) {
    let xhr = await studentRateyardApiClient.sendRequest(
        'get_subject', 'POST', { 'Content-Type': 'application/json' },
         JSON.stringify({id}), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}

async function sendVerificationEmail(username) {
    let xhr = await studentRateyardApiClient.sendRequest(
        'send_verification_email', 'POST', { 'Content-Type': 'application/json' },
         JSON.stringify({username}), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}

async function verifyCode(email, code) {
    let xhr = await studentRateyardApiClient.sendRequest(
        'verify', 'POST', { 'Content-Type': 'application/json' },
         JSON.stringify({email, code}), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}

async function changePassword(id, password) {
    let xhr = await studentRateyardApiClient.sendRequest(
        'change_password', 'POST', { 'Content-Type': 'application/json' },
         JSON.stringify({id, password}), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}

async function readMarks(idsJSON) {
    let xhr = await studentRateyardApiClient.sendRequest(
        'read_marks', 'POST', { 'Content-Type': 'application/json' },
         JSON.stringify(idsJSON), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}
