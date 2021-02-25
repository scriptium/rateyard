let groupseResponseData = getGroupsShort(true)

function fillGroupsTable(groups) {
    let groupsTableElement = document.getElementById('groups_table');
    let mainTbodyEleemnt = groupsTableElement.getElementsByTagName('tbody')[1];
    
    groups.forEach(group => {
        newRowElement = document.createElement('tr');

        let idElement = newRowElement.appendChild(document.createElement('td'));
        idElement.innerHTML = group.id;

        let nameElement = newRowElement.appendChild(document.createElement('td'));
        nameElement.innerHTML = `<a class=\"text\" href=\"group.php?id=${group.id}\">${group.name}</a>`;

        let classElement = newRowElement.appendChild(document.createElement('td'));
        classElement.innerHTML = `<a class=\"text\" href=\"class.php?id=${group.class.id}\">${group.class.name}</a>`;

        mainTbodyEleemnt.appendChild(newRowElement);
    });

    groupsTableElement.classList.add('visible');
}

window.onload = async () => {   
    groupseResponseData.then((responseData) => {
        fillGroupsTable(responseData.json)
    });
}