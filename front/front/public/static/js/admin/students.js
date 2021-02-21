let studentsResponseData = getStudents();

function fillStudentsTable(parsedResponse) {
    console.log(parsedResponse)
    let studentsTableElement = document.getElementById('students_table');
    let mainTbodyElement = studentsTableElement.getElementsByTagName('tbody')[1];
    
    parsedResponse.forEach(student => {
        let newRowElement = document.createElement('tr');

        let idElement = newRowElement.appendChild(document.createElement('td'));
        idElement.innerHTML = student.id;

        let fullNameElement = newRowElement.appendChild(document.createElement('td'));
        fullNameElement.innerHTML = `<a class=\"text\" href=\"student.php?id=${student.id}\">${student.full_name}</a>`;

        let classElement = newRowElement.appendChild(document.createElement('td'));
        classElement.innerHTML = `<a class=\"text\" href=\"class.php?id=${student.class.id}\">${student.class.name}</a>`;

        let usernameElement = newRowElement.appendChild(document.createElement('td'));
        usernameElement.innerHTML = student.username;

        let emailElement = newRowElement.appendChild(document.createElement('td'));
        emailElement.innerHTML = student.email;

        mainTbodyElement.appendChild(newRowElement);
    });

    studentsTableElement.classList.add('visible');
}

window.onload = async () => {
    studentsResponseData.then((responseData) => {
        fillStudentsTable(responseData.json);
    });
}