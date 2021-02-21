let classesHasFilled = new Promise (async (resolve, reject) => {
    getClassesShort().then((responseData) => {
        let classesSelectElement = document.getElementById('classes_select');
        fillClassesSelect(classesSelectElement, responseData.json);
        resolve();
    }, reject);
})

let usernameElement = document.getElementById('username');
let fullNameElement = document.getElementById('full_name');
let classElement = document.getElementById('classes_select');
let passwordElement = document.getElementById('password');
let emailElement = document.getElementById('email');

function saveNewStudentButton(buttonElement) {
    disableButton(buttonElement);
    
    let requestJSON = [{
        full_name: fullNameElement.value,
        class_id: classElement.value,
        username: usernameElement.value,
        password: passwordElement.value,
        email: emailElement.value
    }]

    createStudents(requestJSON).then((responseData) => {
        if (responseData.status == 400) {
            let parsedResponseJSON = responseData.json;

            if (parsedResponseJSON[0].includes(0)) makeInputTextWrong(usernameElement);
            if (parsedResponseJSON[0].includes(1)) makeInputTextWrong(fullNameElement);
            if (parsedResponseJSON[0].includes(2)) makeInputTextWrong(classElement);
            if (parsedResponseJSON[0].includes(3)) makeInputTextWrong(passwordElement);
            if (parsedResponseJSON[0].includes(4)) makeInputTextWrong(emailElement);
            enableButton(buttonElement);
        }
        else if (responseData.status === 200) {
            window.history.back();
        }
    });
}

window.onload = async () => {
    await classesHasFilled;
    document.getElementById('load_data').classList.add('visible');
}