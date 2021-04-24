const changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'))

const emailInputElement = document.getElementById('email');
const passwordInputElement = document.getElementById('password');
const verifyEmailButtonElement = document.querySelector('#verify_email_button');
const bottomTitleBlockElement = document.querySelector('#bottom_title_block')

function fillUserInputs(myUser) {
    emailInputElement.setAttribute('initial_value', myUser.email);
    emailInputElement.value = myUser.email;
    passwordInputElement.setAttribute('initial_value', '');
}


myUserPromise.then((myUser) => {
	fillUserInputs(myUser);
    if (window.innerWidth <= 1250) {
        let saveButtonElement = document.querySelector('#save_button');
        saveButtonElement.parentElement.removeChild(saveButtonElement);
        verifyEmailButtonElement.parentElement.removeChild(verifyEmailButtonElement);
        bottomTitleBlockElement.appendChild(verifyEmailButtonElement);
        bottomTitleBlockElement.appendChild(saveButtonElement);
    }
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
            if (responseData.json.includes(3)) makeInputTextWrong(passwordInputElement);
            if (responseData.json.includes(4)) makeInputTextWrong(emailInputElement);
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