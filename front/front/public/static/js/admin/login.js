async function loginButton(button) {
    disableButton(button)
    login(
        document.getElementById('password_input').value,
        document.getElementById('username_input').value
    ).then((responseData) => {
        if (responseData.code == 200) {
            parsedJSON = JSON.parse(responseData.text)
            localStorage.setItem('api_access_token', parsedJSON.access_token)
            localStorage.setItem('api_refresh_token', parsedJSON.refresh_token)
            document.location.replace('students.php')
        }
        else {
            console.log('wrong');
            enableButton(button);
        }
    })
}

window.onload = async () => {
    await checkUserData('students.php', undefined);
}