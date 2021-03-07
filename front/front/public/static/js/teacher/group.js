const URLParams = new URLSearchParams(window.location.search);
const groupId = parseInt(URLParams.get('id'));
const groupPromise = new Promise(async (resolve, reject) => {
    let responseData = await getGroupFull(groupId);
    resolve(responseData.json);
});
const groupTitleElement = document.getElementById('group_title');
const groupSubtitleElement = document.getElementById('group_subtitle');

groupPromise.then((group) => {
    groupTitleElement.innerHTML = `${group.group.class.name} ${group.group.name}`;
    groupSubtitleElement.innerHTML = group.subject.name;
    console.log(group);
    hidePreloader();
})