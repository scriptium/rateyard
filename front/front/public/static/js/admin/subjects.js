let subjects = getSubjects();

let getAllData = Promise.all([subjects]);

let table = document.getElementById('subjects_table');
let mainTbodyElement = table.getElementsByTagName('tbody')[0];

let backData = [];
let changes = 0;

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
        iconsElement.innerHTML = `<div class='edit_td'></div>
            <div class='delete_td' onclick='deleteSubjectFromTable(${subject.id})'></div>`;

        mainTbodyElement.appendChild(newRowElement);
    });

    table.classList.add('visible');
    return cnt;
}

function deleteSubjectFromTable(id) {
    changes++;
    let row = table.getElementsByTagName('tr').item(id);
    row.classList.add('to_delete');

    let icons = row.getElementsByTagName('td').item(2);
    icons.innerHTML = `<div class='back_td_light' onclick='backRowData(${id})'></div>`;
    
    showButtons();
}

function backRowData(id) {
    changes--;
    let row = table.getElementsByTagName('tr').item(id);
    row.innerHTML = backData[id - 1];
    row.classList.remove('to_delete');
    row.classList.remove('highlited');

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
        rows.item(i).innerHTML = backData[i - 1];
        rows.item(i).classList.remove('to_delete');
        rows.item(i).classList.remove('highlited');
    }
        
}

window.onload = async() => {    
    getAllData.then(values => {
        console.log(values);
        let cnt = fillSubjectsTable(values[0].json);
        for(let i = 0; i < cnt; i++)
            backData[i] = table.getElementsByTagName('tr').item(i + 1).innerHTML;
        hidePreloader();
    });
}