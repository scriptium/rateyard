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
        let responseData = await importStudentsFromExcel({
            'table_base64': b64.substring(b64.search('base64,') + 'base64,'.length)
        });
        if (responseData.status != 200) {
            studentsDataInputElement.value = null;
            alert('Помилка зчитування учнів. Перевірте формат файлу.');
            hidePreloader();
            return;
        }
        importedStudents = responseData.json;
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
    if (!useRandomPassword && !studentsPasswordInputElement.value) {
        makeInputTextWrong(studentsPasswordInputElement);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    for (let student of studentsJSON) {
        student.class_id = student.class.id;
        delete student.class;
        if (!useRandomPassword) student.password = studentsPasswordInputElement.value;
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

// Excel import
let studentsPasswordInputElement = importedStudentsContent.querySelector('#students_password');
if (sessionStorage.getItem('previousPassword')) {
    studentsPasswordInputElement.value = sessionStorage.getItem('previousPassword');
}
let hideOnRandomPasswordElements = importedStudentsContent.querySelectorAll('.hide_on_random_password');
let useRandomPasswordSelectElement = importedStudentsContent.querySelector('#use_random_password');
useRandomPasswordSelectElement.onchange = updateUseRandomPassword;
updateUseRandomPassword();

function updateUseRandomPassword() {
    useRandomPassword = useRandomPasswordSelectElement.value === 'true';
    if (useRandomPassword) {
        for (let element of hideOnRandomPasswordElements) {
            element.classList.add('hidden');
        }
        downloadPasswordsAElement.classList.remove('hidden');
    } else {
        for (let element of hideOnRandomPasswordElements) {
            element.classList.remove('hidden');
        }
        downloadPasswordsAElement.classList.add('hidden');
    }
}