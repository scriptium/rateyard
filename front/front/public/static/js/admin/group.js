let dataHasChecked = checkUserData(undefined, 'login.php');

let groupId = parseInt(document.getElementById("group_id").innerHTML);

getGroupFull(groupId).then(console.log);