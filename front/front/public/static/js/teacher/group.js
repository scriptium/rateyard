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
            console.log(marksTableBodyElement);
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
        marksTableHeadElement.children[0].appendChild(date)
    }
    hidePreloader();
});

function prepareColumToolElement(newColumn=true) {
    let columnToolElement = columnToolHidableChildrenElement.element;
    console.log(columnToolHidableChildrenElement.childrenIndexes)
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

function focusCell(cellElement) {
    document.querySelectorAll('#marks_table td.focused').forEach(
        (element) => {
            element.classList.remove('focused');
        }
    )
    cellElement.classList.add('focused');
    let cellColumn = 0;
    let tempElement = cellElement.previousSibling;
    while (tempElement.previousSibling) {
        cellColumn++;
        tempElement = tempElement.previousSibling;
        tempElement.classList.add('focused');
    }
    tempElement = cellElement.nextSibling;
    while (tempElement.nextSibling) {
        tempElement = tempElement.nextSibling;
        tempElement.classList.add('focused');
    }
    let cellRow = 0;
    tempElement = cellElement.parentNode.previousSibling;
    while (tempElement.previousSibling) {
        cellRow++;
        tempElement = tempElement.previousSibling;
        if (tempElement.childNodes[cellColumn])
            tempElement.childNodes[cellColumn].classList.add('focused');
    }   
    tempElement = cellElement.parentNode.nextSibling;
    while (tempElement.nextSibling) {
        tempElement = tempElement.nextSibling;
        if (tempElement.childNodes[cellColumn])
            tempElement.childNodes[cellColumn].classList.add('focused');
    }
    
    marksTableHeadElement.querySelector('tr').childNodes[cellColumn].classList.add('focused');
    console.log(cellColumn);
    console.log(cellRow)
}