let windowHasLoaded = new Promise((resolve) => { window.onload = resolve });

const mainTbodyElement = document.querySelector('#group_students tbody');
const className = document.querySelector('#name');

let hidableChildrenStudentsTbody;
let changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'));

let searchIndex = FlexSearch.create({
    encode: "icase",
    split: /\s+/,
    tokenize: "forward"
});

const previousURL = 'classes.php';

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

function updateClassStudentData() {
    return new Promise(async (resolve, reject) => {
        document.querySelectorAll('.appear_after_group_students').forEach(
            (element) => {
                element.classList.remove('visible');
            }
        );
        let studentsData = await getStudents();
        insertStudentsData(studentsData.json, mainTbodyElement, true, true, searchIndex);
        hidableChildrenStudentsTbody = new HidableChildrenElement(mainTbodyElement);
        resolve();
    });
}

function saveNewClassButton(buttonElement) {
    if (className.value === '') {
        makeInputTextWrong(className);
        return;
    }

    buttonElement.classList.add('disabled');
    let name = className.value;
    let studentsIds = [];

    [...mainTbodyElement.children].forEach(tr => {
        if (tr.firstChild.firstChild.classList.contains('checked')) {
            studentsIds.push(+tr.children[1].innerHTML);
        }
    });

    console.log(studentsIds);

    createClass(name, studentsIds).then(
        (requestData) => {
            if (requestData.status === 200) location.replace(previousURL);
            else {
                makeInputTextWrong(className);
                buttonElement.classList.remove('disabled');
            }
        }
    );
}

let classStudentsHasFilled = updateClassStudentData();

let mainPromise = Promise.all([classStudentsHasFilled]);
mainPromise.then(hidePreloader);
