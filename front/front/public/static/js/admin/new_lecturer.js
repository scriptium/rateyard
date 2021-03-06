let classNameElement = document.querySelector('#class_name');
let groupNameElement = document.querySelector('#group_name');
let subjectSelectElement = document.querySelector('#subject_select');
let teacherSelectElement = document.querySelector('#teacher_select');

let groupId = sessionStorage["group_id"];
let groupName = sessionStorage["group_name"];
let className = sessionStorage["class_name"];

let subjectsHasFilled = new Promise(async (resolve, reject) => {
    getSubjects().then((responseData) => {
        fillDropDownSelect(subjectSelectElement, responseData.json);
        resolve();
    }, reject)
});

let teachersHasFilled = new Promise(async (resolve, reject) => {
    getTeachers().then((responseData) => {
        let teachersData = [];
        responseData.json.forEach(teacher => {
        	teachersData.push({
        		"id": teacher.id,
        		"name": teacher.full_name
        	});
        });
        fillDropDownSelect(teacherSelectElement, teachersData);
        resolve();
    }, reject)
});

async function fillSessionStorageData() {
	if (typeof parseInt(groupId) !== "number" ||
			parseInt(groupId) != groupId ||
			typeof groupName !== "string" ||
			typeof className !== "string") {
		window.history.back();
	}
	else { 
		classNameElement.innerHTML = className;
		groupNameElement.innerHTML = groupName;
	}
}

function saveNewLecturerButton(buttonElement) {
	disableButton(buttonElement);
    
    let requestJSON = {
        teacher_id: parseInt(teacherSelectElement.value),
        group_id: parseInt(groupId),
        subject_id: parseInt(subjectSelectElement.value)
    };

    createLecturer(requestJSON).then((responseData) => {
        if (responseData.status == 400) {
            let parsedResponseJSON = responseData.json;
            console.log(parsedResponseJSON);
            if (parsedResponseJSON.includes(3)) {
            	makeDropDownSelectWrong(teacherSelectElement);
            	makeDropDownSelectWrong(subjectSelectElement);
            }
            enableButton(buttonElement);
        }
        else if (responseData.status === 200) {
        	sessionStorage.clear();
            window.history.back();
        }
    });
}

let mainPromise = Promise.all([subjectsHasFilled, teachersHasFilled]);
mainPromise.then(() => {
	fillSessionStorageData();
	hidePreloader();
});