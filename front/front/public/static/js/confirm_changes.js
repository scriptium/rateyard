const inputElement = document.querySelector('#input');
const sendButtonElement = document.querySelector('.blue_button');
const messageElement = document.querySelector('.message');
const preloaderElement = document.querySelector('#preloader');

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

sendButtonElement.onclick = async () => {
    sendButtonIsLocked = true;
    sendButtonElement.classList.add('disabled');
    let responseData = await confirmChanges({ code: inputElement.value });
    if (responseData.status == 200) {
        document.location.replace('account.php');
    } else if (responseData.status == 403) {
        makeInputTextWrong(inputElement);
        sendButtonElement.classList.remove('disabled');
        sendButtonIsLocked = false;
    }
};