let classId = parseInt(document.querySelector('#class_id').getAttribute('value'));
let className;

let classNameElement = document.querySelector('#class_id');
let studentsTableElement = document.querySelector('#students_table');
let mainStudentsTbodyElement = document.querySelector('#students_table tbody');

let groupsTableElement = document.querySelector('#groups_table');
let mainGroupsTbodyElement = document.querySelector('#groups_table tbody');

let lecturersTableElement = document.querySelector('#lecturers_table');
let mainLecturersTbodyElement = document.querySelector('#lecturers_table tbody');

let classesHasFilled = new Promise (async (resolve, reject) => {
    getClassesShort().then((responseData) => {
        let classesSelectElement = document.getElementById('classes_select');
        responseData.json.splice(classId-1, 1);
        fillDropDownSelect(classesSelectElement, responseData.json);
        resolve();
    }, reject);
}) 

let studentsHasFilled = new Promise(async (resolve, reject) => {
    getClassFull(classId).then((responseData) => {
        let parsedResponse = responseData.json;
        className = parsedResponse.name;
        let students = parsedResponse.students;
        if(students.length === 0)
            disableButton(document.querySelector('#move_students_button'));
        insertStudentsData(students, mainStudentsTbodyElement, false, false, null);
        resolve();
    }, reject)
});

let groupsHasFilled = new Promise(async (resolve, reject) => {
    getGroupsShort(undefined, undefined, undefined, classId).then((responseData) => {
        let parsedResponse = responseData.json;
        insertGroupsData(parsedResponse, mainGroupsTbodyElement, false, false, false, null);
        resolve();
    }, reject)
});

let lectureresHasFilled = new Promise(async (resolve, reject) => {
    getGroupFull(classId).then((responseData) => {
        let parsedResponse = responseData.json;
        let groupInfo = {
            "id": parsedResponse.id,
            "name": parsedResponse.name
        };
        insertLecturersData(parsedResponse.group_lecturers, mainLecturersTbodyElement, groupInfo);
        resolve();
    }, reject)
});

async function deleteAllStudents(buttonElement) {
    buttonElement.classList.add('disabled');
    let isConfirmed = confirm(`Видалити всіх учнів ${className} класу?`)
    if (isConfirmed) {
        deleteStudentsFromClass(classId).then(
            () => { window.history.back() },
            () => { buttonElement.classList.remove('disabled') }
        )
    }
    else buttonElement.classList.remove('disabled');
}

function addNewLecturer(buttonElement) {
    disableButton(buttonElement);
    sessionStorage.setItem('class', JSON.stringify({id: classId, name: className}))
    sessionStorage.setItem('group', JSON.stringify({id: classId, name: 'Весь клас'}));
    sessionStorage.setItem('teacher', JSON.stringify('false')); 
    window.location = 'new_lecturer.php';
    enableButton(buttonElement);
}

function deleteLecturerFromTable(buttonElement) {
    let lecturerTr = buttonElement.parentElement.parentElement;
    let groupId = parseInt(lecturerTr.children[3].id);
    let teacherId = parseInt(lecturerTr.children[1].id);
    let teacherFullName = lecturerTr.children[1].children[0].innerHTML
    let subjectId = parseInt(lecturerTr.children[2].id);
    let subjectName = lecturerTr.children[2].innerHTML;

    let isConfirmed = confirm(`Видалити вчителя ${teacherFullName} за предметом ${subjectName}?`);
    if (isConfirmed) {
        let requestJSON = {
            'group_id': groupId,
            'teacher_id': teacherId,
            'subject_id': subjectId
        };

        deleteLecturer(requestJSON).then(() => {  
            lecturerTr.remove();
        });
    }
}

async function moveAllStudents(buttonElement) {
    disableButton(buttonElement);
    let classIdTo = parseInt(document.querySelector('#classes_select option:checked').value);
    let classNameTo = document.querySelector('#classes_select option:checked').innerHTML;
    let isConfirmed = confirm(`Перемістити всіх учнів з ${className} до ${classNameTo} класу?`);
    if (isConfirmed) {
        await moveStudentsToClass(classId, classIdTo);
        location.reload();
    }
    else enableButton(buttonElement);
}


function addGroup(buttonElement) {
    disableButton(buttonElement);
    sessionStorage.setItem('class', JSON.stringify({id: classId, name: className}));
    window.location = 'new_group.php';
}

function addStudent(buttonElement) {
    disableButton(buttonElement);
    sessionStorage.setItem('class', JSON.stringify({id: classId, name: className}));
    window.location = 'new_student.php';
}

let mainPromise = Promise.all([studentsHasFilled, groupsHasFilled, lectureresHasFilled]);
mainPromise.then(() => {
    classNameElement.innerHTML = className;
    hidePreloader();
});