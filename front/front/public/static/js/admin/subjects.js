let subjects = getSubjects();

let getAllData = Promise.all([subjects]);

let table = document.getElementById('subjects_table');
let mainTbodyElement = table.getElementsByTagName('tbody')[0];

function fillSubjectsTable(data) {
    data.forEach(subject => {
        let newRowElement = document.createElement('tr');

        let subjectIdElement = newRowElement.appendChild(document.createElement('td'));
        subjectIdElement.innerHTML = subject.id;

        let subjectNameElement = newRowElement.appendChild(document.createElement('td'));
        subjectNameElement.innerHTML = `<a class=\"text\" href=\"subject.php?id=${subject.id}\">${subject.name}</a>`;

        let iconsElement = newRowElement.appendChild(document.createElement('td'));
        iconsElement.classList.add('td_icons');
        iconsElement.innerHTML = `<div class='edit_td'></div><div class='delete_td'></div>`;

        mainTbodyElement.appendChild(newRowElement);
    });

    table.classList.add('visible');
}

window.onload = async() => {
    getAllData.then(values => {
        // console.log(values);
        fillSubjectsTable(values[0].json);
        hidePreloader();
    });
}