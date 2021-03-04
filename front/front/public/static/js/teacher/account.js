let changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'))

let fullNameInputElement = document.getElementById('full_name');
let usernameInputElement = document.getElementById('username');
let passwordInputElement = document.getElementById('password');

myUserPromise.then((myUser) => {
    fullNameInputElement.value = myUser.full_name;
    fullNameInputElement.setAttribute('initial_value', myUser.full_name);
    usernameInputElement.value = myUser.username;
    usernameInputElement.setAttribute('initial_value', myUser.username);
    passwordInputElement.setAttribute('initial_value', '');
    hidePreloader();
});