function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('student_access_token');
    localStorage.removeItem('student_refresh_token');
    document.location.replace('login.php')
}

// let myUserPromise = new Promise((resolve, reject) => {
//     getMe().then((responseData) => {
//         resolve(responseData.json)
//     })
// });
