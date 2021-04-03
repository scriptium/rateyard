let changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'))

let emailInputElement = document.getElementById('email');
let passwordInputElement = document.getElementById('password');

function fillUserInputs(myUser) {
    emailInputElement.setAttribute('initial_value', myUser.email);
    emailInputElement.value = myUser.email;
    passwordInputElement.setAttribute('initial_value', '');
}

myUserPromise.then((myUser) => {
    fillUserInputs(myUser)
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
            if (responseData.json.includes(3)) makeInputTextWrong(passwordInputElement);
            if (responseData.json.includes(4)) makeInputTextWrong(emailInputElement);
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