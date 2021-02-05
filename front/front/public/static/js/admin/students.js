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
        fullNameElement.innerHTML = `<a href=\"/student.php?id=${student.id}\">${student.full_name}</a>`;

        let classElement = newRowElement.appendChild(document.createElement('td'));
        classElement.innerHTML = `<a href=\"/class.php?id=${student.class.id}\">${student.class.name}</a>`;

        let usernameElement = newRowElement.appendChild(document.createElement('td'));
        usernameElement.innerHTML = student.username;

        let emailElement = newRowElement.appendChild(document.createElement('td'));
        emailElement.innerHTML = student.email;

        mainTbodyEleemnt.appendChild(newRowElement);
    });

}

window.onload = () => {
    getStudents().then((responseData) => {
        fillStudentsTable(responseData.text)
    });
}