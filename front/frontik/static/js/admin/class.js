function add_student_to_table(add_button) {
    let students_table = document.getElementById("students_table");

    let tr = document.createElement("tr");

    students_table.children[1].appendChild(tr);

    let tds = new Array(5);
    for (i = 0; i < tds.length; i++) {
        tds[i] = document.createElement("td");
        tr.appendChild(tds[i]);
    }

    let username = document.createElement("input");
    username.setAttribute("name", "username");
    username.setAttribute("class", "input_text_table");
    username.setAttribute("placeholder", "Student username");
    username.setAttribute("autocomplete", "off");

    let full_name = document.createElement("input");
    full_name.setAttribute("name", "full_name");
    full_name.setAttribute("class", "input_text_table");
    full_name.setAttribute("placeholder", "Student full name");
    full_name.setAttribute("autocomplete", "off");

    let email = document.createElement("input");
    email.setAttribute("name", "email");
    email.setAttribute("class", "input_text_table");
    email.setAttribute("placeholder", "Student email");
    email.setAttribute("autocomplete", "off");

    let password = document.createElement("input");
    password.setAttribute("name", "password");
    password.setAttribute("class", "input_text_table");
    password.setAttribute("placeholder", "Student password");
    password.setAttribute("autocomplete", "off");

    let delete_button = document.createElement("button");
    delete_button.setAttribute("type", "button");
    delete_button.setAttribute("class", "delete_button");
    delete_button.setAttribute("onclick", "delete_student(this)");

    let fields = [username, full_name, email, password, delete_button];

    for (i = 0; i < tds.length; i++) {
        tds[i].appendChild(fields[i]);
    }
    students_table.scrollTop = students_table.scrollHeight;
}

function delete_student(delete_button) {
    row = delete_button.parentNode.parentNode;
    row.remove();
} 