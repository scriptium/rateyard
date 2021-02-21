let studentsResponseData = getStudents();
let searchIndex = FlexSearch.create({
    encode: false,
    split: /\s+/,
    tokenize: "forward"
});

let studentsTableElement = document.getElementById('students_table');
let mainTbodyElement = studentsTableElement.getElementsByTagName('tbody')[1];

function fillStudentsTable(parsedResponse) {
    console.log(parsedResponse)    
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

        searchIndex.add(
            student.id,
            `${student.id} ${student.username} ${student.full_name} ${student.email} ${student.class.name}`
        )

        mainTbodyElement.appendChild(newRowElement);
    });

    studentsTableElement.classList.add('visible');
}

function searchStudents(text) {
    let searchedStudents = searchIndex.search(text);
    for (let element of mainTbodyElement.children){
        if (!searchedStudents.includes(parseInt(element.children[0].innerHTML)) && text!=='')
            element.style = "display: none";
        else element.style = "";
    }
}

window.onload = async () => {
    studentsResponseData.then((responseData) => {
        fillStudentsTable(responseData.json);
    });
}