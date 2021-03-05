const URLParams = new URLSearchParams(window.location.search);
const groupId = parseInt(URLParams.get('id'));
const groupPromise = new Promise(async (resolve, reject) => {
    let responseData = await getGroupFull(groupId);
    resolve(responseData.json);
});
const groupTitleElement = document.getElementById('group_title')

groupPromise.then((group) => {
    groupTitleElement.innerHTML = `${group.class.name} ${group.name}`;
    group.group_class_students.forEach((student) => {
        console.log(student);
    });
    hidePreloader();
})