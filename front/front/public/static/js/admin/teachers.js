let teachersResponseData = getTeachers();

function fillTeachersTable(parsedResponse) {
    let teachersTableElement = document.getElementById('teachers_table');
    let mainTbodyElement = teachersTableElement.getElementsByTagName('tbody')[1];
    
    parsedResponse.forEach(teacher => {
        let newRowElement = document.createElement('tr');

        let idElement = newRowElement.appendChild(document.createElement('td'));
        idElement.innerHTML = teacher.id;

        let fullNameElement = newRowElement.appendChild(document.createElement('td'));
        fullNameElement.innerHTML = `<a class=\"text\" href=\"teacher.php?id=${teacher.id}\">${teacher.full_name}</a>`;

        let usernameElement = newRowElement.appendChild(document.createElement('td'));
        usernameElement.innerHTML = teacher.username;

        let emailElement = newRowElement.appendChild(document.createElement('td'));
        emailElement.innerHTML = teacher.email;

        mainTbodyElement.appendChild(newRowElement);
    });

    teachersTableElement.classList.add('visible');
}

window.onload = async () => {
    teachersResponseData.then((responseData) => {
        fillTeachersTable(responseData.json);
    });
}