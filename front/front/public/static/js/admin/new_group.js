let dataHasChecked = checkUserData(undefined, 'login.php');
let windowHasLoaded = new Promise((resolve) => {window.onload = resolve})

let classesHasFilled = new Promise (async (resolve, reject) => {
    await dataHasChecked;
    getClassesShort().then(async (responseData) => {
        let classesSelectElement = document.getElementById('class_id');
        fillClassesSelect(classesSelectElement, JSON.parse(responseData.text));
        await windowHasLoaded;
        document.querySelectorAll('.appear_after_classes').forEach(
            (element) => {
                element.classList.add('visible')
            }
        )
        resolve();
    }, reject);
})

let groupNameElement = document.getElementById('name');
let groupClassElement = document.getElementById('class_id');
let groupStudentsTbodyElement = document.querySelector('#group_students tbody')

let afterGroupStudentsElements = document.querySelectorAll('.appear_after_group_students');

function updateGroupStudentData() {
    return new Promise (async (resolve, reject) => {
        document.querySelectorAll('.appear_after_group_students').forEach(
            (element) => {
                element.classList.remove('visible')
            }
        )
        await dataHasChecked;
        await classesHasFilled;
        getClassFull(parseInt(groupClassElement.value)).then(async (responseData) => {
            let parsedResponse = JSON.parse(responseData.text);
            groupStudentsTbodyElement.innerHTML = '';
            parsedResponse.students.forEach(student => {
                let newRowElement = document.createElement('tr');
        
                let idElement = newRowElement.appendChild(document.createElement('td'));
                idElement.innerHTML = student.id;
        
                let fullNameElement = newRowElement.appendChild(document.createElement('td'));
                fullNameElement.innerHTML = `<a class=\"text\" href=\"student.php?id=${student.id}\">${student.full_name}</a>`;
        
                let usernameElement = newRowElement.appendChild(document.createElement('td'));
                usernameElement.innerHTML = student.username;
        
                let emailElement = newRowElement.appendChild(document.createElement('td'));
                emailElement.innerHTML = student.email;

                let checkboxElement = newRowElement.appendChild(document.createElement('td'));

                checkboxElement.appendChild(createCheckboxElement());
        
                groupStudentsTbodyElement.appendChild(newRowElement);
            });
            await windowHasLoaded;
            afterGroupStudentsElements.forEach(
                (element) => {
                    element.classList.add('visible')
                }
            )
            resolve();
        }, reject)
    })

}

function saveNewGroupButton(buttonElement)
{
    buttonElement.classList.add('disabled');

    let name = groupNameElement.value;
    let classId = parseInt(groupClassElement.value);
    let studentsIds = []

    for (let childIndex = 0; childIndex < groupStudentsTbodyElement.children.length; childIndex++)
    {
        let trowElement = groupStudentsTbodyElement.children[childIndex];

        if (trowElement.children[4].children[0].classList.contains('checked'))
            studentsIds.push(parseInt(trowElement.children[0].innerHTML));
    }

    createGroup(name, classId, studentsIds).then(
        () => {
            window.history.back();
        },
        (requestData) => {
            if (requestData.code === 400) {
                let parsedErrors = JSON.parse(requestData.text);

                if (parsedErrors.includes(1)) makeInputTextWrong(groupNameElement);
                buttonElement.classList.remove('disabled');
            }
        }
    );
}

let groupStudentsHasFilled = updateGroupStudentData();