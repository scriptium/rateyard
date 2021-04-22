const input = document.querySelector('#username_input');
const sendButton = document.querySelector('.blue_button');
const message = document.querySelector('.message');

const animation = [{opacity: 0}, {opacity: 1}];

let authApi = new RateyardApiClient(null, null, '/auth/');
let userData = {};

disableButton(sendButton);

input.addEventListener('input', () => {
    if (input.value) enableButton(sendButton);
    else disableButton(sendButton);
});

async function sendOnMail() {
    input.focus();
    document.getElementById('preloader').classList.remove('hidden');
    let data = await authApi.verifyPassword(userData.type, userData.username, input.value);

    message.classList.add('show');
    message.animate(animation, 300);
    input.focus();

    if (data !== 200) {
        hidePreloader();
        message.innerHTML = 'Невірний пароль! Перевірте його та спробуйте ще раз.';
        return;
    }

    await sendVerificationEmail(userData.username);
    hidePreloader();
    message.innerHTML = `На вашу пошту ${userData.email} відправлено код підтвердження.`;
    sendButton.innerHTML = 'Далі';
    input.placeholder = 'Введіть код';
    input.value = '';
    input.type = 'text';

    disableButton(sendButton);
    sendButton.onclick = checkCode;
}

async function checkCode() {
    let result = await verifyCode(userData.email, input.value);
    if (result.status !== 200) {
        message.innerHTML = 'Невірний код! Перевірте його та спробуйте ще раз.';
    } else {
        message.innerHTML = 'Введіть новий пароль.';
        sendButton.innerHTML = 'Зберегти';
        input.placeholder = 'Новий пароль';
        input.value = '';
        input.type = 'password';
        input.focus();
        input.setAttribute('type', 'password');
        sendButton.onclick = saveNewPassword;
        disableButton(sendButton);
    }
}

async function saveNewPassword() {
    await changePassword(userData.id, input.value);
    message.innerHTML = 'Новий пароль успішно збережено';
    sendButton.innerHTML = 'Увійти в аккаунт';
    input.style.display = 'none';
    sendButton.onclick = () => {
        location.href = './login.php';
    };
}

window.onload = async () => {
    userData = await getMe();
    userData = userData.json;
    userData.type = location.pathname.split('/')[1];
    input.focus();
    sendButton.onclick = sendOnMail;
    hidePreloader();
}

