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
                pattern += ` ${student.class.name}`;
            searchIndex.add(
                newRowElement,
                pattern
            )
        }
        mainTbodyElement.appendChild(newRowElement);
    });
}

function insertGroupsData(groupsData, mainTbodyElement, isClass = false, isSettings = false, searchIndex = null) {
    groupsData.forEach(group => {
        let newRowElement = document.createElement('tr');

        let groupIdElement = newRowElement.appendChild(document.createElement('td'));
        groupIdElement.innerHTML = group.id;

        let groupNameElement = newRowElement.appendChild(document.createElement('td'));
        groupNameElement.innerHTML = `<a class=\"text\" href=\"group.php?id=${group.id}\">${group.name}</a>`;

        if (isClass) {
            let groupClassElement = newRowElement.appendChild(document.createElement('td'));
            groupClassElement.innerHTML = `<a class=\"text\" href=\"class.php?id=${group.class.id}\">${group.class.name}</a>`;
        }

        if (isSettings) {
            let groupsSettingsElement = newRowElement.appendChild(document.createElement('td'));
            groupsSettingsElement.innerHTML = `<a class=\"text\" href=\"group.php?id=${group.id}\">Налаштування</a>`;
        }

        if (searchIndex) {
            pattern = `${group.id} ${group.name}`;
            if (isClass)
                pattern += ` ${group.id}`;
            searchIndex.add(
                newRowElement,
                `${group.id} ${group.class.name}`
            );
        }
        mainTbodyElement.appendChild(newRowElement);
    });
}

function insertLecturersData(lecturersData, mainTbodyElement, groupInfo = null) {
    lecturersData.forEach(lecturer => {
        let newRowElement = document.createElement('tr');

        let lecturerIdElement = newRowElement.appendChild(document.createElement('td'));
        lecturerIdElement.innerHTML = lecturer.id;

        let lecturerNameElement = newRowElement.appendChild(document.createElement('td'));
        lecturerNameElement.innerHTML = `<a class=\"text\" href=\"teacher.php?id=${lecturer.id}\">${lecturer.full_name}</a>`;

        let lecturerSubjectElement = newRowElement.appendChild(document.createElement('td'));
        lecturerSubjectElement.innerHTML = lecturer.subject.name;
        
        if (groupInfo) {
            let lecturerGroupElement = newRowElement.appendChild(document.createElement('td'));
            lecturerGroupElement.innerHTML = `<a class=\"text\" href=\"group.php?id=${groupInfo.id}\">${groupInfo.name}</a>`;
        }

        mainTbodyElement.appendChild(newRowElement);
    });
}
