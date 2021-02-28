let teacherId = parseInt(document.getElementById("teacher_id").innerHTML);

let changesSet = new ChangesSet(document.querySelectorAll(".appear_on_change"));

let usernameElement = document.getElementById('username');
let fullNameElement = document.getElementById('full_name');
let passwordElement = document.getElementById('password');
let emailElement = document.getElementById('email');

function updateTeacherData() {
    return new Promise(async (resolve, reject) => {
        getTeachers([teacherId]).then(async (responseData) => {
            let teacher = responseData.json[0]
            usernameElement.value = teacher.username;
            usernameElement.setAttribute('initial_value', teacher.username);
            fullNameElement.value = teacher.full_name;
            fullNameElement.setAttribute('initial_value', teacher.full_name);
            emailElement.value = teacher.email;
            emailElement.setAttribute('initial_value', teacher.email);
            resolve();
        }, reject)
    });
}

let teacherHasFilled = updateTeacherData();

function saveTeacherChangesButton(buttonElement) {
    buttonElement.classList.add('disabled');

    let requestJSON = [];
    requestJSON.push({ id: teacherId })

    changesSet.changedElements.forEach(
        (element) => {
            requestJSON[0][element.id] = element.value;
        }
    );

    editTeachers(requestJSON).then(async (responseData) => {
        if (responseData.status === 200) {
            await updateTeacherData();
            changesSet.discardChanges();
            buttonElement.classList.remove('disabled');
        }
        else if (responseData.status == 400) {
            if (responseData.json[0].includes(0)) makeInputTextWrong(usernameElement);
            if (responseData.json[0].includes(1)) makeInputTextWrong(fullNameElement);
            if (responseData.json[0].includes(2)) makeInputTextWrong(passwordElement);
            if (responseData.json[0].includes(3)) makeInputTextWrong(emailElement);

            buttonElement.classList.remove('disabled');
        }
    });
}

async function deleteTeacherButton(buttonElement) {
    buttonElement.classList.add('disabled');
    let isConfirmed = confirm(`Видалити вчителя №${teacherId}?`)
    if (isConfirmed) {
        deleteTeachers([teacherId]).then(
            () => { window.history.back() },
            () => { buttonElement.classList.remove('disabled') }
        )
    }
    else buttonElement.classList.remove('disabled');
}


window.onload = async () => {
    await teacherHasFilled;
    document.getElementById('load_data').classList.add('visible');
    document.getElementById('loader').style.display = 'none';
}