function delete_row(delete_button) {
    let row = delete_button.parentNode.parentNode;

    row.setAttribute("data-previous-color", row.style.backgroundColor);
    row.style.backgroundColor = 'Red';

    row.setAttribute("data-delete", "true");
    row.setAttribute("data-edit", "false");
    delete_button.setAttribute("onclick", "undo_delete_row(this);");

    let editButton = row.getElementsByClassName("edit_button")[0];
    editButton.style.visibility = 'hidden';
    
}

function undo_delete_row(delete_button){
    let row = delete_button.parentNode.parentNode;
    row.removeAttribute("data-delete", "false");
    if(row.hasAttribute("data-edit"))
        row.setAttribute("data-edit", "true");
    row.style.backgroundColor = row.getAttribute("data-previous-color");
    //row.removeAttribute("data-previous-color");

    delete_button.setAttribute("onclick", "delete_row(this);");

    let editButton = row.getElementsByClassName("edit_button")[0];
    editButton.style.visibility = 'visible';
}

function toggle_edit_row(button){
    let row = button.parentElement.parentElement;
    
    make_readwrite_row(button);

    row.setAttribute("data-previous-color", row.style.backgroundColor);
    row.style.backgroundColor = 'LightSteelBlue';

    for (let col_index = 0; col_index < row.children.length; col_index++ )
    {
        let cell = row.cells[col_index];
        if(cell.firstChild.tagName == "INPUT") {
            let input = cell.firstChild;
            input.setAttribute("data-previous", input.value);
        }
        else if(cell.firstChild.tagName == "SELECT") {
            let select = cell.firstChild;
            select.setAttribute("data-previous", select.selectedIndex)
        }
    }

    let editButton = row.getElementsByClassName("edit_button")[0];
    let deleteButton = row.getElementsByClassName("delete_button")[0];
    editButton.setAttribute("class", "confirm_button");
    editButton.setAttribute("onclick", "confirm_edit_row(this);");

    deleteButton.setAttribute("class","cancel_button");
    deleteButton.setAttribute("onclick", "cancel_edit_row(this);");
}

function confirm_edit_row(button){
    let row = button.parentElement.parentElement;
    
    let difference = false;
    for (let col_index = 0; col_index < row.children.length; col_index++ )
    {
        let cell = row.cells[col_index];
        if(cell.firstChild.tagName == "INPUT") {
            let input = cell.firstChild;

            if (input.getAttribute("data-previous") != input.value) 
            {
                difference = true;
            }
            input.removeAttribute("data-previous");
        }
        else if(cell.firstChild.tagName == "SELECT") {
            let select = cell.firstChild;
            if(select.getAttribute("data-previous") != select.selectedIndex) {
                difference = true;
            }
            select.removeAttribute("data-previous")
        }
    }

    if (difference) {
        row.style.backgroundColor = 'lightgreen';
        row.setAttribute("data-edit", "true");
    }
    else row.style.backgroundColor = row.getAttribute("data-previous-color");

    make_readonly_row(button);

    let confirmButton = row.getElementsByClassName("confirm_button")[0];
    let cancelButton = row.getElementsByClassName("cancel_button")[0];
    confirmButton.setAttribute("class","edit_button");
    confirmButton.setAttribute("onclick", "toggle_edit_row(this);");

    cancelButton.setAttribute("class","delete_button");
    cancelButton.setAttribute("onclick", "delete_row(this);");
}

function cancel_edit_row(button){
    let row = button.parentElement.parentElement;

    row.style.backgroundColor = row.getAttribute("data-previous-color");
    //row.removeAttribute("data-previous-color");

    for (let col_index = 0; col_index < row.children.length; col_index++ )
    {
        let cell = row.cells[col_index];
        if(cell.firstChild.tagName == "INPUT") {
            let input = cell.firstChild;
            input.value = input.getAttribute("data-previous");
            input.removeAttribute("data-previous");
        }
        else if(cell.firstChild.tagName == "SELECT") {
            let select = cell.firstChild;
            select[select.selectedIndex].selected = false;
            select[select.selectedIndex].disabled = true;
            select[select.selectedIndex].disabled = false;
            select[select.getAttribute("data-previous")].selected = true;
            select.removeAttribute("data-previous");
        }
    }

    make_readonly_row(button);
    
    let confirmButton = row.getElementsByClassName("confirm_button")[0];
    let cancelButton = row.getElementsByClassName("cancel_button")[0];
    confirmButton.setAttribute("class","edit_button");
    confirmButton.setAttribute("onclick", "toggle_edit_row(this);");

    cancelButton.setAttribute("class","delete_button");
    cancelButton.setAttribute("onclick", "delete_row(this);");
}

function make_select_disabled(select) {
    let selected = select.selectedIndex;
    for(let option_index = 0; option_index < select.options.length; option_index++) {
        select.options[option_index].disabled = true;
        select.options[option_index].selected = false;
    }
    select.options[selected].disabled = false;
    select.options[selected].selected = true;
}

function make_select_editable(select) {
    for(let option_index = 0; option_index < select.options.length; option_index++) {
        select.options[option_index].disabled = false;
    }
}

function make_readonly_row(button){
    let row = button.parentElement.parentElement;
    for (let col_index = 0; col_index < row.children.length; col_index++ )
    {
        let cell = row.cells[col_index];
        if(cell.firstChild.tagName == "INPUT") {
            let input = cell.firstChild;
            input.setAttribute("readonly", "readonly");
        }
        else if(cell.firstChild.tagName == "SELECT") {
            let select = cell.firstChild;
            make_select_disabled(select)
        }
    }
}

function make_readwrite_row(button){
    let row = button.parentElement.parentElement;
    for (let col_index = 0; col_index < row.children.length; col_index++ )
    {
        let cell = row.cells[col_index];
        if(cell.firstChild.tagName == "INPUT") {
            let input = cell.firstChild;
            input.removeAttribute("readonly");
        }
        else if(cell.firstChild.tagName == "SELECT") {
            let select = cell.firstChild;
            make_select_editable(select);
        }
    }
}


function sort_table_by_column(table, column, ascending = true) {
    let direction = ascending ? 1 : -1;
    let tbody = table.tBodies[0];
    let rows = Array.from(tbody.querySelectorAll("tr"));
    const sorted = rows.sort((a, b) => {
        let a_data = a.querySelector(`td:nth-child(${ column + 1 })`).firstChild;
        let b_data = b.querySelector(`td:nth-child(${ column + 1 })`).firstChild;
        if(a_data.tagName=="INPUT") {
            a_data = a_data.value.trim();
            b_data = b_data.value.trim();
        }
        if(a_data.tagName=="SELECT") {
            a_data = a_data.options[a_data.selectedIndex].text.trim();
            b_data = b_data.options[b_data.selectedIndex].text.trim();
        }
        return a_data > b_data ? direction : -direction;
    });
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    tbody.append(...sorted);

    table.querySelectorAll("th").forEach(th => th.classList.remove("th_sort_ascending", "th_sort_descending"));
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th_sort_ascending", ascending);
    table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th_sort_descending", !ascending);
}

function make_readable_row(tbody, selected_row) {
    let rows = tbody.rows;
    for(let row_index = 0; row_index < rows.length; row_index++) {
        for(let col_index = 0; col_index < rows[row_index].cells.length; col_index++) {
            let cell = rows[row_index].cells[col_index];
            if(cell.firstChild.tagName == "INPUT") continue;
            let input = cell.firstChild;
            if(row_index != selected_row)
                input.setAttribute("readonly", "readonly")
            else
                input.removeAttribute("readonly");
        }
    }
}



document.querySelectorAll(".table_sortable .th_sortable").forEach(header => {
    header.addEventListener("click", () => {
        let table = header.parentElement.parentElement.parentElement;
        let column_header = Array.prototype.indexOf.call(header.parentElement.children, header);
        let ascending = header.classList.contains("th_sort_ascending");
        sort_table_by_column(table, column_header, !ascending);
    });
});


// document.addEventListener("dblclick", function(event)  {
//     if(event.target && event.target.classList.contains("input_text_table")) {
//         let tbody = event.target.parentElement.parentElement.parentElement;
//         let selected_row = Array.prototype.indexOf.call(tbody.children, event.target.parentElement.parentElement);
//         make_readable_row(tbody, selected_row);
//     }
// });
