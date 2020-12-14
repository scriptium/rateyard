function add_student() {
    alert("hello");
    let table = document.getElementById("tbody");

    let tr = document.createElement("tr");

    table.appendChild(tr);

    let tds = new Array(4);
    for (i = 0; i < tds.length; i++) 
    {
        tr.appendChild(tds[i]);
        tds[i] = document.createElement("td");
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

    let fields = [username, full_name, email, password];

    for (i = 0; i < tds.length; i++) {
        tds[i].appendChild(fields[i]);
    }

}

function delete_student() {
    let table = document.getElementById("class_table");
    
}