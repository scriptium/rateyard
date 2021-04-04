const contentElement = document.querySelector('#content');

myUserPromise.then(data => {
    console.table(data);
    fullName.innerHTML = data.full_name;
    data.subjects.forEach(subject => {
        contentElement.appendChild(createSubjectBoxElement(subject.name, '12', subject.id));
    });
});
