let groupseResponseData = getGroupsShort(true)
let hidableChildrenStudentsTbody;

let searchIndex = FlexSearch.create({
    encode: "icase",
    split: /\s+/,
    tokenize: "forward"
});

let groupsTableElement = document.getElementById('groups_table');
let mainTbodyElement = groupsTableElement.getElementsByTagName('tbody')[1];

function fillGroupsTable(groups) {
    groups.forEach(group => {
        let newRowElement = document.createElement('tr');

        let idElement = newRowElement.appendChild(document.createElement('td'));
        idElement.innerHTML = group.id;

        let nameElement = newRowElement.appendChild(document.createElement('td'));
        nameElement.innerHTML = `<a class=\"text\" href=\"group.php?id=${group.id}\">${group.name}</a>`;

        let classElement = newRowElement.appendChild(document.createElement('td'));
        classElement.innerHTML = `<a class=\"text\" href=\"class.php?id=${group.class.id}\">${group.class.name}</a>`;

        searchIndex.add(
            newRowElement,
            `${group.id} ${group.name} ${group.class.name}`
        );

        mainTbodyElement.appendChild(newRowElement);
    });

    groupsTableElement.classList.add('visible');
    hidableChildrenStudentsTbody = new HidableChildrenElement(mainTbodyElement);
}

function searchGroups(text) {
    let searchedTrs = searchIndex.search(text);

    if (text !== '') {
        hidableChildrenStudentsTbody.hideAll();
        searchedTrs.forEach(
            (tr) => {hidableChildrenStudentsTbody.show(tr);}
        );
    }
    else hidableChildrenStudentsTbody.showAll();

    hidableChildrenStudentsTbody.update();
}

groupseResponseData.then((responseData) => {
    fillGroupsTable(responseData.json);
    hidePreloader();
});