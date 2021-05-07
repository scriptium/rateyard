const subjectsPromise = getSubjects();
const subjectsTableTbodyElement = document.querySelector('#subjects_table>tbody');
const subjectsFilledPromise = new Promise(async resolve => {
    for (let subject of (await subjectsPromise).json) {
        subjectsTableTbodyElement.innerHTML += 
        `<tr><td>${subject.id}</td><td><a class="text" href="subject.php?id=${subject.id}">${subject.name}</a></td></tr>`
    }
    resolve();
});
subjectsFilledPromise.then(() => {
    hidePreloader();
})