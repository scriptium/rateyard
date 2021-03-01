let studentId = parseInt(document.getElementById("student_id").innerHTML);

let changesSet = new ChangesSet(document.querySelectorAll(".appear_on_change"));

let classesHasFilled = new Promise(async (resolve, reject) => {
    getClassesShort().then((responseData) => {
        let classesSelectElement = document.getElementById('class_id');
        fillClassesSelect(classesSelectElement, responseData.json);
        resolve();
    }, reject)
});

let afterStudentGroupsElements = document.querySelectorAll('.appear_after_student_groups');
let studentGroupsTbodyElement = document.querySelector('#student_groups tbody')

let usernameElement = document.getElementById('username');
let fullNameElement = document.getElementById('full_name');
let classElement = document.getElementById('class_id');
let passwordElement = document.getElementById('password');
let emailElement = document.getElementById('email');

function updateStudentGroups() {
    return new Promise(async (resolve, reject) => {
        getGroupsShort(undefined, studentId).then((responseData) => {
            let groupsShort = responseData.json;
    
            afterStudentGroupsElements.forEach(
                (element) => {
                    element.classList.add('visible');
                }
            )
    
            studentGroupsTbodyElement.innerHTML = '';
            groupsShort.forEach(group => {
                let newRowElement = document.createElement('tr');
    
                let groupIdElement = newRowElement.appendChild(document.createElement('td'));
                groupIdElement.innerHTML = group.id;
    
                let groupNameElement = newRowElement.appendChild(document.createElement('td'));
                groupNameElement.innerHTML = `<a class=\"text\" href=\"group.php?id=${group.id}\">${group.name}</a>`;
    
                studentGroupsTbodyElement.appendChild(newRowElement);
            });
            resolve();
            console.log(groupsShort);
        }, reject);
    });
}

function updateStudentData() {
    return new Promise(async (resolve, reject) => {
        getStudents([studentId]).then(async (responseData) => {
            let student = responseData.json[0];
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
}

let studentHasFilled = updateStudentData();
let studentGroupsHasFilled = updateStudentGroups();

function saveStudentChangesButton(buttonElement) {
    buttonElement.classList.add('disabled');

    let requestJSON = [];
    requestJSON.push({ id: studentId })

    changesSet.changedElements.forEach(
        (element) => {
            if (element.id == "class_id") requestJSON[0][element.id] = parseInt(element.value);
            else requestJSON[0][element.id] = element.value;
        }
    );

    editStudents(requestJSON).then(async (responseData) => {
        if (responseData.status === 200) {
            await updateStudentData();
            await updateStudentGroups();
            changesSet.discardChanges();
            buttonElement.classList.remove('disabled');
        }
        else if (responseData.status == 400) {
            if (responseData.json[0].includes(0)) makeInputTextWrong(usernameElement);
            if (responseData.json[0].includes(1)) makeInputTextWrong(fullNameElement);
            if (responseData.json[0].includes(2)) makeInputTextWrong(classElement);
            if (responseData.json[0].includes(3)) makeInputTextWrong(passwordElement);
            if (responseData.json[0].includes(4)) makeInputTextWrong(emailElement);

            buttonElement.classList.remove('disabled');
        }
    });
}

async function deleteStudentButton(buttonElement) {
    buttonElement.classList.add('disabled');
    let isConfirmed = confirm(`Видалити учня №${studentId}?`)
    if (isConfirmed) {
        deleteStudents([studentId]).then(
            () => { window.history.back() },
            () => { buttonElement.classList.remove('disabled') }
        )
    }
    else buttonElement.classList.remove('disabled');
}

studentHasFilled.then(hidePreloader);