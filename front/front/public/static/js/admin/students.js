let studentsResponseData = new Promise(async (resolve, reject) => {
    await checkUserData(undefined, 'login.php');
    getStudents().then(resolve, reject)
})

function fillStudentsTable(responseText) {
    parsedResponse = JSON.parse(responseText);
    console.log(parsedResponse)
    studentsTableElement = document.getElementById('students_table');
    mainTbodyEleemnt = studentsTableElement.getElementsByTagName('tbody')[1];
    
    parsedResponse.forEach(student => {
        newRowElement = document.createElement('tr');

        let idElement = newRowElement.appendChild(document.createElement('td'));
        idElement.innerHTML = student.id;

        let fullNameElement = newRowElement.appendChild(document.createElement('td'));
        fullNameElement.innerHTML = `<a class=\"text\" href=\"/student.php?id=${student.id}\">${student.full_name}</a>`;

        let classElement = newRowElement.appendChild(document.createElement('td'));
        classElement.innerHTML = `<a class=\"text\" href=\"/class.php?id=${student.class.id}\">${student.class.name}</a>`;

        let usernameElement = newRowElement.appendChild(document.createElement('td'));
        usernameElement.innerHTML = student.username;

        let emailElement = newRowElement.appendChild(document.createElement('td'));
        emailElement.innerHTML = student.email;

        mainTbodyEleemnt.appendChild(newRowElement);
    });

    studentsTableElement.classList.add('visible');
}

window.onload = async () => {
    studentsResponseData.then((responseData) => {
        fillStudentsTable(responseData.text)
    });
}