let studentsResponseData = getStudents();
let groupsResponseData = getGroupsShort();
let lecturerReponseData = getTeachers();


let studentsTableElement = document.querySelector('#students_table');
let mainStudentsTbodyElement = document.querySelector('#students_table tbody');

let groupsTableElement = document.querySelector('#groups_table');
let mainGroupsTbodyElement = document.querySelector('#groups_table tbody');

let lecturersTableElement = document.querySelector('#lecturers_table');
let mainLecturersTbodyElement = document.querySelector('#lecturers_table tbody');

function fillStudentsTable(parsedResponse) {
    console.log(parsedResponse)    
    parsedResponse.forEach(student => {
        let newRowElement = document.createElement('tr');

        let idElement = newRowElement.appendChild(document.createElement('td'));
        idElement.innerHTML = student.id;

        let fullNameElement = newRowElement.appendChild(document.createElement('td'));
        fullNameElement.innerHTML = `<a class=\"text\" href=\"student.php?id=${student.id}\">${student.full_name}</a>`;

        let usernameElement = newRowElement.appendChild(document.createElement('td'));
        usernameElement.innerHTML = student.username;

        let emailElement = newRowElement.appendChild(document.createElement('td'));
        emailElement.innerHTML = student.email;

        mainTbodyElement.appendChild(newRowElement);
    });
    studentsTableElement.classList.add('visible');
}

function fillTeachersTable(parsedResponse) {
    console.log(parsedResponse)    
    parsedResponse.forEach(teacher => {
        let newRowElement = document.createElement('tr');

        let idElement = newRowElement.appendChild(document.createElement('td'));
        idElement.innerHTML = teacher.id;

        let fullNameElement = newRowElement.appendChild(document.createElement('td'));
        fullNameElement.innerHTML = `<a class=\"text\" href=\"teacher.php?id=${teacher.id}\">${teacher.full_name}</a>`;

        let subjectElement = newRowElement.appendChild(document.createElement('td'));
        //subjectElement.innerHTML = student.username;

        let groupElement = newRowElement.appendChild(document.createElement('td'));
        //groupElement.innerHTML = student.email;

        mainTbodyElement.appendChild(newRowElement);
    });
    //hidableChildrenStudentsTbody = new HidableChildrenElement(mainTbodyElement);
    studentsTableElement.classList.add('visible');
}

studentsResponseData.then(async (responseData) => {
    groupsStudents = await getGroupStudents();
    fillStudentsTable(groupsStudents.json);
    hidePreloader();
});
