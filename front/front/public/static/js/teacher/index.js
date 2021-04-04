let contentElement = document.getElementById('content');

myUserPromise.then(myUser => {
    hidePreloader();
    for (let group of myUser.groups) {
        contentElement.appendChild(createGroupBoxElement(group));
    }
});