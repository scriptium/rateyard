let dataHasChecked = checkUserData(undefined, 'login.php');
/*
let classesHasFilled = new Promise (async (resolve, reject) => {
    await dataHasChecked;
    getClassesShort().then((responseData) => {
        let classesSelectElement = document.getElementById('classes_select');
        fillClassesSelect(classesSelectElement, JSON.parse(responseData.text));
        resolve();
    }, reject);
})
*/
let usernameElement = document.getElementById('username');
let fullNameElement = document.getElementById('full_name');
let passwordElement = document.getElementById('password');
let emailElement = document.getElementById('email');

function saveNewTeacherButton(buttonElement) {
    disableButton(buttonElement);
    
    let requestJSON = [{
        full_name: fullNameElement.value,
        username: usernameElement.value,
        password: passwordElement.value,
        email: emailElement.value
    }]

    createTeachers(JSON.stringify(requestJSON)).then((responseData) => {
        window.history.back();
    },
    (responseData) => {
        if (responseData.code == 400) {
            let parsedResponseJSON = JSON.parse(responseData.text);

            if (parsedResponseJSON[0].includes(0)) makeInputTextWrong(usernameElement);
            if (parsedResponseJSON[0].includes(1)) makeInputTextWrong(fullNameElement);
            if (parsedResponseJSON[0].includes(2)) makeInputTextWrong(passwordElement);
            if (parsedResponseJSON[0].includes(3)) makeInputTextWrong(emailElement);

            enableButton(buttonElement);
        }
    })
}

window.onload = async () => {
    await classesHasFilled;
    document.getElementById('load_data').classList.add('visible');
}