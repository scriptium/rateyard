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
const markToolHidableChildrenElement = new HidableChildrenElement(document.getElementById('mark_tool'));
const markToolElement = document.getElementById('mark_tool');
const defaultToolElement = document.getElementById('default_tool');

let columnsArray;

function addEmptyColumn(thElement) {
    marksTableHeadElement.children[0].appendChild(thElement);
    thElement.setAttribute('onclick', 'focusColumn(this)');
    thElement.setAttribute('initial_value', thElement.children[0].innerHTML);
    for (let trElement of marksTableBodyElement.children) {
        let emptyTdElement = document.createElement('td');
        emptyTdElement.setAttribute('onclick', 'focusCell(this)');
        emptyTdElement.setAttribute('initial_value', '');
        trElement.appendChild(emptyTdElement);
    }
    return marksTableBodyElement.children[0].childElementCount - 1;
}

async function fillMarksTable(columnForThReturn=null) {
    marksTableBodyElement.innerHTML = '';
    marksTableHeadElement.children[0].innerHTML = '';
    let group = await groupPromise;
    let firstThElement = document.createElement('th');
    firstThElement.innerHTML = 'ПІБ';
    marksTableHeadElement.children[0].appendChild(firstThElement);
    for (let student of group.group.students) {
        let newCellElement = document.createElement('td');
        newCellElement.innerHTML = student.full_name;
        let newRowElement = document.createElement('tr');
        newRowElement.appendChild(newCellElement);
        marksTableBodyElement.appendChild(newRowElement);
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
    let returnTh;
    for (let column of columnsArray) {
        let newThElement = document.createElement('th');
        if (column === columnForThReturn)
            returnTh = newThElement; 
        let thText;
        if (column.name) {
            thText = column.name;
        }
        else {
            thText = column.date.toLocaleDateString();
        }
        newThElement.innerHTML = `<div>${thText}</div>`;
        let tooltipText;
        if (column.date && column.name) tooltipText =
            `${column.name} (${column.date.toLocaleDateString()})`
        else if (column.date) tooltipText = column.date.toLocaleDateString();
        else tooltipText = column.name;
        tippy(newThElement, {
            content: tooltipText,
            allowHTML: true
        });
        let columnIndex = addEmptyColumn(newThElement);
        newThElement.setAttribute('columns_array_index', columnIndex - 1);
        for (let marksArrayIndex = 0; marksArrayIndex < column.marks.length; marksArrayIndex++) {
            let mark = column.marks[marksArrayIndex];
            mark.edition_date = new Date(mark.edition_date * 1000);
            let tdElement = marksTableBodyElement.children[mark.studentIndex].children[columnIndex];
            tdElement.innerHTML = mark.points;
            tdElement.setAttribute('initial_value', mark.points);
            tdElement.setAttribute('marks_array_index', marksArrayIndex);
            tdElement.setAttribute('columns_array_index', columnIndex - 1);
        }
    }
    return returnTh;
}

groupPromise.then((group) => {
    groupTitleElement.innerHTML = `${group.group.class.name} ${group.group.name}`;
    groupSubtitleElement.innerHTML = group.subject.name;
    console.log(group);
    
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
    columnsArray = [];
    for (let column of columnsMap.values()) {
        columnsArray.push(column);
        column.creation_date = new Date(column.creation_date * 1000);
        if (column.date) column.date = new Date(column.date * 1000);
    }
    fillMarksTable();
    hidePreloader();
});

function dateToInputDateString(date) {
    return date.getFullYear().toString() + '-' +
        (date.getMonth() + 1).toString().padStart(2, 0) + '-'
        + date.getDate().toString().padStart(2, 0);
}

function prepareColumToolElement(newColumn = true, date = null, name = null) {
    let columnToolElement = columnToolHidableChildrenElement.element;
    let deleteButtonElement = columnToolElement.querySelector('.delete_button');
    let saveColumnButtonElement = document.getElementById('save_column_button');
    if (newColumn) {
        if (deleteButtonElement)
            columnToolHidableChildrenElement.hide(
                deleteButtonElement
            );
        unfocusAll();
        saveColumnButtonElement.setAttribute('onclick', 'addColumnButton()');
    }
    else {
        columnToolHidableChildrenElement.showAll();
    }
    columnToolHidableChildrenElement.update();
    if (date) date = dateToInputDateString(date);
    document.getElementById('column_date').value = date;
    document.getElementById('column_name').value = name;
    return columnToolElement;
}

function prepareMarkToolElement(newMark = true, points = null, comment = null) {
    let markToolElement = markToolHidableChildrenElement.element;
    let deleteButtonElement = markToolElement.querySelector('.delete_button');
    if (newMark) {
        if (deleteButtonElement)
            markToolHidableChildrenElement.hide(
                deleteButtonElement
            );
    }
    else {
        markToolHidableChildrenElement.showAll();
    }
    markToolHidableChildrenElement.update();
    document.getElementById('mark_comment').value = comment;
    let markPointsElement = document.getElementById('mark_points');
    markPointsElement.value = points;
    markPointsElement.oninput = (event) => {
        document.querySelector('#marks_table tbody td.focused').innerHTML = event.target.value;
    }
    return markToolElement;
}

function changeTool(newTool) {
    let oldTool = document.querySelector('#tools>*:not(.hidden)');

    if (oldTool !== newTool) {
        oldTool.classList.add('hidden');
        newTool.classList.remove('hidden');
        newTool.animate(
            [{ opacity: '0' }, { opacity: '1' }],
            300
        );
    }

    let inputElement = newTool.querySelector('input');
    if (inputElement) inputElement.focus();
}

function unfocusAll(notResetElement=null) {
    document.querySelectorAll('#marks_table td.highlighted, #marks_table th.highlighted').forEach(
        (element) => {
            element.classList.remove('highlighted');
        }
    )
    document.querySelectorAll('#marks_table td.focused, #marks_table th.focused').forEach(
        (element) => {
            element.classList.remove('focused');
            if (element!==notResetElement) {
                if (element.tagName ==='TH') element.children[0].innerHTML = element.getAttribute('initial_value');
                else element.innerHTML = element.getAttribute('initial_value');
            }
        }
    )
}

function focusCell(cellElement) {
    unfocusAll(cellElement);
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
    tempElement = cellElement.parentNode.previousSibling;
    let cellRow=0;
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
    let marksArrayIndex = cellElement.getAttribute('marks_array_index');
    let columnsArrayIndex = cellElement.getAttribute('columns_array_index');
    if (marksArrayIndex && columnsArrayIndex) {
        let mark = columnsArray[columnsArrayIndex].marks[marksArrayIndex];
        changeTool(prepareMarkToolElement(false, cellElement.innerHTML, mark.comment));
    }
    else {
        changeTool(prepareMarkToolElement(true));
    }
}

function deleteColumnButton() {
    let focusedThElement = document.querySelector('th.focused');
    let columnIndex = focusedThElement.getAttribute('columns_array_index');
    let column = columnsArray[columnIndex];
    let confirmed = true;
    if (column.marks.length > 0)
        confirmed = confirm('Видалити колонку? Оцінки з цієї колонки також буде видалено.')
    if (!confirmed) return;
    if (column.id) {
        console.log('id not null')
    }
    columnsArray.splice(columnIndex, 1);
    fillMarksTable();
    changeTool(defaultToolElement);
    for (let mark of column.marks) {
        deleteMark(mark.id);
    }
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

    let column = columnsArray[parseInt(thElement.getAttribute('columns_array_index'))];
    changeTool(prepareColumToolElement(false, column.date, column.name));
}

async function addColumnButton() {
    let columnDateElement = document.getElementById('column_date');
    let columnNameElement = document.getElementById('column_name');
    if (columnDateElement.value === '' && columnNameElement.value === '') {
        makeInputTextWrong(columnDateElement);
        makeInputTextWrong(columnNameElement);
    }
    else {
        makeInputTextNotWrong(columnDateElement);
        makeInputTextNotWrong(columnNameElement);
        let date = null;
        if (columnDateElement.value !== '') {
            date = new Date(columnDateElement.value);
        }
        let column = {
            creation_date: new Date(Date.now()),
            date,
            name: columnNameElement.value,
            marks: [],
            id: null
        }
        columnsArray.push(column);
        thElement = await fillMarksTable(column);
        focusColumn(thElement);
    }
}