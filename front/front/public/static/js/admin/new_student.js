checkingData = checkUserData(undefined, 'login.php');

let classesResponseData;

checkingData.then(() => {
    classesResponseData = getClasses()
});

function saveNewStudentButton(buttonElement) {
    disableButton(buttonElement);

    let usernameElement = document.getElementById('username');
    let fullNameElement = document.getElementById('full_name');
    let classElement = document.getElementById('classes_select');
    let passwordElement = document.getElementById('password');
    let emailElement = document.getElementById('email');

    let requestJSON = [{
        full_name: fullNameElement.value,
        class_id: classElement.value,
        username: usernameElement.value,
        password: passwordElement.value,
        email: emailElement.value
    }]

    createStudents(JSON.stringify(requestJSON)).then((responseData) => {
        window.history.back();
    },
    (responseData) => {
        if (responseData.code == 400) {
            let parsedResponseJSON = JSON.parse(responseData.text);

            if (parsedResponseJSON[0].includes(0)) makeInputTextWrong(usernameElement);
            if (parsedResponseJSON[0].includes(1)) makeInputTextWrong(fullNameElement);
            if (parsedResponseJSON[0].includes(2)) makeInputTextWrong(classElement);
            if (parsedResponseJSON[0].includes(3)) makeInputTextWrong(passwordElement);
            if (parsedResponseJSON[0].includes(4)) makeInputTextWrong(emailElement);

            enableButton(buttonElement);
        }
    })
}

window.onload = async () => {
    await checkingData;
    classesResponseData.then((responseData) => {
        let classesSelectElement = document.getElementById('classes_select');
        fillClassesSelect(classesSelectElement, JSON.parse(responseData.text));
        classesSelectElement.parentElement.classList.add('visible');
    });
}