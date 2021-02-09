let dataHasChecked = checkUserData(undefined, 'login.php');

let studentId = parseInt(document.getElementById("student_id").innerHTML);

let classesHasFilled = new Promise(async (resolve, reject) => {
    await dataHasChecked;
    getClasses().then((responseData) => {
        let classesSelectElement = document.getElementById('classes_select');
        fillClassesSelect(classesSelectElement, JSON.parse(responseData.text));
        console.log('classes')
        resolve();
    }, reject)
});

let usernameElement = document.getElementById('username');
let fullNameElement = document.getElementById('full_name');
let classElement = document.getElementById('classes_select');
let passwordElement = document.getElementById('password');
let emailElement = document.getElementById('email');

let studentHasFilled = new Promise(async (resolve, reject) => {
    await dataHasChecked;
    getStudents([studentId]).then(async (responseData) => {
        let student = JSON.parse(responseData.text)[0]
        usernameElement.value = student.username;
        usernameElement.setAttribute('initial_value', student.username);
        fullNameElement.value = student.full_name;
        fullNameElement.setAttribute('initial_value', student.full_name);
        emailElement.value = student.email;
        emailElement.setAttribute('initial_value', student.email);
        await classesHasFilled;
        classElement.value = student.class.id;
        classElement.setAttribute('initial_value', student.class.id);
        resolve();  
    }, reject)
});

// function saveNewStudentButton(buttonElement) {
//     disableButton(buttonElement);



//     let requestJSON = [{
//         full_name: fullNameElement.value,
//         class_id: classElement.value,
//         username: usernameElement.value,
//         password: passwordElement.value,
//         email: emailElement.value
//     }]

//     createStudents(JSON.stringify(requestJSON)).then((responseData) => {
//         window.history.back();
//     },
//     (responseData) => {
//         if (responseData.code == 400) {
//             let parsedResponseJSON = JSON.parse(responseData.text);

//             if (parsedResponseJSON[0].includes(0)) makeInputTextWrong(usernameElement);
//             if (parsedResponseJSON[0].includes(1)) makeInputTextWrong(fullNameElement);
//             if (parsedResponseJSON[0].includes(2)) makeInputTextWrong(classElement);
//             if (parsedResponseJSON[0].includes(3)) makeInputTextWrong(passwordElement);
//             if (parsedResponseJSON[0].includes(4)) makeInputTextWrong(emailElement);

//             enableButton(buttonElement);
//         }
//     })
// }

async function deleteStudentButton(buttonElement) {
    buttonElement.classList.add('disabled');
    isConfirmed = confirm(`Видалити учня №${studentId}?`)
    if (isConfirmed) {
        deleteStudents(JSON.stringify([studentId])).then(
            () => {window.history.back()},
            () => {buttonElement.classList.remove('disabled')}
        )
    }
    else buttonElement.classList.remove('disabled');
}

const changedElements = new Set();

function updateChangedElemnts(elementWithValue) {
    if (elementWithValue.value != elementWithValue.getAttribute('initial_value'))
        changedElements.add(elementWithValue);
    else
        changedElements.delete(elementWithValue);
    if (changedElements.size > 0)
        document.querySelectorAll('.appear_on_change').forEach(
            element => {
                element.classList.add('visible');
            } 
        );
    else
        document.querySelectorAll('.appear_on_change').forEach(
            element => {
                element.classList.remove('visible');
            } 
        );
}

function discardStudentChangesButton() {
    changedElements.forEach(
        (element) => {
            element.value = element.getAttribute('initial_value');
        }
    );
    changedElements.clear();
    document.querySelectorAll('.appear_on_change').forEach(
        element => {
            element.classList.remove('visible');
        } 
    );
}

window.onload = async () => {
    await studentHasFilled;
    document.getElementById('load_data').classList.add('visible');
}