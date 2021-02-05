function fillGroupsTable(responseText) {
    parsedResponse = JSON.parse(responseText);
    groupsTableElement = document.getElementById('groups_table');
    mainTbodyEleemnt = groupsTableElement.getElementsByTagName('tbody')[1];
    
    parsedResponse.forEach(group => {
        newRowElement = document.createElement('tr');

        let idElement = newRowElement.appendChild(document.createElement('td'));
        idElement.innerHTML = group.id;

        let nameElement = newRowElement.appendChild(document.createElement('td'));
        nameElement.innerHTML = `<a href=\"/group.php?id=${group.id}\">${group.name}</a>`;

        let classElement = newRowElement.appendChild(document.createElement('td'));
        classElement.innerHTML = `<a href=\"/class.php?id=${group.class.id}\">${group.class.name}</a>`;

        mainTbodyEleemnt.appendChild(newRowElement);
    });

}

window.onload = () => {
    getGroups().then((responseData) => {
        fillGroupsTable(responseData.text)
    });
}