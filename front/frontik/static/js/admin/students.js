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
        input.setAttribute("data-previous", input.value);
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

        if ( input.getAttribute("data-previous") != input.value ) 
        {
            difference = true;
        }
        input.removeAttribute("data-previous");
        
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
        input.value = input.getAttribute("data-previous");
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
    let studentsToDelete = document.querySelectorAll('[data-changed-delete]');

    
    let studentsToDeleteIds = [];
    for(let i = 0; i < studentsToDelete.length; i++)
    {
        studentsToDeleteIds.push(studentsToDelete[i].getAttribute("value"));

        // studentsToDeleteIds[ deletedStudents[i].getAttribute("value") ] = ({"username" : deletedStudents[i].children[0].firstChild.value, "full_name" : deletedStudents[i].children[1].firstChild.value,
        // "email" : deletedStudents[i].children[2].firstChild.value, "class" : deletedStudents[i].children[3].firstChild.value});
    }

    console.log(studentsToDeleteIds);
    requestJSON = { studentsToDeleteIds: studentsToDeleteIds};

    let client = new XMLHttpRequest();
    client.open("POST", "http://localhost:5000/admin/students/save_changes");
    client.setRequestHeader("Content-Type", "application/json");
    client.onreadystatechange = function() {
        if (this.status==200)
        {
            document.location.reload();
        }
        else {
            document.body.innerHTML = "Something wents wrong...";
        }
    }
    client.send(JSON.stringify(requestJSON));

    // let changedStudents = document.querySelectorAll('[data-changed]');

    // for(let i = 0; i < changedStudents.length; i++)
    // {

    // }
}