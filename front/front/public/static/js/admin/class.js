let classId = parseInt(document.querySelector('#class_id').innerHTML);

let studentsTableElement = document.querySelector('#students_table');
let mainStudentsTbodyElement = document.querySelector('#students_table tbody');

let groupsTableElement = document.querySelector('#groups_table');
let mainGroupsTbodyElement = document.querySelector('#groups_table tbody');

let lecturersTableElement = document.querySelector('#lecturers_table');
let mainLecturersTbodyElement = document.querySelector('#lecturers_table tbody');


let studentsHasFilled = new Promise(async (resolve, reject) => {
    getClassFull(classId).then((responseData) => {
        console.log('')
        let parsedResponse = responseData.json;
        insertStudentsData(parsedResponse.students, mainStudentsTbodyElement, false, false, null);
        resolve();
    }, reject)
});

let groupsHasFilled = new Promise(async (resolve, reject) => {
    getGroupsShort(undefined, undefined, undefined, classId).then((responseData) => {
        let parsedResponse = responseData.json;
        console.log(parsedResponse);
        insertGroupsData(parsedResponse, mainGroupsTbodyElement, false, true, null);
        resolve();
    }, reject)
});

let lectureresHasFilled = new Promise(async (resolve, reject) => {
    getGroupFull(classId).then((responseData) => {
        let parsedResponse = responseData.json;
        console.log(parsedResponse.group_lecturers);
        let groupInfo = JSON.stringify(parsedResponse.id, parsedResponse.name);
        insertLecturersData(parsedResponse.group_lecturers, mainLecturersTbodyElement, groupInfo);
        resolve();
    }, reject)
});

async function deleteAllStudents(buttonElement) {
    buttonElement.classList.add('disabled');
    let isConfirmed = confirm(`Видалити всіх учнів класу №${classId}?`)
    if (isConfirmed) {
        deleteStudentsFromClass(classId).then(
            () => { window.history.back() },
            () => { buttonElement.classList.remove('disabled') }
        )
    }
    else buttonElement.classList.remove('disabled');
}

let mainPromise = Promise.all([studentsHasFilled, groupsHasFilled, lectureresHasFilled]);
mainPromise.then(hidePreloader);