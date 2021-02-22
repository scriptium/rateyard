let groupId = parseInt(document.getElementById("group_id").innerHTML);

let groupNameElement = document.getElementById('name');
let groupClassIdElement = document.getElementById('class_id');
let groupStudentsTbodyElement = document.querySelector('#group_students tbody')

let afterGroupElements = document.querySelectorAll('.appear_after_group');

let changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'));

async function updateGroupData() {
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
            if (student.is_group_member)
            {
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
        });
    });
}

function saveGroupChanges(buttonElement) {
    
}

let groupHasFilled = updateGroupData();