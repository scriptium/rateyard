const URLParams = new URLSearchParams(window.location.search);
const groupId = parseInt(URLParams.get('id'));
const groupPromise = new Promise(async (resolve, reject) => {
    let responseData = await getGroupFull(groupId);
    resolve(responseData.json);
});

const groupTitleElement = document.getElementById('group_title');
const groupSubtitleElement = document.getElementById('group_subtitle'); 
const marksTableElement = document.getElementById('marks_table');
const marksTableBodyElement = marksTableElement.getElementsByTagName('tbody')[0]; 
const marksTableHeadElement = marksTableElement.getElementsByTagName('thead')[0]; 

const toolsElement = document.getElementById('tools');
const columnToolHidableChildrenElement = new HidableChildrenElement(document.getElementById('column_tool'));
const markToolElement = document.getElementById('mark_tool');
const defaultToolElement = document.getElementById('default_tool');

groupPromise.then((group) => {
    groupTitleElement.innerHTML = `${group.group.class.name} ${group.group.name}`;
    groupSubtitleElement.innerHTML = group.subject.name;
    console.log(group);
    
    for (let i=0; i<10; i++){
        group.group.students.forEach((student) => {
            let newCellElement = document.createElement('td');
            newCellElement.innerHTML = student.full_name;
            let newRowElement = document.createElement('tr');
            newRowElement.appendChild(newCellElement);
            for (let i=0; i<100; i++) {
                let newCellElement = document.createElement('td');
                newCellElement.innerHTML = 11;
                newCellElement.setAttribute('onclick', 'focusCell(this)');
                newRowElement.appendChild(newCellElement);
            }
            marksTableBodyElement.appendChild(newRowElement);
        });
    }
    for (let i=10; i<100; i++) {
        let date = document.createElement('th')
        tippy(date, {
            content: `${i}.01.21<br>Зошит за березень`,
            allowHTML: true
        });
        date.innerHTML = `<div>${i}.01.21</div>`
        date.setAttribute('onclick', 'focusColumn(this)')
        marksTableHeadElement.children[0].appendChild(date)
    }
    hidePreloader();
});

function prepareColumToolElement(newColumn=true) {
    let columnToolElement = columnToolHidableChildrenElement.element;
    let deleteButtonElement = columnToolElement.querySelector('.delete_button');
    if (newColumn) {
        if (deleteButtonElement)
            columnToolHidableChildrenElement.hide(
                deleteButtonElement
            );
    }
    else {
        columnToolHidableChildrenElement.showAll();
    }
    columnToolHidableChildrenElement.update();
    columnToolElement.querySelectorAll('input').forEach(
        (inputElement) => {
            inputElement.value = null;
        }
    )
    return columnToolElement;
}

function changeTool(newTool) {
    let oldTool = document.querySelector('#tools>*:not(.hidden)');

    oldTool.classList.add('hidden');
    newTool.classList.remove('hidden');
    newTool.animate(
        [{opacity: '0'}, {opacity: '1'}],
        300
    );
}
 function unfocusAll() {
    document.querySelectorAll('#marks_table td.highlighted, #marks_table th.highlighted').forEach(
        (element) => {
            element.classList.remove('highlighted');
        }
    )
    document.querySelectorAll('#marks_table td.focused, #marks_table th.focused').forEach(
        (element) => {
            element.classList.remove('focused');
        }
    )
 }

function focusCell(cellElement) {
    unfocusAll();
    cellElement.classList.add('focused');
    let cellColumn = 0;
    let tempElement = cellElement.previousSibling;
    while (tempElement) {
        if (tempElement.nodeName === '#text') {
            tempElement = tempElement.previousSibling;
            continue;
        }
        cellColumn++;
        tempElement.classList.add('highlighted');
        tempElement = tempElement.previousSibling;
    }
    tempElement = cellElement.nextSibling;
    while (tempElement) {
        if (tempElement.nodeName === '#text') {
            tempElement = tempElement.nextSibling;
            continue;
        }
        tempElement.classList.add('highlighted');
        tempElement = tempElement.nextSibling;
    }
    let cellRow = 0;
    tempElement = cellElement.parentNode.previousSibling;

    while (tempElement) {
        if (tempElement.nodeName === '#text') {
            tempElement = tempElement.previousSibling;
            continue;
        }
        cellRow++;
        if (tempElement.children.item(cellColumn))
            tempElement.children[cellColumn].classList.add('highlighted');
        tempElement = tempElement.previousSibling;
    }   
    tempElement = cellElement.parentNode.nextSibling;
    while (tempElement) {
        if (tempElement.nodeName === '#text') {
            tempElement = tempElement.nextSibling;
            continue;
        }
        if (tempElement.children[cellColumn])
            tempElement.children[cellColumn].classList.add('highlighted');
        tempElement = tempElement.nextSibling;
    }
    
    marksTableHeadElement.querySelector('tr').children[cellColumn].classList.add('highlighted');
    console.log(cellColumn);
    console.log(cellRow)
}

function focusColumn(thElement) {
    unfocusAll();
    thElement.classList.add('focused')
    let cellColumn = 0;
    let tempElement = thElement.previousSibling;
    while (tempElement) {
        if (tempElement.nodeName === '#text') {
            tempElement = tempElement.previousSibling;
            continue;
        }
        cellColumn++;
        tempElement = tempElement.previousSibling;
    }
    for (let element of marksTableBodyElement.children)
        element.children[cellColumn].classList.add('highlighted');
}