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

    if (text !== '') {
        hidableChildrenStudentsTbody.hideAll();
        searchedTrs.forEach(
            (tr) => { hidableChildrenStudentsTbody.show(tr); }
        );
    }
    else hidableChildrenStudentsTbody.showAll();

    hidableChildrenStudentsTbody.update();
}

const preloaderElement = document.getElementById('preloader');
const defaultContentElement = document.getElementById('content');
const importedStudentsContent = document.importNode(
    document.getElementById('imported_students_content').content.firstElementChild,
    true);
const importedStudentsTableTbodyElement = importedStudentsContent.querySelector(
    '#imported_students_table>tbody'
)
let importedStudents = null;

// application/vnd.ms-excel
let downloadPasswordsAElement = importedStudentsContent.querySelector('#download_passwords')

async function onFileInput(files) {
    if (files[0]) {
        preloaderElement.classList.remove('hidden');
        let reader = new FileReader();
        let b64 = await new Promise(resolve => {
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                resolve(reader.result)
            }
        })
        importedStudents = (await importStudentsFromExcel({
            'table_base64': b64.substring(b64.search('base64,') + 'base64,'.length)
        })).json;
        downloadPasswordsAElement.setAttribute(
            'href',
            'data:application/vnd.ms-excel;base64,' + importedStudents.passwords_table_base64);
        downloadPasswordsAElement.setAttribute(
            'download',
            'students.xlsx'
        );
        for (let student of importedStudents.students) {
            importedStudentsTableTbodyElement.innerHTML +=
                `<tr>
                <td>${student.full_name}</td>
                <td>${student.class.name}</td>
                <td>${student.username}</td>
            </tr>`
        }
        document.body.replaceChild(importedStudentsContent, defaultContentElement);
        hidePreloader();
    }
}

async function saveImportedStudents() {
    let studentsJSON = importedStudents.students;
    for (let student of studentsJSON) {
        student.class_id = student.class.id;
        delete student.class;
    }
    preloaderElement.classList.remove('hidden');
    await createStudents(studentsJSON);
    document.location.reload();
}

const studentsDataInputElement = document.querySelector('#students_data_file');

function excelButton() {
    studentsDataInputElement.click();
}

studentsResponseData.then((responseData) => {
    fillStudentsTable(responseData.json);
    hidePreloader();
});