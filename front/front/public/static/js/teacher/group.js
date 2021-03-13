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

function addEmptyColumn(thElement) {
    marksTableHeadElement.children[0].appendChild(thElement);
    for (let trElement of marksTableBodyElement.children) {
        let emptyTdElement = document.createElement('td');
        trElement.appendChild(emptyTdElement);
    }
    return marksTableBodyElement.children[0].childElementCount - 1;
}

groupPromise.then((group) => {
    groupTitleElement.innerHTML = `${group.group.class.name} ${group.group.name}`;
    groupSubtitleElement.innerHTML = group.subject.name;
    console.log(group);

    for (let student of group.group.students) {
        let newCellElement = document.createElement('td');
        newCellElement.innerHTML = student.full_name;
        let newRowElement = document.createElement('tr');
        newRowElement.appendChild(newCellElement);
        marksTableBodyElement.appendChild(newRowElement);
    }
    let columnsMap = new Map();
    for (let studentIndex = 0; studentIndex < group.group.students.length; studentIndex++) {
        let student = group.group.students[studentIndex];
        for (let mark of student.marks) {
            mark.studentIndex = studentIndex;
            if (columnsMap.has(mark.column.id)) {
                columnsMap.get(mark.column.id).marks.push(mark);
            }
            else {
                let columnWithMarks = Object.assign({}, mark.column);
                columnWithMarks.marks = [mark];
                columnsMap.set(mark.column.id, columnWithMarks);
            }
        }
    }
    let columnsArray = [];
    for (let column of columnsMap.values()) {
        columnsArray.push(column);
    }
    let sortComparator = (leftColumn, rightColumn) => {
        let leftDate = leftColumn.creation_date;
        let rightDate = rightColumn.creation_date;
        if (leftColumn.date) {
            leftDate = leftColumn.date
        }
        if (rightColumn.date) {
            rightDate = rightColumn.date
        }
        return leftDate - rightDate;
    }
    columnsArray.sort(sortComparator);
    console.log(columnsArray);
    for (let column of columnsArray) {
        let newThElement = document.createElement('th');
        let trText;
        let date;
        if (column.date) date = new Date(column.date * 1000);
        if (column.name)
        {
            trText = column.name;
        }
        else {
            trText = date.toLocaleDateString();
        }
        newThElement.innerHTML = `<div>${trText}</div>`;
        let tooltipText;
        if (column.date && column.name) tooltipText = 
            `${column.name} (${date.toLocaleDateString()})`
        else if (column.date) tooltipText = date.toLocaleDateString();
        else tooltipText = column.name;
        tippy(newThElement, {
            content: tooltipText,
            allowHTML: true
        });
        let columnIndex = addEmptyColumn(newThElement);
        for (let mark of column.marks) {
            marksTableBodyElement.children[mark.studentIndex].children[columnIndex].innerHTML = mark.points;
        }
    }
    hidePreloader();
});

function prepareColumToolElement(newColumn = true) {
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
        [{ opacity: '0' }, { opacity: '1' }],
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