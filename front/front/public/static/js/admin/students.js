let studentsResponseData = getStudents();
let searchIndex = FlexSearch.create({
    encode: "icase",
    split: /\s+/,
    tokenize: "forward"
});

let studentsTableElement = document.getElementById('students_table');
let mainTbodyElement = studentsTableElement.getElementsByTagName('tbody')[1];

let hidableChildrenStudentsTbody;

function fillStudentsTable(parsedResponse) {
    console.log(parsedResponse)    
    // parsedResponse.forEach(student => {
    //     let newRowElement = document.createElement('tr');

    //     let idElement = newRowElement.appendChild(document.createElement('td'));
    //     idElement.innerHTML = student.id;

    //     let fullNameElement = newRowElement.appendChild(document.createElement('td'));
    //     fullNameElement.innerHTML = `<a class=\"text\" href=\"student.php?id=${student.id}\">${student.full_name}</a>`;

    //     let classElement = newRowElement.appendChild(document.createElement('td'));
    //     classElement.innerHTML = `<a class=\"text\" href=\"class.php?id=${student.class.id}\">${student.class.name}</a>`;

    //     let usernameElement = newRowElement.appendChild(document.createElement('td'));
    //     usernameElement.innerHTML = student.username;

    //     let emailElement = newRowElement.appendChild(document.createElement('td'));
    //     emailElement.innerHTML = student.email;

    //     searchIndex.add(
    //         newRowElement,
    //         `${student.id} ${student.username} ${student.full_name} ${student.email} ${student.class.name}`
    //     )

    //     mainTbodyElement.appendChild(newRowElement);
    // });
    insertStudentsData(parsedResponse, mainTbodyElement, true, null);
    hidableChildrenStudentsTbody = new HidableChildrenElement(mainTbodyElement);
    studentsTableElement.classList.add('visible');
}

function searchStudents(text) {
    let searchedTrs = searchIndex.search(text);

    if (text!=='') {
        hidableChildrenStudentsTbody.hideAll();
        searchedTrs.forEach(
            (tr) => {hidableChildrenStudentsTbody.show(tr);}
        );
    }
    else hidableChildrenStudentsTbody.showAll();

    hidableChildrenStudentsTbody.update();
}

function showDragNDropArea() {
    let element = document.getElementsByClassName('drag_and_drop_file').item(0);
    if (element.classList.contains('show'))
        element.classList.remove('show');
    else element.classList.add('show');
}

let dragArea = document.getElementById('drag_area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dragArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
});

['dragleave', 'drop'].forEach(eventName => {
    dragArea.addEventListener(eventName, () => {
        dragArea.classList.remove('drag_over');
    });
});

dragArea.addEventListener('dragover', () => {
    dragArea.classList.add('drag_over');
});

dragArea.addEventListener('drop', (e) => onFileInput(e.dataTransfer.files));

function onFileInput(files) {
    let formData = new FormData();
    formData.append('file', files[0]);
    console.log(files);
    showDragNDropArea();
}

studentsResponseData.then((responseData) => {
    fillStudentsTable(responseData.json);
    document.body.classList.add('loaded');
});