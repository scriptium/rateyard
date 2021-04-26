function fillClassesData() {
    return new Promise(async (resolve, reject) => {
        getClassesShort().then(async (responseData) => {
            fillDropDownSelect(classElement, responseData.json);
            resolve();
        }, reject);
    })
}

let previousURL = 'students.php';

let usernameElement = document.getElementById('username');
let fullNameElement = document.getElementById('full_name');
let classElement;
let passwordElement = document.getElementById('password');
let emailElement = document.getElementById('email');

async function fillSessionStorageData() {
    let classData = sessionStorage['class'];
    sessionStorage.clear();
    
    if(classData !== undefined) {
        classData = JSON.parse(classData);
        previousURL = `class.php?id=${classData.id}`;
    }
    else classData = 'false';

    if(classData !== 'false') {
        classElement = createFakeReadonlyInput('classes_select', classData.name, classData.id);
    }
    else {
        classElement = createDefaultSelect('classes_select');
        await fillClassesData();
    }
    let classBlockElement = document.querySelector('#class_block');
    classBlockElement.after(classElement);
    
}

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
            console.log(parsedResponseJSON);
            if (parsedResponseJSON[0].includes(0)) makeInputTextWrong(usernameElement);
            if (parsedResponseJSON[0].includes(1)) makeInputTextWrong(fullNameElement);
            if (parsedResponseJSON[0].includes(2)) makeInputTextWrong(classElement);
            if (parsedResponseJSON[0].includes(3)) makeInputTextWrong(passwordElement);
            if (parsedResponseJSON[0].includes(4)) makeInputTextWrong(emailElement);
            enableButton(buttonElement);
        }
        else if (responseData.status === 200) {
            location.replace(previousURL);
        }
    });
}

fillSessionStorageData().then(hidePreloader);