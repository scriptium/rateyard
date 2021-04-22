let changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'))

let emailInputElement = document.getElementById('email');
let changePasswordBtn = document.getElementById('change_password');

function fillUserInputs(myUser) {
    emailInputElement.setAttribute('initial_value', myUser.email);
    emailInputElement.value = myUser.email;
}


myUserPromise.then((myUser) => {
	fillUserInputs(myUser);
    if (window.innerWidth <= 1000) {
        let saveButtonElement = document.querySelector('#save_button');
        let contentElement = document.querySelector('#content');
        saveButtonElement.parentElement.removeChild(saveButtonElement);
        contentElement.appendChild(saveButtonElement);
    }
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

changePasswordBtn.addEventListener('click', () => {
    if (changePasswordBtn.classList.contains('disabled')) return;
    location.href = 'change_password.php';
});
