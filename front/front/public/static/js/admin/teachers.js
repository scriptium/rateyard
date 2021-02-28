let teachersResponseData = getTeachers();
let searchIndex = FlexSearch.create({
    encode: "icase",
    split: /\s+/,
    tokenize: "forward"
});

let teachersTableElement = document.getElementById('teachers_table');
let mainTbodyElement = teachersTableElement.getElementsByTagName('tbody')[1];

let hidableChildrenTeachersTbody;

function fillTeachersTable(parsedResponse) {
    
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

        searchIndex.add(
            newRowElement,
            `${teacher.id} ${teacher.username} ${teacher.full_name} ${teacher.email}`
        )

        mainTbodyElement.appendChild(newRowElement);
    });

    hidableChildrenTeachersTbody = new HidableChildrenElement(mainTbodyElement);
    teachersTableElement.classList.add('visible');
}


function searchTeachers(text) {
    let searchedTrs = searchIndex.search(text);

    if (text!=='') {
        hidableChildrenTeachersTbody.hideAll();
        searchedTrs.forEach(
            (tr) => {hidableChildrenTeachersTbody.show(tr);}
        );
    }
    else hidableChildrenTeachersTbody.showAll();

    hidableChildrenTeachersTbody.update();
}


window.onload = async () => {
    teachersResponseData.then((responseData) => {
        fillTeachersTable(responseData.json);
        document.getElementById('loader').style.display = 'none';
    });
}