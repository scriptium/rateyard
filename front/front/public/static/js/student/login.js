let rateyardApiClient = new RateyardApiClient(
    localStorage.getItem('student_access_token'),
    localStorage.getItem('student_refresh_token'),
    ''
);

rateyardApiClient.sendRequest('/student/check_token', 'GET', {},  undefined, true)
.then((xhr) => {
    if (xhr.status === 200) document.location.replace('index.php')
});

async function loginButton(button) {
    disableButton(button)
    rateyardApiClient.sendRequest(
        '/auth/login_student', 'POST', {'Content-Type': 'application/json'}, JSON.stringify({
            username: document.getElementById('username_input').value,
            password: document.getElementById('password_input').value
        })
    ).then((xhr) => {
        if (xhr.status == 403) enableButton(button)
        else {
            localStorage.setItem('student_access_token', xhr.getResponseHeader('Access-Token'));
            localStorage.setItem('student_refresh_token', xhr.getResponseHeader('Refresh-Token'));
            document.location.replace('index.php');
        }
    });
}
