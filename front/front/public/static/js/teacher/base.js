function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('teacher_access_token');
    localStorage.removeItem('teacher_refresh_token');
    document.location.replace('login.php')
}

let sidebarElement = document.getElementById('sidebar');
let sidebarCloseAreaElement = document.getElementById('sidebar_close_area');

function openSidebar() {
    sidebarElement.classList.add('opened');
    sidebarCloseAreaElement.classList.add('opened');
}

function closeSidebar() {
    sidebarElement.classList.remove('opened');
    sidebarCloseAreaElement.classList.remove('opened');
}

let myUserPromise = new Promise((resolve, reject) => {
    getMe().then((responseData) => {
        resolve(responseData.json)
    })
});

let groupBoxTemplateElement = document.getElementById('group_box_template');

myUserPromise.then((myUser) => {
    document.getElementById('header_teacher_full_name').innerHTML = myUser.full_name;
    myUser.groups.forEach(group => {
        let groupBoxElement = groupBoxTemplateElement.content.cloneNode(true).children[0];
        groupBoxElement.setAttribute('href', `/teacher/group.php?id=${group.id}`);
        if (window.location.pathname + window.location.search === groupBoxElement.getAttribute('href')) {
            groupBoxElement.classList.add('current');
        }
        groupBoxElement.children[0].children[0].innerHTML = group.class.name;
        groupBoxElement.children[0].children[1].innerHTML = group.name;
        groupBoxElement.children[1].innerHTML = group.subject.name;
        sidebarElement.appendChild(groupBoxElement);
    });
});