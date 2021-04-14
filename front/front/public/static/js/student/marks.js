const contentElement = document.querySelector('#content');

const subjectsMoved = new Promise(async resolve => {
    await subjectsFilled;
    if (window.screen.width >= 800) {
        sidebarElement.setAttribute('id', 'subjects');
        sidebarElement.querySelector('#sidebar_close_wrapper').remove();
        contentElement.insertBefore(sidebarElement, contentElement.firstChild);
    }
    let scrollTop = sessionStorage.getItem('student_subjects_scroll_top');
    if (scrollTop) sidebarElement.scrollTop = scrollTop;
    resolve(sidebarElement);
});

const URLParams = new URLSearchParams(window.location.search);
const subjectId = parseInt(URLParams.get('id'));

const subjectHeader = document.querySelector('#marks-header');
const marksDiv = document.querySelector('#marks');

const marksClasses = {
    '12': 'best',
    '11': 'best',
    '10': 'best',

    '9': 'good',
    '8': 'good',
    '7': 'good',

    '6': 'bad',
    '5': 'bad',
    '4': 'bad',

    '3': 'worst',
    '2': 'worst',
    '1': 'worst',
};

const unreadMarksElements = new Set();

let marksFilled = new Promise(async resolve => {
    let responseData = await getSubject(subjectId);
    document.querySelector('#marks-header').textContent = responseData.json.name;
    responseData.json.marks.sort(
        (mark1, mark2) => {
            let date1 = mark1.date;
            if (!date1) date1 = mark1.column_creation_date;
            let date2 = mark2.date;
            if (!date2) date2 = mark2.column_creation_date;
            return date2 - date1;
        }
    )
    for (let mark of responseData.json.marks) {
        let clonedMarkElement = document.querySelector('#mark_template').content.children[0].cloneNode(true);
        let markInfo = clonedMarkElement.querySelector('.mark_info');
        if (mark.type_of_work) {
            let name = document.createElement('div');
            name.textContent = mark.type_of_work
            markInfo.appendChild(name);
        }
        if (mark.date) {
            let date = document.createElement('div');
            date.textContent = (new Date(mark.date * 1000)).toLocaleDateString();
            markInfo.appendChild(date);
        }
        if (mark.comment.length > 0) {
            let commentElement = clonedMarkElement.querySelector('.comment_part');
            commentElement.textContent = mark.comment;
            commentElement.classList.add('visible');
        }
        if (!mark.is_read) {
            clonedMarkElement.querySelector('.new_mark_mark').classList.add('visible')
            clonedMarkElement.setAttribute('mark_id', mark.id);
            unreadMarksElements.add(clonedMarkElement);
        }
        let markCircleElement = clonedMarkElement.querySelector('.mark');
        let markElement = clonedMarkElement.querySelector('.mark > div');
        if (mark.points < 0) {
            markElement.textContent = 'Н';
        }
        else {
            markCircleElement.classList.add(marksClasses[mark.points]);
            markElement.textContent = mark.points;
        }
        marksDiv.appendChild(clonedMarkElement)
    }
    resolve();
});

subjectsMoved.then((subjectsDiv) => {
    subjectsDiv.onscroll = event => {
        sessionStorage.setItem('student_subjects_scroll_top', event.target.scrollTop);
    }
});

const readMarksElements = new Set();
let readMarksAreUpdating = false;
async function updateReadMarks() {
    if (!readMarksAreUpdating) {
        readMarksAreUpdating = true;
        for (let markElement of unreadMarksElements) {
            let rect = markElement.getBoundingClientRect();
            if (rect.bottom <= window.innerHeight) {
                readMarksElements.add(markElement);
                unreadMarksElements.delete(markElement);
            }
        }
        let ids = []
        for (let markElement of readMarksElements) {
            ids.push(parseInt(markElement.getAttribute('mark_id')))
        }
        if (ids.length > 0) await readMarks(ids);
        readMarksElements.clear();
        readMarksAreUpdating = false;
    }
}

const marksWrapprerElement = document.querySelector('#marks_wrapper');

marksWrapprerElement.onscroll = updateReadMarks;

Promise.all([marksFilled, subjectsMoved]).then(() => {
    hidePreloader();
    updateReadMarks();
});