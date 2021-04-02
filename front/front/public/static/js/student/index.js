const contentElement = document.querySelector('#content');

myUserPromise.then(data => {
    console.table(data);
    fullName.innerHTML = data.full_name;
    data.subjects.forEach(subject => {
        for (let i=0; i<100; i++) {
            contentElement.appendChild(createSubjectBoxElement(subject.name, '12', subject.id));
        }
    });
});
