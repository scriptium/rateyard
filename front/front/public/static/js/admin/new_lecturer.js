let classBlock = document.querySelector('#class_block');
let classElement;
let groupBlock = document.querySelector('#group_block');
let groupElement;
let subjectSelectElement = document.querySelector('#subject_select');
let teacherBlock = document.querySelector('#teacher_block');
let teacherElement;

let classData = sessionStorage['class'];
let groupData = sessionStorage['group'];
let teacherData = sessionStorage['teacher'];


let subjectsHasFilled = new Promise(async (resolve, reject) => {
    getSubjects().then((responseData) => {
        fillDropDownSelect(subjectSelectElement, responseData.json);
        resolve();
    }, reject)
});

function fillTeachersData() {
    return new Promise(async (resolve, reject) => {
        getTeachers().then((responseData) => {
            let teachersData = [];
            responseData.json.forEach(teacher => {
            	teachersData.push({
            		'id': teacher.id,
            		'name': teacher.full_name
            	});
            });
            fillDropDownSelect(teacherElement, teachersData);
            resolve();
        }, reject)
    });
}

function fillGroupsData(classId) {
    return new Promise(async (resolve, reject) => {
        getGroupsShort(undefined, undefined, undefined, classId).then((responseData) => {
            fillDropDownSelect(groupElement, responseData.json);
            resolve();
        }, reject)
    });
}

function fillClassesData() {
    return new Promise(async (resolve, reject) => {
        getClassesShort().then((responseData) => {
            fillDropDownSelect(classElement, responseData.json);
            resolve();
        }, reject)
    });
}

async function updateGroups() {
    await fillGroupsData(parseInt(classElement.value));
}

async function fillSessionStorageData() {
    if(classData !== undefined) classData = JSON.parse(classData)
    else classData = 'false';
    if(groupData !== undefined) groupData = JSON.parse(groupData)
    else groupData = 'false';
    if(teacherData !== undefined) teacherData = JSON.parse(teacherData)
    else teacherData = 'false';

    if(classData !== 'false') {
        classElement = createFakeReadonlyInput('class_name', classData.name);
    }
    else {
        classElement = createDefaultSelect('class_select', 'updateGroups()');
        await fillClassesData();
    }

    if(groupData !== 'false') {
        groupElement = createFakeReadonlyInput('group_name', groupData.name);
    }
    else {
        groupElement = createDefaultSelect('group_select');
        if(classData !== 'false')
            await fillGroupsData(classData.id);
        else
            await fillGroupsData(parseInt(classElement.value));
    }

    if(teacherData !== 'false') {
        teacherElement = createFakeReadonlyInput('teacher_name', teacherData.name);
    }
    else {
        teacherElement = createDefaultSelect('teacher_select');
        await fillTeachersData();
    }

    classBlock.after(classElement);
    groupBlock.after(groupElement);
    teacherBlock.after(teacherElement);
}

function saveNewLecturerButton(buttonElement) {
	disableButton(buttonElement);
    
    let requestJSON = {
        subject_id: parseInt(subjectSelectElement.value)
    };

    if(groupData !== 'false') 
        requestJSON.group_id = parseInt(groupData.id);
    else
        requestJSON.group_id = parseInt(groupElement.value);

    if(teacherData !== 'false')
        requestJSON.teacher_id = parseInt(teacherData.id);
    else
        requestJSON.teacher_id = parseInt(teacherElement.value);

    createLecturer(requestJSON).then((responseData) => {
        if (responseData.status == 400) {
            let parsedResponseJSON = responseData.json;
            if (parsedResponseJSON.includes(3)) {
                makeDropDownSelectWrong(subjectSelectElement);
                if(classData === 'false')
                    makeDropDownSelectWrong(classElement);
                if(groupData === 'false') 
                    makeDropDownSelectWrong(groupElement);
                if(teacherData === 'false')
                    makeDropDownSelectWrong(teacherElement);
                
            }
            enableButton(buttonElement);
        }
        else if (responseData.status === 200) {
        	sessionStorage.clear();
            window.history.back();
        }
    });
}

let mainPromise = Promise.all([subjectsHasFilled]);
mainPromise.then(async () => {
	await fillSessionStorageData();
	hidePreloader();
});