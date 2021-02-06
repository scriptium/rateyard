checkUserData('students.php', undefined);

async function loginButton(button) {
    disableButton(button)
    login(
        document.getElementById('password_input').value,
        document.getElementById('username_input').value
    ).then((responseData) => {
        parsedJSON = JSON.parse(responseData.text)
        localStorage.setItem('api_access_token', parsedJSON.access_token)
        localStorage.setItem('api_refresh_token', parsedJSON.refresh_token)
        document.location.replace('students.php')
    }, (responseData) => {
        if (responseData.code == 403) enableButton(button) 
    })
}