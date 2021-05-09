const classTableTbodyElement = document.querySelector('#classes_table>tbody');
const classesPromise = getClassesShort(true);
const classesFilledPromise = new Promise(async resolve => {
    for (let class_ of (await classesPromise).json) {
        classTableTbodyElement.innerHTML +=
        `<tr><td>${class_.id}</td><td><a class=\"text\" href=\"class.php?id=${class_.id}\">${class_.name}</a></td></tr>`
    }
    resolve();
});
classesFilledPromise.then(hidePreloader);