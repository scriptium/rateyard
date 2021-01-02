function add_student() {
    let table = document.getElementById("class_table_body");

    let tr = document.createElement("tr");

    table.appendChild(tr);

    let tds = new Array(5);
    for (i = 0; i < tds.length; i++) {
        tds[i] = document.createElement("td");
        tr.appendChild(tds[i]);
    }

    let username = document.createElement("input");
    username.setAttribute("id", "username");
    username.setAttribute("name", "username");
    username.setAttribute("placeholder", "Student username");

    let full_name = document.createElement("input");
    full_name.setAttribute("id", "full_name");
    full_name.setAttribute("name", "full_name");
    full_name.setAttribute("placeholder", "Student full name");

    let email = document.createElement("input");
    email.setAttribute("id", "email");
    email.setAttribute("name", "email");
    email.setAttribute("placeholder", "Student email");

    let password = document.createElement("input");
    password.setAttribute("id", "password");
    password.setAttribute("name", "password");
    password.setAttribute("placeholder", "Student password");

    let delete_button = document.createElement("input");
    delete_button.setAttribute("type", "button");
    delete_button.setAttribute("value", "-");
    delete_button.setAttribute("onclick", "delete_student(this)");

    let fields = [username, full_name, email, password, delete_button];

    for (i = 0; i < tds.length; i++) {
        tds[i].appendChild(fields[i]);
    }
    table.scrollTop = table.scrollHeight;
}

