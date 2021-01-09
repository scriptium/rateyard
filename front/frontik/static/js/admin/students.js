function delete_student(delete_button) {
    let row = delete_button.parentNode.parentNode;
    row.remove();
}
function change_class(class_id) {
    let students_table_body = document.getElementById("students_table").children[0].children[1];
    alert(class_id.value);
}
