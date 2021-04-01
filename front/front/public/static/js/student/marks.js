const URLParams = new URLSearchParams(window.location.search);
const subjectId = parseInt(URLParams.get('id'));

const subjectsDiv = document.querySelector('#subjects');
const subjectHeader = document.querySelector('#marks-header');
const marksDiv = document.querySelector('#marks');

let subjectTag = (id, name) => `<a class='subject_box' href="subject.php?id=${id}">
                                    <span class='subject_name'>${name}</span>
                                    <div class="notification notification-subject">12</div>
                                </a>`;

let markTag = (title, date, mark, comment) => `<div class="mark-container">
                                                  <div class="mark-info">
                                                      <div class="mark-title">${title}</div>
                                                      <div class="mark-date">${(new Date(date)).toLocaleDateString()}</div>
                                                  </div>
                                                  <div class="mark" style="background-color: ${marksColor[mark]}">${mark}</div>
                                                  <div class="notification notification-mark"></div>
                                               </div>
                                               <div class="comment show">${comment}</div>`;
                                               
const marksColor = {
    '12': '#35DD64',
    '11': '#35DD64',
    '10': '#35DD64',

    '9': '#BEE550',
    '8': '#BEE550',
    '7': '#BEE550',

    '6': '#F1CF55',
    '5': '#F1CF55',
    '4': '#F1CF55',

    '3': '#E46464',
    '2': '#E46464',
    '1': '#E46464',

    'Н': '#5AADDD',
};

let marksPromise = new Promise(resolve => {
    getMarks(subjectId).then((responseData) => {
        resolve(responseData.json);
    });
});

myUserPromise.then(data => {
    fullName.innerHTML = data.full_name;
    data.subjects.forEach(subject => {
        subjectsDiv.innerHTML += subjectTag(subject.id, subject.name);
        if (subject.id === subjectId)
            subjectHeader.innerHTML = subject.name;
    });
});

marksPromise.then(data => {
    console.log(data);
    data.forEach(mark => {
        marksDiv.innerHTML += markTag(mark.type_of_work, mark.date, mark.points, mark.comment);
        
        
    });
});

