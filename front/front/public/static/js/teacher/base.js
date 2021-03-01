function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('teacher_access_token');
    localStorage.removeItem('teacher_refresh_token');
    document.location.replace('login.php')
}

let myUserPromise = new Promise((resolve, reject) => {
    getMe().then((responseData) => {
        resolve(responseData.json)
    })
});

(async () => {
    let myUser = await myUserPromise;
    document.getElementById('header_teacher_full_name').innerHTML = myUser.full_name;
})();