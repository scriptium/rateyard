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

let groupBoxTemplateElement = document.getElementById('group_box_template');

function createGroupBoxElement(group) {
    let groupBoxElement = groupBoxTemplateElement.content.cloneNode(true);
    groupBoxElement.children[0].setAttribute('href', `group.php?id=${group.id}&subject_id=${group.subject.id}`);
    groupBoxElement.children[0].children[0].children[0].innerHTML = group.class.name;
    groupBoxElement.children[0].children[0].children[1].innerHTML = group.name;
    groupBoxElement.children[0].children[1].innerHTML = group.subject.name;
    return groupBoxElement;
}

let groupsFilled = new Promise(async resolve => {
    let myUser = await myUserPromise;
    document.getElementById('header_teacher_full_name').textContent = myUser.full_name;
    for (let group of myUser.groups) {
        sidebarElement.appendChild(createGroupBoxElement(group));
    }
    resolve();
});