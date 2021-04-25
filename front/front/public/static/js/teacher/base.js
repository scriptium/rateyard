let lockTimeout;

function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('teacher_access_token');
    localStorage.removeItem('teacher_refresh_token');
    document.location.replace('login.php')
}

let myUserPromise = new Promise((resolve, reject) => {
    getMe().then((responseData) => {
        resolve(responseData.json)
    })
});

let groupBoxTemplateElement = document.getElementById('group_box_template');

function createGroupBoxElement(group) {
    let groupBoxElement = groupBoxTemplateElement.content.cloneNode(true);
    groupBoxElement.children[0].setAttribute('href', `group.php?id=${group.id}&subject_id=${group.subject.id}`);
    groupBoxElement.children[0].children[0].children[0].innerHTML = group.class.name;
    groupBoxElement.children[0].children[0].children[1].innerHTML = group.name;
    groupBoxElement.children[0].children[1].innerHTML = group.subject.name;
    return groupBoxElement;
}

let groupsFilled = new Promise(async resolve => {
    let myUser = await myUserPromise;
    document.getElementById('header_teacher_full_name').textContent = myUser.full_name;
    document.getElementById('locker_teacher_full_name').textContent = myUser.full_name;
    reloadLockTimeout();
    for (let group of myUser.groups) {
        sidebarElement.appendChild(createGroupBoxElement(group));
    }
    resolve();
});

const lockerElement = document.querySelector('#locker');
const unlockButtonElement = document.querySelector('#unlock_button');
const lockerPasswordInputElement = document.querySelector('#locker_password_input')
unlockButtonElement.onclick = unlockPage;

function hideLocker() {
    let animation = lockerElement.animate(
        [{ opacity: 1 }, { opacity: 0 }],
        500
    )
    animation.finished.then(() => {
        lockerElement.classList.add('hidden');
        reloadLockTimeout();
    });
}

async function lockPage() {
    clearTimeout(lockTimeout);
    lockerElement.classList.remove('hidden');
    unlockButtonElement.classList.remove('disabled');
    lockerPasswordInputElement.value = null;
    await myUserPromise;
    localStorage.removeItem('teacher_access_token');
    localStorage.removeItem('teacher_refresh_token');
}

async function unlockPage() {
    unlockButtonElement.classList.add('disabled');
    let myUser = await myUserPromise;
    let responseData = await login({
        username: myUser.username,
        password: lockerPasswordInputElement.value
    });
    if (responseData.status == 200) {
        localStorage.setItem('teacher_access_token', responseData.accessToken);
        localStorage.setItem('teacher_refresh_token', responseData.refreshToken);
        hideLocker();
    } else if (responseData.status == 403) {
        makeInputTextWrong(lockerPasswordInputElement);
        unlockButtonElement.classList.remove('disabled');
    }
}

async function reloadLockTimeout() {
    if (lockerElement.classList.contains('hidden')) {
        console.log('t reloaded');
        let myUser = await myUserPromise;
        if (lockTimeout) clearTimeout(lockTimeout);
        if (myUser.block_after_minutes > 0) {
            lockTimeout = setTimeout(lockPage, myUser.block_after_minutes * 60000);
        } else {
            lockTimeout = null;
        }
    }
}

window.addEventListener(
    'keydown',
    event => {
        console.log(event.code)
        if (event.ctrlKey && event.shiftKey && event.code == 'KeyL') lockPage();
        if (event.code == 'Enter' && lockerElement.getAnimations().length == 0 && !lockerElement.classList.contains('hidden')) {
            unlockButtonElement.click();
        }
        reloadLockTimeout();
    }
)

window.addEventListener(
    'pointermove',
    reloadLockTimeout
)