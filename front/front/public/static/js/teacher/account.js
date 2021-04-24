let changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'))

let fullNameInputElement = document.getElementById('full_name');
let usernameInputElement = document.getElementById('username');
let emailInputElement = document.getElementById('email');
let passwordInputElement = document.getElementById('password');
const verifyEmailButtonElement = document.querySelector('#verify_email_button');

function fillUserInputs(myUser) {
    fullNameInputElement.value = myUser.full_name;
    fullNameInputElement.setAttribute('initial_value', myUser.full_name);
    usernameInputElement.value = myUser.username;
    emailInputElement.setAttribute('initial_value', myUser.email);
    emailInputElement.value = myUser.email;
    usernameInputElement.setAttribute('initial_value', myUser.username);
    passwordInputElement.setAttribute('initial_value', '');
}

myUserPromise.then((myUser) => {
    fillUserInputs(myUser)
    if (myUser.email_verified || !myUser.email) {
        verifyEmailButtonElement.parentElement.removeChild(verifyEmailButtonElement);
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
            if (responseData.json.includes(2)) makeInputTextWrong(passwordInputElement);
            if (responseData.json.includes(3)) makeInputTextWrong(emailInputElement);
            buttonElement.classList.remove('disabled');
        }
        else if (responseData.status === 200) {
            if (responseData.json.need_confirm) {
                document.location.replace('confirm_changes.php')
            } else {
                getMe().then((responseData) => {
                    fillUserInputs(responseData.json);
                    changesSet.discardChanges();
                    buttonElement.classList.remove('disabled')
                });
            }
        }
    });
}

verifyEmailButtonElement.onclick = async () => {
    let responseData = await sendEmailVerificationCode();
    if (responseData.status == 200) {
        document.location.replace('verify_email.php');
    }
};