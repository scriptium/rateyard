let rateyardApiClient = new RateyardApiClient(
    localStorage.getItem('admin_access_token'),
    localStorage.getItem('admin_refresh_token'),
    ''
);

rateyardApiClient.sendRequest('/admin/check_token', 'GET', {},  undefined, true)
.then(
    (xhr) => {
        if (xhr.status === 200) {
            document.location.replace('students.php')
        }
    },
    () => {
        hidePreloader();
    }
);

async function loginButton(button) {
    disableButton(button)
    rateyardApiClient.sendRequest(
        '/auth/login_admin', 'POST', {'Content-Type': 'application/json'}, JSON.stringify({
            username: document.getElementById('username_input').value,
            password: document.getElementById('password_input').value
        })
    ).then((xhr) => {
        if (xhr.status == 403) enableButton(button)
        else {
            localStorage.setItem('admin_access_token', xhr.getResponseHeader('Access-Token'));
            localStorage.setItem('admin_refresh_token', xhr.getResponseHeader('Refresh-Token'));
            document.location.replace('students.php');
        }
    });
}