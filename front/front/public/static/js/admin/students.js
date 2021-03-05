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
    console.log(parsedResponse);    
    insertStudentsData(parsedResponse, mainTbodyElement, true, false, searchIndex);
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

async function showDragNDropArea() {
    let black_area = document.getElementsByClassName('drag_and_drop_file').item(0);
    let drag_area = document.getElementById('drag_area');
    if (black_area.classList.contains('show'))
    {
        black_area.animate([{opacity: 1}, {opacity: 0}], 250);
        await drag_area.animate([{opacity: 1}, {opacity: 0}], 250).finished;

        black_area.classList.remove('show');
        drag_area.classList.remove('show');
    } else {
        black_area.classList.add('show');  
        drag_area.classList.add('show');
    }
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
    hidePreloader();
});