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

async function getMarks(subject_id) {
    let xhr = await studentRateyardApiClient.sendRequest(
        'get_marks', 'POST', { 'Content-Type': 'application/json' },
         JSON.stringify({subject_id}), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    };
}
