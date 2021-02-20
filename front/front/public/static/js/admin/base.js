function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('api_access_token');
    localStorage.removeItem('api_refresh_token');
    document.location.replace('login.php')
}

function fillClassesSelect(dropdowmElement, classes) {
    classes.forEach(_class => {
        let newOptionElement = document.createElement('option');
        newOptionElement.value = _class.id;
        newOptionElement.innerHTML = _class.name;
        dropdowmElement.appendChild(newOptionElement);
    });
}