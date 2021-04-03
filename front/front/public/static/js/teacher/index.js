let contentElement = document.getElementById('content');

myUserPromise.then((myUser) => {
    myUser.groups.forEach(group => {
        let groupBoxElement = groupBoxTemplateElement.content.cloneNode(true);

        groupBoxElement.children[0].setAttribute('href', `group.php?id=${group.id}&subject_id=${group.subject.id}`);
        groupBoxElement.children[0].children[0].children[0].innerHTML = group.class.name;
        groupBoxElement.children[0].children[0].children[1].innerHTML = group.name;
        groupBoxElement.children[0].children[1].innerHTML = group.subject.name;
        contentElement.appendChild(groupBoxElement);
    });
    hidePreloader();
});