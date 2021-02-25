let groupId = parseInt(document.getElementById("group_id").innerHTML);

let groupNameElement = document.getElementById('name');
let groupClassIdElement = document.getElementById('class_id');
let groupStudentsTbodyElement = document.querySelector('#group_students tbody')

let afterGroupElements = document.querySelectorAll('.appear_after_group');

let changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'));

function updateGroupData() {
    return new Promise((resolve) => {
        getGroupFull(groupId).then((responseData) => {
            let parsedGroup = responseData.json;
            console.log(parsedGroup)
            groupNameElement.value = parsedGroup.name;
            groupNameElement.setAttribute('initial_value', parsedGroup.name);
            groupNameElement.setAttribute('oninput', 'changesSet.updateChangedElements(this)');
            groupClassIdElement.innerHTML =
                `<div class=\"fake_readonly_input\"><a
            class=\"text\" 
            href=\"class.php?id=${parsedGroup.class.id}\">${parsedGroup.class.name}</a></div>`;

            afterGroupElements.forEach(
                (element) => {
                    element.classList.add('visible');
                }
            )

            groupStudentsTbodyElement.innerHTML = '';
            parsedGroup.group_class_students.forEach((student) => {
                let newTr = document.createElement('tr');

                let studentIdTd = document.createElement('td');
                studentIdTd.innerHTML = student.id;
                newTr.appendChild(studentIdTd);

                let studentFullNameTd = document.createElement('td');
                studentFullNameTd.innerHTML = `<a class=\"text\" href=\"student.php?id=${student.id}\">${student.full_name}</a>`;
                newTr.appendChild(studentFullNameTd);

                let studentUsernameTd = document.createElement('td');
                studentUsernameTd.innerHTML = student.username;
                newTr.appendChild(studentUsernameTd);

                let studentEmailTd = document.createElement('td');
                studentEmailTd.innerHTML = student.email;
                newTr.appendChild(studentEmailTd);

                let studentCheckboxTd = document.createElement('td');
                let checkboxElement = createCheckboxElement();
                if (student.is_group_member) {
                    checkboxElement.classList.add('checked');
                    checkboxElement.setAttribute('initial_value', true);
                }
                else {
                    checkboxElement.setAttribute('initial_value', false);
                }
                checkboxElement.setAttribute('onclick', 'changesSet.updateChangedElements(this)');
                studentCheckboxTd.appendChild(checkboxElement);

                newTr.appendChild(studentCheckboxTd);

                groupStudentsTbodyElement.appendChild(newTr);
                resolve();
            });
        });
    });
}

async function saveGroupChanges(buttonElement) {
    buttonElement.classList.add('disabled');
    let groupChanges = {id: groupId};
    if (changesSet.changedElements.has(groupNameElement))
        groupChanges.name = groupNameElement.value;
    let groupStudentsChanged = false;
    for (let changedElement of changesSet.changedElements.values()) {
        if (changedElement.parentNode.parentNode.parentNode === groupStudentsTbodyElement) {
            groupStudentsChanged = true;
            break;
        }
    }
    if (groupStudentsChanged) {
        groupChanges.students_ids = [];
        for (let studentTr of groupStudentsTbodyElement.children) {
            if (studentTr.children[4].children[0].classList.contains('checked'))
                groupChanges.students_ids.push(parseInt(studentTr.children[0].innerHTML));
        }
    }
    let responseData = await editGroup(groupChanges);
    if (responseData.status === 200) {
        await updateGroupData();
        changesSet.discardChanges();
        buttonElement.classList.remove('disabled');
    }
    else if (responseData.status === 400) {
        if (responseData.json.includes(1)) makeInputTextWrong(groupNameElement);
        buttonElement.classList.remove('disabled');
    }
}

let groupHasFilled = updateGroupData();

function deleteGroupButton(buttonElement) {
    buttonElement.classList.add('disabled');
    let isConfirmed = confirm(`Видалити групу №${groupId}?`);
    if (isConfirmed) {
        deleteGroup(groupId).then(
            () => { window.history.back() },
            () => { buttonElement.classList.remove('disabled') }
        )
    }
    else buttonElement.classList.remove('disabled');
}