const inputElement = document.querySelector('#input');
const sendButtonElement = document.querySelector('.blue_button');
const messageElement = document.querySelector('.message');
const preloaderElement = document.querySelector('#preloader');
let pathPrefix;
if (document.location.pathname == '/student/reset_password.php') pathPrefix = '/student/'
else if (document.location.pathname == '/teacher/reset_password.php') pathPrefix = '/teacher/'
console.log(pathPrefix)
const apiClient = new RateyardApiClient(null, null, pathPrefix)

async function sendCode(dataObject) {
    let xhr = await apiClient.sendRequest(
        'send_reset_password_code', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(dataObject), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function checkCode(dataObject) {
    let xhr = await apiClient.sendRequest(
        'check_reset_password_code', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(dataObject), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

async function resetPassword(dataObject) {
    let xhr = await apiClient.sendRequest(
        'reset_password', 'POST', { 'Content-Type': 'application/json' },
        JSON.stringify(dataObject), true
    );
    return {
        status: xhr.status,
        json: JSON.parse(xhr.responseText)
    }
}

window.addEventListener(
    'keydown',
    (event) => {
        if (event.key == 'Enter' && !sendButtonElement.classList.contains('disabled'))
            sendButtonElement.click();
    }
);

let sendButtonIsLocked = false;
function updateButton(event) {
    if (sendButtonIsLocked) return;
    if (event.target.value.length > 0) sendButtonElement.classList.remove('disabled');
    else sendButtonElement.classList.add('disabled');
}

let email;

async function resetPasswordButton () {
    sendButtonIsLocked = true;
    sendButtonElement.classList.add('disabled');
    let responseData = await resetPassword({email, code, new_password: inputElement.value});
    if (responseData.status == 402) {
        sendButtonIsLocked = false;
        sendButtonElement.classList.remove('disabled');
        makeInputTextWrong(inputElement);
    } else if (responseData.status == 200) {
        document.location.replace(pathPrefix + 'login.php');
    }
}

let code;

async function checkCodeButton () {
    code = inputElement.value;
    sendButtonIsLocked = true;
    sendButtonElement.classList.add('disabled');
    let responseData = await checkCode({email, code});
    if (responseData.status == 400) {
        sendButtonIsLocked = false;
        sendButtonElement.classList.remove('disabled');
        makeInputTextWrong(inputElement);
    } else if (responseData.status == 200) {
        preloaderElement.classList.remove('hidden');
        messageElement.classList.add('hidden');
        sendButtonIsLocked = false;
        inputElement.value = null;
        inputElement.placeholder = 'Новий пароль';
        inputElement.type = 'password';
        sendButtonElement.onclick = resetPasswordButton;
        hidePreloader();
    }
}

sendButtonElement.onclick = async () => {
    email = inputElement.value;
    sendButtonIsLocked = true;
    sendButtonElement.classList.add('disabled');
    let responseData = await sendCode({email});
    if (responseData.status == 400) {
        sendButtonIsLocked = false;
        sendButtonElement.classList.remove('disabled');
        makeInputTextWrong(inputElement);
    } else if (responseData.status == 200) {
        preloaderElement.classList.remove('hidden');
        sendButtonElement.classList.remove('disabled');
        messageElement.classList.remove('hidden');
        inputElement.value = null;
        inputElement.placeholder = 'Код підтвердження';
        sendButtonElement.onclick = checkCodeButton;
        hidePreloader();
    }
}

