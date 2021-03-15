let groupId = parseInt(document.getElementById("group_id").innerHTML);

let groupNameElement = document.querySelector('#name_input');
let groupName;
let groupClassIdElement = document.querySelector('#class_id');
let groupClassName;
let groupClassId;
let groupStudentsTbodyElement = document.querySelector('#group_students tbody')

let mainLecturersTbodyElement = document.querySelector('#lecturers_table tbody');

let changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'));


function makeNotFullGroupItemsHidden(name) {
    let notFullGroupItems = document.querySelectorAll('.not_full_group');
    notFullGroupItems.forEach(element => {
        element.parentElement.removeChild(element);
    });
    let fakeInputGroupName = document.querySelector('#name_fake_input');
    fakeInputGroupName.innerHTML = name;
    fakeInputGroupName.hidden = false;
    groupName = name;
}

function updateGroupData() {
    return new Promise((resolve) => {
        getGroupFull(groupId).then((responseData) => {
            let parsedGroup = responseData.json;
            
            console.log(parsedGroup)

            
            groupClassIdElement.innerHTML =
                `<div class=\"fake_readonly_input\"><a
            class=\"text\" 
            href=\"class.php?id=${parsedGroup.class.id}\">${parsedGroup.class.name}</a></div>`;
            
            groupClassId = parsedGroup.class.id;
            groupClassName = parsedGroup.class.name;
            groupStudentsTbodyElement.innerHTML = '';
            
            if(parsedGroup.is_full_class_group) {
                makeNotFullGroupItemsHidden(parsedGroup.name);
            }
            else {
                groupNameElement.value = parsedGroup.name;
                groupNameElement.setAttribute('initial_value', parsedGroup.name);
                groupNameElement.setAttribute('oninput', 'changesSet.updateChangedElements(this)');
                let fullGroupElements = document.querySelectorAll('.full_group');
                fullGroupElements.forEach(element => {
                    fullGroupElements.parentNode.removeChild(element);
                });
            }
            insertStudentsData(parsedGroup.group_class_students, groupStudentsTbodyElement, false, !parsedGroup.is_full_class_group, null);
            resolve();
        });
    });
}

async function saveGroupChanges(buttonElement) {
    disableButton(buttonElement);
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
        enableButton(buttonElement);
    }
    else if (responseData.status === 400) {
        if (responseData.json.includes(1)) makeInputTextWrong(groupNameElement);
        enableButton(buttonElement);
    }
}

let groupHasFilled = updateGroupData();

let lectureresHasFilled = new Promise(async (resolve, reject) => {
    getGroupFull(groupId).then((responseData) => {
        let parsedResponse = responseData.json;
        console.log(parsedResponse.group_lecturers);
        insertLecturersData(parsedResponse.group_lecturers, mainLecturersTbodyElement, null);
        resolve();
    }, reject)
});


function deleteGroupButton(buttonElement) {
    disableButton(buttonElement);
    let isConfirmed = confirm(`Видалити групу №${groupId}?`);
    if (isConfirmed) {
        deleteGroup(groupId).then(
            () => { window.history.back() },
            () => { buttonElement.classList.remove('disabled') }
        )
    }
    else enableButton(buttonElement);
}

function addNewLecturer(buttonElement) {
    disableButton(buttonElement);
    sessionStorage.setItem('class', JSON.stringify({id: groupClassId, name: groupClassName}))
    sessionStorage.setItem('group', JSON.stringify({id: groupId, name: groupName}));
    sessionStorage.setItem('teacher', JSON.stringify('false'));
    window.location = 'new_lecturer.php';
    enableButton(buttonElement);
}


let mainPromise = Promise.all([groupHasFilled, lectureresHasFilled]);
mainPromise.then(hidePreloader);