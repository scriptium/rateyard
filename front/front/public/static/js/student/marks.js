const URLParams = new URLSearchParams(window.location.search);
const subjectId = parseInt(URLParams.get('id'));

const subjectsDiv = document.querySelector('#subjects');
const subjectHeader = document.querySelector('#marks-header');
const marksDiv = document.querySelector('#marks');

let subjectTag = (id, name) => ``;

let markTag = (title, date, mark, comment) => `
<div class="mark-container">
    <div class="mark-info">
        <div class="mark-title">${title}</div>
        <div class="mark-date">${(new Date(date)).toLocaleDateString()}</div>
    </div>
    <div class="mark_wrapper">
        <div class="mark" style="background-color: ${marksColor[mark]}"><div>${mark}</div></div>
    </div>
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

marksPromise.then(data => {
    console.log(data);
    data.forEach(mark => {
        let clonedMarkElement = document.querySelector('#mark_template').content.children[0].cloneNode(true);
        let markInfo = clonedMarkElement.querySelector('.mark_info');
        if (mark.type_of_work) {
            let name = document.createElement('div');
            name.textContent = mark.type_of_work
            markInfo.appendChild(name);
        }
        if (mark.date) {
            let date = document.createElement('div');
            date.textContent = (new Date(mark.date)).toLocaleDateString();
            markInfo.appendChild(date);
        }
        clonedMarkElement.querySelector('.mark > div').textContent = mark.points;
        marksDiv.appendChild(clonedMarkElement)
    });
});

