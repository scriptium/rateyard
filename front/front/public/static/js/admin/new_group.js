let windowHasLoaded = new Promise((resolve) => { window.onload = resolve })

function fillClassesData() {
    return new Promise(async (resolve, reject) => {
        getClassesShort().then(async (responseData) => {
            fillDropDownSelect(groupClassElement, responseData.json);
            await windowHasLoaded;
            document.querySelectorAll('.appear_after_classes').forEach(
                (element) => {
                    element.classList.add('visible')
                }
            )
            resolve();
        }, reject);
    })
}

let previousURL = 'groups.php';

let groupNameElement = document.getElementById('name');
let groupClassElement;
let groupStudentsTbodyElement = document.querySelector('#group_students tbody')

let afterGroupStudentsElements = document.querySelectorAll('.appear_after_group_students');

async function fillSessionStorageData() {
    let classData = sessionStorage['class'];
    sessionStorage.clear();
    
    if(classData !== undefined) {
        classData = JSON.parse(classData);
        previousURL = `class.php?id=${classData.id}`;
    }
    else classData = 'false';

    if(classData !== 'false') {
        groupClassElement = createFakeReadonlyInput('class_id', classData.name, classData.id);
    }
    else {
        groupClassElement = createDefaultSelect('class_id', 'updateGroupStudentData()');
        await fillClassesData();
    }
    let classBlockElement = document.querySelector('#class_block');
    classBlockElement.after(groupClassElement);
    
}


function updateGroupStudentData() {
    return new Promise(async (resolve, reject) => {
        document.querySelectorAll('.appear_after_group_students').forEach(
            (element) => {
                element.classList.remove('visible')
            }
        )
        if(groupClassElement === undefined) {
            await fillSessionStorageData();
        }
        getClassFull(parseInt(groupClassElement.value)).then(async (responseData) => {
            let parsedResponse = responseData.json;
            groupStudentsTbodyElement.innerHTML = '';
            parsedResponse.students.forEach(student => {
                let newRowElement = document.createElement('tr');

                let checkboxElement = newRowElement.appendChild(document.createElement('td'));

                let idElement = newRowElement.appendChild(document.createElement('td'));
                idElement.innerHTML = student.id;

                let fullNameElement = newRowElement.appendChild(document.createElement('td'));
                fullNameElement.innerHTML = `<a class=\"text\" href=\"student.php?id=${student.id}\">${student.full_name}</a>`;

                let usernameElement = newRowElement.appendChild(document.createElement('td'));
                usernameElement.innerHTML = student.username;

                let emailElement = newRowElement.appendChild(document.createElement('td'));
                emailElement.innerHTML = student.email;

                checkboxElement.appendChild(createCheckboxElement());

                groupStudentsTbodyElement.appendChild(newRowElement);
            });
            resolve();
        }, reject)
    })

}

function saveNewGroupButton(buttonElement) {
    buttonElement.classList.add('disabled');
    console.log(groupClassElement);
    let name = groupNameElement.value;
    let classId = parseInt(groupClassElement.value);
    let studentsIds = []

    for (let childIndex = 0; childIndex < groupStudentsTbodyElement.children.length; childIndex++) {
        let trowElement = groupStudentsTbodyElement.children[childIndex];

        if (trowElement.children[0].children[0].classList.contains('checked'))
            studentsIds.push(parseInt(trowElement.children[1].innerHTML));
    }

    createGroup(name, classId, studentsIds).then(
        (requestData) => {
            if (requestData.status == 200) location.replace(previousURL);
            else if (requestData.status == 400) {
                if (requestData.json.includes(1)) makeInputTextWrong(groupNameElement);
                buttonElement.classList.remove('disabled');
            }
        }
    );
}

let groupStudentsHasFilled = updateGroupStudentData();

let mainPromise = Promise.all([groupStudentsHasFilled]);
mainPromise.then(hidePreloader);
