const URLParams = new URLSearchParams(window.location.search);
const groupId = parseInt(URLParams.get('id'));
const subjectId = parseInt(URLParams.get('subject_id'));
const groupPromise = new Promise(async resolve => {
    let responseData = await getGroupFull(groupId, subjectId);
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

let cellHoveredByKeyboard = false;

function hoverCell(cell) {
    for (let element of document.querySelectorAll('.hovered'))
        element.classList.remove('hovered');
    cell.classList.add('hovered');
}

marksTableElement.addEventListener('mousemove', () => {cellHoveredByKeyboard = false});

function addEmptyColumn(thElement) {
    marksTableHeadElement.children[0].appendChild(thElement);
    thElement.setAttribute('onclick', 'focusColumn(this)');
    thElement.setAttribute('initial_value', thElement.children[0].innerHTML);
    let hoverCallback = (event) => {
        if (cellHoveredByKeyboard) return;
        hoverCell(event.target)
    }
    let unhoverCallback = (event) => {
        if (document.querySelector('.focused')) event.target.classList.remove('hovered');
    }
    thElement.addEventListener('mouseenter', hoverCallback);
    for (let trElementIndex=0; trElementIndex < marksTableBodyElement.children.length; trElementIndex++) {
        let trElement = marksTableBodyElement.children[trElementIndex];
        let emptyTdElement = document.createElement('td');
        emptyTdElement.setAttribute('onclick', 'focusCell(this)');
        emptyTdElement.addEventListener('mouseenter', hoverCallback);
        emptyTdElement.addEventListener('mouseleave', unhoverCallback);
        emptyTdElement.setAttribute('initial_value', '');
        emptyTdElement.setAttribute('row_index', trElementIndex);
        emptyTdElement.setAttribute('column_index', marksTableHeadElement.children[0].childElementCount - 1);
        trElement.appendChild(emptyTdElement);
    }
    return marksTableHeadElement.children[0].childElementCount - 1;
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
        newThElement.addEventListener('mouseenter', hoverCell);
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

function updatePointsInFocusedCell(points) {
    document.querySelector('#marks_table tbody td.focused').innerHTML = points;
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
    markPointsElement.setAttribute('oninput', 'updatePointsInFocusedCell(this.value)');
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
        changeTool(prepareMarkToolElement(false, mark.points, mark.comment));
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

    columnsArray.splice(columnIndex, 1);
    fillMarksTable();
    changeTool(defaultToolElement);
    if (column.id) {
        for (let mark of column.marks) {
            deleteMark(mark.id);
        }
    }
}

function deleteMarkButton() {
    let focusedTdElement = document.querySelector('td.focused');
    let columnIndex = focusedTdElement.getAttribute('columns_array_index');
    let markIndex = focusedTdElement.getAttribute('marks_array_index');
    let mark = columnsArray[columnIndex].marks[markIndex];
    confirmed = confirm('Видалити оцінку?')
    if (!confirmed) return;
    deleteMark(mark.id);
    columnsArray[columnIndex].marks.splice(markIndex, 1);
    if (columnsArray[columnIndex].marks.length === 0) {
        columnsArray[columnIndex].id = null;
    }
    fillMarksTable();
    changeTool(defaultToolElement);
}

async function saveMarkButton() {
    let markPointsInputElement = document.querySelector('#mark_points');
    markValues = ['н', 'Н']
    for (let points=1; points<13; points++) {
        markValues.push(points.toString())
    }
    let pointsStr = markPointsInputElement.value;
    if (!markValues.includes(pointsStr)) {
        makeInputTextWrong(markPointsInputElement);
        return;
    }
    let focusedCellElement = document.querySelector('td.focused');
    let columnsArrayIndex = parseInt(focusedCellElement.getAttribute('column_index')) - 1;
    let column = columnsArray[columnsArrayIndex];
    let marksArrayIndexStr = focusedCellElement.getAttribute('marks_array_index');
    let markJSON = {};
    if (['н', 'Н'].includes(pointsStr)) markJSON.points = null;
    else markJSON.points = parseInt(pointsStr);
    let markCommentInputElement = document.querySelector('#mark_comment');
    markJSON.comment = markCommentInputElement.value;
    if (marksArrayIndexStr) {
        let mark = column.marks[parseInt(marksArrayIndexStr)];
        markJSON.id = mark.id;
        mark.comment = markJSON.comment;
        mark.points = markJSON.points;
        let responseJSON = await editMark(markJSON);
        console.log(responseJSON);
    }
    else {
        let group = await groupPromise;
        let studentIndex = parseInt(focusedCellElement.getAttribute('row_index'));
        let studentId = group.group.students[studentIndex].id;
        console.log(group.group.students[parseInt(focusedCellElement.getAttribute('row_index'))]);
        markJSON.student_id = studentId;
        if (column.id) {
            markJSON.column_id = column.id;
        }
        else {
            let subject_id = group.subject.id;
            let date = null;
            if (column.date) date = column.date.getTime() / 1000;
            markJSON.new_column = {
                name: column.name,
                date,
                subject_id,
            }
        }
        let responseJSON = (await createMark(markJSON)).json;
        focusedCellElement.setAttribute('marks_array_index', column.marks.length);
        focusedCellElement.setAttribute(
            'columns_array_index',
            parseInt(focusedCellElement.getAttribute('column_index')) - 1
        );
        console.log(column.marks);
        column.marks.push({
            id: responseJSON.mark_id,
            comment: markJSON.comment,
            points: markJSON.points,
            studentIndex
        })
        column.id = responseJSON.column_id;
    }
    focusedCellElement.setAttribute('initial_value', focusedCellElement.innerHTML);
    unfocusAll();
    changeTool(defaultToolElement);
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
        if (columnDateElement.value.length > 0) {
            date = new Date(columnDateElement.value);
        }
        let name = null;
        if (columnNameElement.value.length > 0) {
            name = columnNameElement.value;
        }
        let column = {
            creation_date: new Date(Date.now()),
            date,
            name: name,
            marks: [],
            id: null
        }
        columnsArray.push(column);
        thElement = await fillMarksTable(column);
        focusColumn(thElement);
    }
}

document.addEventListener('keydown', (event) => {
    let focusedCell = document.querySelector('.focused');
    if (focusedCell) {
        if (event.key == 'Escape') {
            changeTool(defaultToolElement);
            unfocusAll();
        }
        return;
    }
    let hoveredCell = document.querySelector('.hovered');
    let newHoveredCell = null;
    if (hoveredCell) {
        if (event.key == 'ArrowDown') {
            if (hoveredCell.parentElement.nextElementSibling) {
                let columnIndex = hoveredCell.getAttribute('column_index');
                newHoveredCell = hoveredCell.parentElement.nextElementSibling.children[parseInt(columnIndex)];
            }
        }
        else if (event.key == 'ArrowUp') {
            if (hoveredCell.parentElement.previousElementSibling) {
                let columnIndex = hoveredCell.getAttribute('column_index');
                newHoveredCell = hoveredCell.parentElement.previousElementSibling.children[parseInt(columnIndex)];
            }
        }
        else if (event.key == 'ArrowLeft') {
            if (newHoveredCell = hoveredCell.previousElementSibling.previousElementSibling)
                newHoveredCell = hoveredCell.previousElementSibling;
        }
        else if (event.key == 'ArrowRight') {
            newHoveredCell = hoveredCell.nextElementSibling;
        }
        else if (event.key == 'Escape') {
            hoveredCell.classList.remove('hovered');
        }
        else if (event.key == 'Enter' && !document.querySelector('.focused')) {
            focusCell(hoveredCell);
        }
    }
    else if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        newHoveredCell = document.querySelector('#marks_table tbody tr:first-child td:last-child');
    }
    if (newHoveredCell) hoverCell(newHoveredCell);
    cellHoveredByKeyboard = true;
})