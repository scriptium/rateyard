function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('teacher_access_token');
    localStorage.removeItem('teacher_refresh_token');
    document.location.replace('login.php')
}

let myUserPromise = new Promise((resolve, reject) => {
    getMe().then((responseData) => {
        resolve(responseData.json)
    })
});

let sidebarElement = document.getElementById('sidebar');
let groupBoxTemplateElement = document.getElementById('group_box_template');

myUserPromise.then((myUser) => {
    document.getElementById('header_teacher_full_name').innerHTML = myUser.full_name;
    myUser.groups.forEach(group => {
        let groupBoxElement = groupBoxTemplateElement.content.cloneNode(true);

        groupBoxElement.children[0].children[0].children[0].innerHTML = group.class.name;
        groupBoxElement.children[0].children[0].children[1].innerHTML = group.name;
        groupBoxElement.children[0].children[1].innerHTML = group.subject.name;
        sidebarElement.appendChild(groupBoxElement);
    });
});