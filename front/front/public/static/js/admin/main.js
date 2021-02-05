function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('api_access_token');
    localStorage.removeItem('api_refresh_token');
    document.location.replace('login.php')
}

window.onload = function () {
    checkUserData(undefined, 'login.php')
}