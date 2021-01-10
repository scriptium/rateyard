function delete_student(delete_button) {
    let row = delete_button.parentNode.parentNode;

    row.setAttribute("data-previous-color", row.style.backgroundColor);
    row.style.backgroundColor = 'Red';

    row.setAttribute("data-changed-delete", "true");

    delete_button.setAttribute("onclick", "undo_delete_student(this);");

    let editButton = row.getElementsByClassName("edit_button")[0];
    editButton.style.visibility = 'hidden';
    
}

function undo_delete_student(delete_button){
    let row = delete_button.parentNode.parentNode;
    row.removeAttribute("data-changed-delete", "false");

    row.style.backgroundColor = row.getAttribute("data-previous-color");
    //row.removeAttribute("data-previous-color");

    delete_button.setAttribute("onclick", "delete_student(this);");

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
        if(cell.firstChild.tagName != "INPUT") continue;
        let input = cell.firstChild;
        input.setAttribute("data-previous", input.getAttribute("value"));
    }

    let editButton = row.getElementsByClassName("edit_button")[0];
    let deleteButton = row.getElementsByClassName("delete_button")[0];
    editButton.setAttribute("class","confirm_button");
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
        if(cell.firstChild.tagName != "INPUT") continue;
        let input = cell.firstChild;

        if ( input.getAttribute("data-previous") != input.getAttribute("value") ) 
        {
            difference = true;
            break;
        }
    }

    if ( difference ) row.style.backgroundColor = 'lightgreen';
    else row.style.backgroundColor = row.getAttribute("data-previous-color");

    row.setAttribute("data-changed", "true");
    

    make_readonly_row(button);

    let confirmButton = row.getElementsByClassName("confirm_button")[0];
    let cancelButton = row.getElementsByClassName("cancel_button")[0];
    confirmButton.setAttribute("class","edit_button");
    confirmButton.setAttribute("onclick", "toggle_edit_row(this);");

    cancelButton.setAttribute("class","delete_button");
    cancelButton.setAttribute("onclick", "delete_student(this);");
}

function cancel_edit_row(button){
    let row = button.parentElement.parentElement;

    row.style.backgroundColor = row.getAttribute("data-previous-color");
    //row.removeAttribute("data-previous-color");

    for (let col_index = 0; col_index < row.children.length; col_index++ )
    {
        let cell = row.cells[col_index];
        if(cell.firstChild.tagName != "INPUT") continue;
        let input = cell.firstChild;
        input.setAttribute("value", input.getAttribute("data-previous"));
        input.removeAttribute("data-previous");
    }

    make_readonly_row(button);
    
    let confirmButton = row.getElementsByClassName("confirm_button")[0];
    let cancelButton = row.getElementsByClassName("cancel_button")[0];
    confirmButton.setAttribute("class","edit_button");
    confirmButton.setAttribute("onclick", "toggle_edit_row(this);");

    cancelButton.setAttribute("class","delete_button");
    cancelButton.setAttribute("onclick", "delete_student(this);");
}

function make_readonly_row(button){
    let row = button.parentElement.parentElement;
    for (let col_index = 0; col_index < row.children.length; col_index++ )
    {
        let cell = row.cells[col_index];
        if(cell.firstChild.tagName != "INPUT") continue;
        let input = cell.firstChild;
        input.setAttribute("readonly", "readonly");
    }
}

function make_readwrite_row(button){
    let row = button.parentElement.parentElement;
    for (let col_index = 0; col_index < row.children.length; col_index++ )
    {
        let cell = row.cells[col_index];
        if(cell.firstChild.tagName != "INPUT") continue;
        let input = cell.firstChild;
        input.removeAttribute("readonly");
    }
}

function save_changes() {
    deletedStudents = document.querySelectorAll('[data-changed-delete]');

    for(let i = 0; i < deletedStudents.length; i++)
    {
        console.log(deletedStudents[i]);
    }
    return;
}