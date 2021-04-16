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

async function onFileInput(files) {
    if (files[0]) {
        let reader = new FileReader();
        let b64 = await new Promise(resolve => {
            reader.readAsDataURL(files[0]);
            reader.onloadend = () => {
                resolve(reader.result)
            }
        })
        let result = await importStudentsFromExcel({
            'table_base64': b64.substring(b64.search('base64,')+'base64,'.length)
        });
        console.log(result);
    }
}

const studentsDataInputElement = document.querySelector('#students_data_file');

function excelButton() {
    studentsDataInputElement.click();
}

studentsResponseData.then((responseData) => {
    fillStudentsTable(responseData.json);
    hidePreloader();
});