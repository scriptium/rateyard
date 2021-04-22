let changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'))

let fullNameInputElement = document.getElementById('full_name');
let usernameInputElement = document.getElementById('username');
let emailInputElement = document.getElementById('email');

let changePasswordBtn = document.getElementById('change_password');

function fillUserInputs(myUser) {
    fullNameInputElement.value = myUser.full_name;
    fullNameInputElement.setAttribute('initial_value', myUser.full_name);
    usernameInputElement.value = myUser.username;
    emailInputElement.setAttribute('initial_value', myUser.email);
    emailInputElement.value = myUser.email;
    usernameInputElement.setAttribute('initial_value', myUser.username);
}

myUserPromise.then((myUser) => {
    fillUserInputs(myUser)
    if (!myUser.email) {
        changePasswordBtn.classList.add('disabled');
    }
    hidePreloader();
});

function saveAccountChangesButton(buttonElement) {
    let requestJSON = {}
    changesSet.changedElements.forEach(element => {
        requestJSON[element.id] = element.value;
    });
    buttonElement.classList.add('disabled');
    editMe(requestJSON).then((responseData) => {
        if (responseData.status === 400) {
            if (responseData.json.includes(0)) makeInputTextWrong(usernameInputElement);
            if (responseData.json.includes(1)) makeInputTextWrong(fullNameInputElement);
            if (responseData.json.includes(3)) makeInputTextWrong(emailInputElement);
            buttonElement.classList.remove('disabled');
        }
        else if (responseData.status === 200) {
            getMe().then((responseData) => {
                fillUserInputs(responseData.json);
                changesSet.discardChanges();
                buttonElement.classList.remove('disabled')
            });
        }
    });
}

changePasswordBtn.addEventListener('click', () => {
    if (changePasswordBtn.classList.contains('disabled')) return;
    location.href = 'change_password.php';
});
