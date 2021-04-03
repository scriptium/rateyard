let groupsResponseData = getGroupsShort(true, undefined, undefined, undefined)
let hidableChildrenStudentsTbody;

let searchIndex = FlexSearch.create({
    encode: "icase",
    split: /\s+/,
    tokenize: "forward"
});

let groupsTableElement = document.getElementById('groups_table');
let mainTbodyElement = groupsTableElement.getElementsByTagName('tbody')[1];

function fillGroupsTable(groups) {
    insertGroupsData(groups, mainTbodyElement, true, false, false, searchIndex);
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

groupsResponseData.then((responseData) => {
    fillGroupsTable(responseData.json);
    hidePreloader();
});