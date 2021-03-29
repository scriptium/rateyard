const restoreFor = document.querySelector('#restore_for');
const input = document.querySelector('#username_input');
const sendButton = document.querySelector('.blue_button');
const message = document.querySelector('.message');
// const mailMessage = document.querySelector('#mail');

const animation = [{opacity: 0}, {opacity: 1}];

function sendOnMail() {
    //send huyny
    message.classList.add('show');
    message.animate(animation, 300);
    sendButton.innerHTML = 'Далі';
    input.placeholder = 'Введіть код';
    // mailMessage.innerHTML = 'patraboy@pedik.com';
    sendButton.removeEventListener('click', sendOnMail);
    sendButton.addEventListener('click', checkCode);
}

async function checkCode() {
    //check
    await message.animate(animation, {duration: 150, direction: 'reverse'}).finished;
    message.classList.remove('show');
    sendButton.innerHTML = 'Зберегти';
    input.placeholder = 'Новий пароль';
    input.setAttribute('type', 'password');
    sendButton.removeEventListener('click', checkCode);
    sendButton.addEventListener('click', saveNewPassword);
}

function saveNewPassword() {
    //
    location.href = './login.php';
}

sendButton.addEventListener('click', sendOnMail);