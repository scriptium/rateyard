let subjects = getSubjects();

let getAllData = Promise.all([subjects]);

let table = document.getElementById('subjects_table');
let mainTbodyElement = table.getElementsByTagName('tbody')[0];

let backData = {};
let changes = 0;

function findRow(id) {
    return [...table.getElementsByTagName('tr')].find(row => row.firstChild.innerHTML === `${id}`);
    // let rows = table.getElementsByTagName('tr');
    // for (let i = 0; i < rows.length; i++)
    //     if (rows.item(i).firstChild.innerHTML === `${id}`)
    //         return rows.item(i);
}

function fillSubjectsTable(data) {
    let cnt = 0;
    data.forEach(subject => {
        cnt++;
        let newRowElement = document.createElement('tr');

        let subjectIdElement = newRowElement.appendChild(document.createElement('td'));
        subjectIdElement.innerHTML = subject.id;

        let subjectNameElement = newRowElement.appendChild(document.createElement('td'));
        subjectNameElement.innerHTML = subject.name;

        let iconsElement = newRowElement.appendChild(document.createElement('td'));
        iconsElement.classList.add('td_icons');
        iconsElement.innerHTML = `<div class='edit_td' onclick='editSubjectName(${subject.id})'></div>
            <div class='delete_td' onclick='deleteSubjectFromTable(${subject.id})'></div>`;

        mainTbodyElement.appendChild(newRowElement);

        backData[`${subject.id}`] = newRowElement.innerHTML;
    });

    table.classList.add('visible');
    return cnt;
}

async function onInput(id, oldName, name) {
    let row = findRow(id);
    if (name !== oldName && row.children[2].childElementCount !== 2) {
        row.children[2].innerHTML = `<div class='save_td_light' onclick='saveInTable(${id})'></div> 
            <div class='back_td_light' onclick="backRowData(${id}, '${oldName}')"></div>`;
    } else if (name === oldName) {
        await row.children[2].firstChild.animate([{opacity: 1}, {opacity: 0}], 250).finished;
        row.children[2].innerHTML = `<div class='back_td_light' onclick="backRowData(${id}, '${oldName}')"></div>`;  
    } 
}

function editSubjectName(id) {
    changes++;
    let row = findRow(id);
    row.classList.add('edit');

    let subjectName = row.children[1];
    let oldName = subjectName.innerHTML;
    subjectName.innerHTML = `<input type='input' class='table_input' value='${oldName}'>`;

    row.children[2].innerHTML = `<div class='back_td_light' onclick="backRowData(${id}, '${oldName}')"></div>`;
    
    let input = subjectName.firstChild;
    input.focus();
    input.selectionStart = input.selectionEnd = input.value.length;

    input.setAttribute('oninput', `onInput(${id}, '${oldName}', this.value)`);
}

function saveInTable(id) {
    let row = findRow(id);
    let newName = row.children[1].children[0].value;
    backRowData(id);
    row.children[1].innerHTML = `${newName}`;
    row.children[2].innerHTML = `<div class='back_td' onclick='backRowData(${id})'></div>
        ${row.children[2].innerHTML}`;
    row.setAttribute('changed', true);

    changes++;
    showButtons();
}

function deleteSubjectFromTable(id) {
    changes++;
    let row = findRow(id);
    row.classList.add('to_delete');
    row.children[2].innerHTML = `<div class='back_td_light' 
        onclick="backRowData(${id}, '${row.children[1].innerHTML}')"></div>`;
    
    showButtons();
}

function backRowData(id, name = null) {
    let row = findRow(id);
    row.innerHTML = backData[id];
    console.log(row);
    if (name) row.children[1].innerHTML = name;
    row.className = '';
    if (row.getAttribute('changed')) {
        if (name)
            row.children[2].innerHTML = `<div class='back_td' onclick='backRowData(${id})'></div>
                ${row.children[2].innerHTML}`;
        else 
            row.toggleAttribute('changed', false);
    }

    changes--;
    if (!changes) discardChanges(true)
}

function showButtons() {
    document.querySelector('.appear_on_change').classList.add('visible');
}

function discardChanges(isOnlyHideButtons = false) {
    document.querySelector('.appear_on_change').classList.remove('visible');
    if(isOnlyHideButtons) return;

    let rows = table.getElementsByTagName('tr');

    for (let i = 1; i < rows.length; i++) {
        let row = rows.item(i);
        row.innerHTML = backData[row.firstChild.innerHTML];
        row.className = '';
    }
}

function saveChanges() {
    document.getElementById('preloader').classList.remove('hidden');
    let toDelete = [];
    let toChange = [];

    [...table.getElementsByTagName('tr')].forEach(row => {
        if (row.classList.contains('to_delete'))
            toDelete.push(row.children[0].innerHTML);
        else if (row.getAttribute('changed') && !row.classList.contains('edit'))
            toChange.push({subject_id: row.children[0].innerHTML, subject_name: row.children[1].innerHTML});
    });

    let deleting = toDelete ? deleteSubjects(toDelete) : new Promise();
    let editing = toChange ? editSubjects(toChange) : new Promise();

    Promise.all([deleting, editing]).then(() => {
        location.reload();
    }, error => {
        location.reload();
        console.log(error);
    });
}

window.onload = async() => {    
    getAllData.then(values => {
        // console.table(values[0].json);
        let cnt = fillSubjectsTable(values[0].json);
        hidePreloader();
    });
}
