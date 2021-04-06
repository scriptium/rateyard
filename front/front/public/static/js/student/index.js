const contentElement = document.querySelector('#content');

myUserPromise.then(data => {
    console.table(data);
    fullName.innerHTML = data.full_name;
    data.subjects.forEach(subject => {
        contentElement.appendChild(createSubjectBoxElement(subject.name, subject.new_marks, subject.id));
    });
    hidePreloader();
});
