let dataHasChecked = checkUserData(undefined, 'login.php');

let groupId = parseInt(document.getElementById("group_id").innerHTML);

let groupNameElement = document.getElementById('name');
let groupClassIdElement = document.getElementById('class_id');
let groupStudentsTbodyElement = document.querySelector('#group_students tbody')

let afterGroupElements = document.querySelectorAll('.appear_after_group');

// let changedElements = new Set();
// let appearOnChangeElements = document.querySelectorAll('.appear_on_change');

// function updateChangedElements(element){
//     let elementHasInitialValue = false;
//     let elementInitialValue = element.getAttribute('initial_value');
//     if (element.classList.contains('checkbox'))
//     {
//         element.classList.toggle('checked');
//         if (element.classList.contains('checked') === (elementInitialValue === 'true'))
//             elementHasInitialValue = true;
//     }
//     else if (element.value === elementInitialValue)
//         elementHasInitialValue = true;

//     if (elementHasInitialValue) changedElements.delete(element)
//     else changedElements.add(element);

//     console.log(elementHasInitialValue);

//     if (changedElements.size > 0)
//         appearOnChangeElements.forEach((element) => {
//             element.classList.add('visible');
//         });
//     else
//         appearOnChangeElements.forEach((element) => {
//             element.classList.remove('visible');
//         });
// }

function updateGroupStudents(){

}

async function updateGroupData() {
    await dataHasChecked;
    getGroupFull(groupId).then((responseData) => {
        let parsedGroup = JSON.parse(responseData.text);
        console.log(parsedGroup)
        groupNameElement.value = parsedGroup.name;
        groupNameElement.setAttribute('initial_value', parsedGroup.name);
        groupNameElement.setAttribute('oninput', 'updateChangedElements(this)');
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
            checkboxElement.setAttribute('onclick', 'updateChangedElements(this)');
            studentCheckboxTd.appendChild(checkboxElement);

            newTr.appendChild(studentCheckboxTd);

            groupStudentsTbodyElement.appendChild(newTr);
        });
    });
}

let groupHasFilled = updateGroupData();