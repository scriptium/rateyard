checkUserData('students.php', undefined);

async function loginButton(button) {
    disableButton(button)
    login(
        document.getElementById('password_input').value,
        document.getElementById('username_input').value
    ).then((xhr) => {
        localStorage.setItem('api_access_token', xhr.getResponseHeader('Access-Token'))
        document.location.replace('students.php')
    }, (responseData) => {
        if (responseData.code == 403) enableButton(button) 
    })
}