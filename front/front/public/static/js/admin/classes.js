let classesResponseData = getClassesShort(true)

function fillClassesTable(classes) {
    let classesTableElement = document.getElementById('classes_table');
    let mainTbodyEleemnt = classesTableElement.getElementsByTagName('tbody')[1];
    
    classes.forEach(thisClass => {
        newRowElement = document.createElement('tr');

        let nameElement = newRowElement.appendChild(document.createElement('td'));
        nameElement.innerHTML = `<a class=\"text\" href=\"class.php?id=${thisClass.id}\">${thisClass.name}</a>`;

        mainTbodyEleemnt.appendChild(newRowElement);
    });

    classesTableElement.classList.add('visible');
}

classesResponseData.then((responseData) => {
    fillClassesTable(responseData.json);
    hidePreloader();
});