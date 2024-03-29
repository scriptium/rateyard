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

const columnDateElement = document.getElementById('column_date');
const columnNameElement = document.getElementById('column_name');

let columnsArray;

let cellHoveredByKeyboard = false;

function hoverCell(cell) {
    for (let element of document.querySelectorAll('.hovered'))
        element.classList.remove('hovered');
    cell.classList.add('hovered');
}

marksTableElement.addEventListener('mousemove', () => { cellHoveredByKeyboard = false });

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
    for (let trElementIndex = 0; trElementIndex < marksTableBodyElement.children.length; trElementIndex++) {
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

async function fillMarksTable(columnForThReturn = null) {
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
        } else {
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
            let tdElement = marksTableBodyElement.children[mark.studentIndex].children[columnIndex];
            if (mark.points < 0) {
                tdElement.textContent = 'Н';
            } else tdElement.textContent = mark.points;
            tdElement.setAttribute('initial_value', tdElement.textContent);
            tdElement.setAttribute('marks_array_index', marksArrayIndex);
            tdElement.setAttribute('columns_array_index', columnIndex - 1);
            tooltipText = `Дата зміни: ${mark.edition_date.toLocaleDateString()}`
            if (mark.comment.length > 0) {
                tooltipText += `</br>Коментар: ${mark.comment}`
            }
            tippy(tdElement, {
                content: tooltipText,
                allowHTML: true
            });
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
            mark.edition_date = new Date(mark.edition_date * 1000);
            if (columnsMap.has(mark.column.id)) {
                columnsMap.get(mark.column.id).marks.push(mark);
            } else {
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
        (date.getMonth() + 1).toString().padStart(2, 0) + '-' +
        date.getDate().toString().padStart(2, 0);
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
    } else {
        saveColumnButtonElement.setAttribute('onclick', 'changeColumnButton()');
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
    } else {
        markToolHidableChildrenElement.showAll();
    }
    markToolHidableChildrenElement.update();
    document.getElementById('mark_comment').value = comment;
    let markPointsElement = document.getElementById('mark_points');
    if (points == -1) markPointsElement.value = 'Н';
    else markPointsElement.value = points;
    makeInputTextNotWrong(markPointsElement);
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
    if (inputElement) {
        inputElement.focus();
        if (inputElement.getAttribute('type')!='date') {
            inputElement.setSelectionRange(0, inputElement.value.length)
        }
    }
}

function unfocusAll(notResetElement = null) {
    document.querySelectorAll('#marks_table td.highlighted, #marks_table th.highlighted').forEach(
        (element) => {
            element.classList.remove('highlighted');
        }
    )
    document.querySelectorAll('#marks_table td.focused, #marks_table th.focused').forEach(
        (element) => {
            element.classList.remove('focused');
            if (element !== notResetElement) {
                if (element.tagName === 'TH') element.children[0].innerHTML = element.getAttribute('initial_value');
                else element.innerHTML = element.getAttribute('initial_value');
            }
        }
    )
}

async function focusCell(cellElement) {
    let focusedTd = document.querySelector('td.focused');
    if (focusedTd) {
        if (!(await saveMarkButton())) {
            return false;
        }
        cellElement = marksTableBodyElement.children[
            cellElement.getAttribute('row_index')
        ].children[
            cellElement.getAttribute('column_index')
        ]
    }
    unfocusAll(cellElement);
    hoverCell(cellElement);
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
    let cellRow = 0;
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
    } else {
        changeTool(prepareMarkToolElement(true));
    }
    return true;
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
    for (let points = 1; points < 13; points++) {
        markValues.push(points.toString())
    }
    let pointsStr = markPointsInputElement.value;
    if (pointsStr.length > 0) {
        if (!markValues.includes(pointsStr)) {
            makeInputTextWrong(markPointsInputElement);
            return false;
        }
        let focusedCellElement = document.querySelector('td.focused');
        let columnsArrayIndex = parseInt(focusedCellElement.getAttribute('column_index')) - 1;
        let column = columnsArray[columnsArrayIndex];
        let marksArrayIndexStr = focusedCellElement.getAttribute('marks_array_index');
        let markJSON = {};
        if (['н', 'Н'].includes(pointsStr)) markJSON.points = -1;
        else markJSON.points = parseInt(pointsStr);
        let markCommentInputElement = document.querySelector('#mark_comment');
        markJSON.comment = markCommentInputElement.value;
        if (marksArrayIndexStr) {
            let mark = column.marks[parseInt(marksArrayIndexStr)];
            markJSON.id = mark.id;
            if (mark.comment != markJSON.comment || markJSON.points != mark.points) {
                mark.comment = markJSON.comment;
                mark.points = markJSON.points;
                mark.edition_date = new Date();
                await editMark(markJSON);
            }
        } else {
            let group = await groupPromise;
            let studentIndex = parseInt(focusedCellElement.getAttribute('row_index'));
            let studentId = group.group.students[studentIndex].id;
            console.log(group.group.students[parseInt(focusedCellElement.getAttribute('row_index'))]);
            markJSON.student_id = studentId;
            if (column.id) {
                markJSON.column_id = column.id;
            } else {
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
            column.marks.push({
                id: responseJSON.mark_id,
                comment: markJSON.comment,
                points: markJSON.points,
                studentIndex,
                edition_date: new Date()
            })
            column.id = responseJSON.column_id;
        }
        fillMarksTable();
    }
    unfocusAll();
    changeTool(defaultToolElement);
    return true;
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
    if (columnDateElement.value === '' && columnNameElement.value === '') {
        makeInputTextWrong(columnDateElement);
        makeInputTextWrong(columnNameElement);
    } else {
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

async function changeColumnButton() {
    let focusedThElement = document.querySelector('th.focused');
    let column = columnsArray[focusedThElement.getAttribute('columns_array_index')];
    let changes = []
    if (column.name != columnNameElement.value) {
        column.name = columnNameElement.value;
        changes.push('name');
    }
    let new_date = new Date(columnDateElement.value)
    let new_date_ms = new_date.getTime();
    if (isNaN(new_date_ms)) new_date_ms = null;
    let old_date_ms = column.date;
    if (old_date_ms) old_date_ms = old_date_ms.getTime();
    if (old_date_ms != new_date_ms) {
        if (new_date_ms) column.date = new_date;
        else column.date = null;
        changes.push('date');
    }
    if (column.id) {
        let requestJSON = { id: column.id }
        if (changes.length > 0) {
            for (let change of changes) {
                if (change === 'date') {
                    if (column.date) requestJSON.date = column.date.getTime() / 1000;
                    else requestJSON.date = null;
                } else {
                    requestJSON[change] = column[change]
                }
            }
            await editColumn(requestJSON);
        }
    }
    fillMarksTable();
    changeTool(defaultToolElement);
    unfocusAll();
}

document.addEventListener('keydown', (event) => {
    let focusedCell = document.querySelector('.focused');
    if (focusedCell) {
        if (event.key == 'Escape') {
            changeTool(defaultToolElement);
            unfocusAll();
        } else if (event.key == 'Enter') {
            if (focusedCell.tagName == 'TD') {
                if (focusedCell.parentElement.nextElementSibling) {
                    let columnIndex = parseInt(focusedCell.getAttribute('column_index'));
                    focusCell(focusedCell.parentElement.nextElementSibling.children[columnIndex]);
                } else {
                    saveMarkButton();
                }
            } else {
                changeColumnButton();
            }
        } else if (event.key == 'Delete') {
            if (focusedCell.tagName == 'TH') deleteColumnButton();
            if (focusedCell.tagName == 'TD') deleteMarkButton();
        }
        return;
    };
    let hoveredCell = document.querySelector('.hovered');
    let newHoveredCell = null;
    if (hoveredCell) {
        if (event.key == 'ArrowDown') {
            if (hoveredCell.parentElement.nextElementSibling) {
                let columnIndex = hoveredCell.getAttribute('column_index');
                newHoveredCell = hoveredCell.parentElement.nextElementSibling.children[parseInt(columnIndex)];
            }
        } else if (event.key == 'ArrowUp') {
            if (hoveredCell.parentElement.previousElementSibling) {
                let columnIndex = hoveredCell.getAttribute('column_index');
                newHoveredCell = hoveredCell.parentElement.previousElementSibling.children[parseInt(columnIndex)];
            }
        } else if (event.key == 'ArrowLeft') {
            if (newHoveredCell = hoveredCell.previousElementSibling.previousElementSibling)
                newHoveredCell = hoveredCell.previousElementSibling;
        } else if (event.key == 'ArrowRight') {
            newHoveredCell = hoveredCell.nextElementSibling;
        } else if (event.key == 'Escape') {
            hoveredCell.classList.remove('hovered');
        } else if (event.key == 'Enter' && !focusedCell) {
            focusCell(hoveredCell);
        }
    } else if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        newHoveredCell = document.querySelector('#marks_table tbody tr:first-child td:last-child');
    }
    if (newHoveredCell) hoverCell(newHoveredCell);
    cellHoveredByKeyboard = true;
});

const excelExportButton = document.querySelector('#excel_export');

excelExportButton.onclick = async () => {
    if (!excelExportButton.hasAttribute('href')) {
        excelExportButton.classList.add('disabled');
        let tableRows = [];
        for (let tr of document.querySelectorAll('#marks_table>thead>tr, #marks_table>tbody>tr')) {
            let row = [];
            for (let td of tr.children) {
                row.push(td.textContent);
            }
            tableRows.push(row);
        }
        let responseData = await exportMarks({
            table_rows: tableRows
        });
        let group = await groupPromise;
        excelExportButton.setAttribute('href', 'data:application/vnd.ms-excel;base64,' + responseData.json.marks_table_base64);
        excelExportButton.setAttribute('download', `Оцінки ${group.subject.name} ${group.group.class.name} ${group.group.name}.xlsx`);
        excelExportButton.click();
        excelExportButton.classList.remove('disabled');
    }
}