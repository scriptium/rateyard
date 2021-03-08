const URLParams = new URLSearchParams(window.location.search);
const groupId = parseInt(URLParams.get('id'));
const groupPromise = new Promise(async (resolve, reject) => {
    let responseData = await getGroupFull(groupId);
    resolve(responseData.json);
});
const groupTitleElement = document.getElementById('group_title');
const groupSubtitleElement = document.getElementById('group_subtitle'); 
const marksTableElement = document.getElementById('marks_table');
const marksTableBodyElement = marksTableElement.getElementsByTagName('tbody')[0]; 
const marksTableHeadElement = marksTableElement.getElementsByTagName('thead')[0]; 
const toolsElement = document.getElementById('tools');

groupPromise.then((group) => {
    groupTitleElement.innerHTML = `${group.group.class.name} ${group.group.name}`;
    groupSubtitleElement.innerHTML = group.subject.name;
    console.log(group);
    
    for (let i=0; i<10; i++){
        group.group.students.forEach((student) => {
            let newCellElement = document.createElement('td');
            newCellElement.innerHTML = student.full_name;
            let newRowElement = document.createElement('tr');
            console.log(marksTableBodyElement);
            newRowElement.appendChild(newCellElement);
            for (let i=0; i<100; i++) {
                let newCellElement = document.createElement('td');
                newCellElement.innerHTML = 11;
                newRowElement.appendChild(newCellElement);
            }
            marksTableBodyElement.appendChild(newRowElement);
        });
    }
    for (let i=0; i<100; i++) {
        let date = document.createElement('th')
        date.innerHTML = i
        marksTableHeadElement.children[0].appendChild(date)
    }
    hidePreloader();
});