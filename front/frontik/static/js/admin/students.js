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
