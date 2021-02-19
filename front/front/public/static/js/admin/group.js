let dataHasChecked = checkUserData(undefined, 'login.php');

let groupId = parseInt(document.getElementById("group_id").innerHTML);

let groupNameElement = document.getElementById('name');
let groupClassIdElement = document.getElementById('class_id');
let groupStudentsTbodyElement = document.querySelector('#group_students tbody')

let classesHasFilled = new Promise(async (resolve, reject) => {
    await dataHasChecked;
    getClassesShort().then((responseData) => {
        fillClassesSelect(groupClassIdElement, JSON.parse(responseData.text));
        resolve();
    }, reject)
});

let afterGroupElements = document.querySelectorAll('.appear_after_group');

async function updateGroupData() {
    await classesHasFilled;
    getGroupFull(groupId).then((responseData) => {
        let parsedGroup = JSON.parse(responseData.text);
        console.log(parsedGroup)
        groupNameElement.value = parsedGroup.name;
        groupClassIdElement.value = parsedGroup.class.id;

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
            studentFullNameTd.innerHTML = student.full_name;
            newTr.appendChild(studentFullNameTd);

            let studentUsernameTd = document.createElement('td');
            studentUsernameTd.innerHTML = student.username;
            newTr.appendChild(studentUsernameTd);

            let studentEmailTd = document.createElement('td');
            studentEmailTd.innerHTML = student.email;
            newTr.appendChild(studentEmailTd);

            let studentCheckboxTd = document.createElement('td');
            studentCheckboxTd.appendChild(createCheckboxElement());
            if (student.is_group_member) studentCheckboxTd.children[0].classList.add('checked');
            newTr.appendChild(studentCheckboxTd);


            groupStudentsTbodyElement.appendChild(newTr);
        });
    });
}

let groupHasFilled = updateGroupData();