let dataHasChecked = checkUserData(undefined, 'login.php');
let windowHasLoaded = new Promise((resolve) => {window.onload = resolve})

let classesHasFilled = new Promise (async (resolve, reject) => {
    await dataHasChecked;
    getClassesShort().then(async (responseData) => {
        let classesSelectElement = document.getElementById('class_id');
        fillClassesSelect(classesSelectElement, JSON.parse(responseData.text));
        resolve();
        await windowHasLoaded;
        document.querySelectorAll('.appear_after_classes').forEach(
            (element) => {
                element.classList.add('visible')
            }
        )
    }, reject);
})

let groupNameElement = document.getElementById('name');
let groupclassElement = document.getElementById('class_id');
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
        getClassFull(parseInt(groupclassElement.value)).then(async (responseData) => {
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

                checkboxElement.innerHTML = '<div class=\"checkbox\"></div>'
        
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

let groupStudentsHasFilled = updateGroupStudentData();