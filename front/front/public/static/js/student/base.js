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
    if (new_marks > 0) {
        let newMarksElement = clonedSubjectElement.querySelector('.new-marks');
        newMarksElement.classList.add('visible');
        newMarksElement.children[0].textContent = new_marks;
    }
    return clonedSubjectElement;
}

const subjectsFilled = new Promise(async (resolve) => {
    let data = await myUserPromise;
    fullName.innerHTML = data.full_name;
    data.subjects.forEach(subject => {
        let subjectBoxElement = createSubjectBoxElement(subject.name, subject.new_marks, subject.id);
        if (window.location.pathname + window.location.search == subjectBoxElement.getAttribute('href')) {
            subjectBoxElement.classList.add('current');
        }
        sidebarElement.appendChild(subjectBoxElement);
    });
    resolve();
})
