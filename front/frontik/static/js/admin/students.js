function delete_student(delete_button) {
    let row = delete_button.parentNode.parentNode;

    row.setAttribute("data-previous-color", row.style.backgroundColor);
    row.style.backgroundColor = 'Red';

    row.setAttribute("data-delete", "true");
    row.setAttribute("data-edit", "false");
    delete_button.setAttribute("onclick", "undo_delete_student(this);");

    let editButton = row.getElementsByClassName("edit_button")[0];
    editButton.style.visibility = 'hidden';
    
}

function undo_delete_student(delete_button){
    let row = delete_button.parentNode.parentNode;
    row.removeAttribute("data-delete", "false");
    if(row.hasAttribute("data-edit"))
        row.setAttribute("data-edit", "true");
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
    cancelButton.setAttribute("onclick", "delete_student(this);");
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
    cancelButton.setAttribute("onclick", "delete_student(this);");
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

function save_changes() {
    let students_to_delete = document.querySelectorAll('[data-delete="true"]');
    let students_to_edit = document.querySelectorAll('[data-edit="true"]');
    let students_to_delete_json = [];
    let students_to_edit_json = [];
    for(let student_index = 0; student_index < students_to_delete.length; student_index++) {
        students_to_delete_json.push(students_to_delete[student_index].getAttribute("value"));
    }
    for(let student_index = 0; student_index < students_to_edit.length; student_index++) {
        students_to_edit_json.push({
            "id": students_to_edit[student_index].getAttribute("value"),
            "username": students_to_edit[student_index].cells[0].firstChild.value,
            "full_name": students_to_edit[student_index].cells[1].firstChild.value,
            "email": students_to_edit[student_index].cells[2].firstChild.value,
            "class_id": students_to_edit[student_index].cells[3].firstChild[students_to_edit[student_index].cells[3].firstChild.selectedIndex].value
        });
    }
    request_json = {
        "students_to_delete": students_to_delete_json,
        "students_to_edit": students_to_edit_json
    };
    let client = new XMLHttpRequest();
    client.open("POST", "http://127.0.0.1:5000/admin/students/save_changes");
    client.setRequestHeader("Content-Type", "application/json");
    client.onreadystatechange = function() {
        if (this.status==200)
        {
            location.reload(true);
        }
        else {
            
            document.body.innerHTML = "Something went wrong...\n" + this.responseText;
        }
    }
    client.send(JSON.stringify(request_json));
}
