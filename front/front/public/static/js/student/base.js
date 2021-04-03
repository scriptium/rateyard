const fullName = document.querySelector('#header_teacher_full_name');

function logoutButton(button) {
    disableButton(button);
    localStorage.removeItem('student_access_token');
    localStorage.removeItem('student_refresh_token');
    document.location.replace('login.php');
}

let myUserPromise = new Promise((resolve, reject) => {
    getMe().then((responseData) => {
        resolve(responseData.json);
    });
});

function createSubjectBoxElement(name, new_marks, subject_id) {
    let clonedSubjectElement = document.querySelector('#subject_box_template').content.children[0].cloneNode(true);
    clonedSubjectElement.setAttribute('href', `/student/subject.php?id=${subject_id}`)
    clonedSubjectElement.querySelector('.subject_name').textContent = name;
    clonedSubjectElement.querySelector('.new-marks > div').textContent = new_marks;
    return clonedSubjectElement;
}

myUserPromise.then(data => {
    fullName.innerHTML = data.full_name;
    data.subjects.forEach(subject => {
        for (let i=0; i<100; i++) {
            sidebarElement.appendChild(createSubjectBoxElement(subject.name, '12', subject.id));
        }
    });
});