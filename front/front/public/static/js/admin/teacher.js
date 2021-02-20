let dataHasChecked = checkUserData(undefined, 'login.php');

let teacherId = parseInt(document.getElementById("teacher_id").innerHTML);

let usernameElement = document.getElementById('username');
let fullNameElement = document.getElementById('full_name');
let passwordElement = document.getElementById('password');
let emailElement = document.getElementById('email');

function updateTeacherData() {
    return new Promise(async (resolve, reject) => {
        await dataHasChecked;
        getTeachers([teacherId]).then(async (responseData) => {
            let teacher = JSON.parse(responseData.text)[0]
            usernameElement.value = teacher.username;
            usernameElement.setAttribute('initial_value', teacher.username);
            fullNameElement.value = teacher.full_name;
            fullNameElement.setAttribute('initial_value', teacher.full_name);
            emailElement.value = teacher.email;
            emailElement.setAttribute('initial_value', teacher.email);
            resolve();  
        }, reject)
    });
}

let teacherHasFilled = updateTeacherData();

window.onload = async () => {
    await teacherHasFilled;
    document.getElementById('load_data').classList.add('visible');
}