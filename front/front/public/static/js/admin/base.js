function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_refresh_token');
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

function insertStudentsData(studentsData, mainTbodyElement, isClass = false, isCheckbox = false, searchIndex = null) {
    studentsData.forEach(student => {
        let newRowElement = document.createElement('tr');

        let idElement = newRowElement.appendChild(document.createElement('td'));
        idElement.innerHTML = student.id;

        let fullNameElement = newRowElement.appendChild(document.createElement('td'));
        fullNameElement.innerHTML = `<a class=\"text\" href=\"student.php?id=${student.id}\">${student.full_name}</a>`;

        if (isClass) {
            let classElement = newRowElement.appendChild(document.createElement('td'));
            classElement.innerHTML = `<a class=\"text\" href=\"class.php?id=${student.class.id}\">${student.class.name}</a>`;
        }
        
        let usernameElement = newRowElement.appendChild(document.createElement('td'));
        usernameElement.innerHTML = student.username;

        let emailElement = newRowElement.appendChild(document.createElement('td'));
        emailElement.innerHTML = student.email;

        if (isCheckbox) {
            let checkboxElement = newRowElement.appendChild(document.createElement('td'));
            let checkbox = createCheckboxElement();
            if (student.is_group_member) {
                checkbox.classList.add('checked');
                checkbox.setAttribute('initial_value', true);
            }
            else {
                checkbox.setAttribute('initial_value', false);
            }
            checkbox.setAttribute('onclick', 'changesSet.updateChangedElements(this)');
            checkboxElement.appendChild(checkbox);
        }

        if(searchIndex) {
            pattern = `${student.id} ${student.username} ${student.full_name} ${student.email}`;
            if (isClass) 
                pattern += `${student.class.name}`;
            searchIndex.add(
                newRowElement,
                pattern
            )
        }
        mainTbodyElement.appendChild(newRowElement);
    });
    // syntax error: net takogo vyrasheniya drochit huy!!!
}