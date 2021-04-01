const main = document.querySelector('#content');

let subjectTag = (id, name) => `<a class="subject_box" href="subject.php?id=${id}">
                                    <span>${name}</span>
                                </a>`;

myUserPromise.then(data => {
    console.table(data);
    fullName.innerHTML = data.full_name;
    data.subjects.forEach(subject => {
        main.innerHTML += subjectTag(subject.id, subject.name);
    });
});
