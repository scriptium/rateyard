const input = document.querySelector('#username_input');
const sendButton = document.querySelector('.blue_button');
const message = document.querySelector('.message');

const animation = [{opacity: 0}, {opacity: 1}];

let email;
let id;

disableButton(sendButton);

input.addEventListener('input', () => {
    if (input.value) enableButton(sendButton);
    else disableButton(sendButton);
});

async function sendOnMail() {
    input.focus();
    document.getElementById('preloader').classList.remove('hidden');
    let data = await sendVerificationEmail(input.value);
    hidePreloader();
    email = data.json.email;
    id = data.json.id;
    message.classList.add('show');
    message.animate(animation, 300);
    sendButton.innerHTML = 'Далі';
    input.placeholder = 'Введіть код';
    message.innerHTML = `На вашу пошту ${email} відправлено код відновлення.`;
    input.value = '';
    input.focus();

    sendButton.onclick = checkCode;
    disableButton(sendButton);
}

async function checkCode() {
    let result = await verifyCode(email, input.value);
    if (result.status !== 200) {
        message.innerHTML = 'Невірний код! Перевірте його та спробуйте ще раз.';
    } else {
        message.innerHTML = 'Введіть новий пароль.';
        sendButton.innerHTML = 'Зберегти';
        input.placeholder = 'Новий пароль';
        input.value = '';
        input.focus();
        input.setAttribute('type', 'password');
        sendButton.onclick = saveNewPassword;
        disableButton(sendButton);
    }
}

async function saveNewPassword() {
    await changePassword(id, input.value);
    message.innerHTML = 'Новий пароль успішно збережено';
    sendButton.innerHTML = 'Увійти в аккаунт';
    input.style.display = 'none';
    sendButton.onclick = () => {
        location.href = './login.php';
    };
}

window.onload = () => {
    input.focus();
    sendButton.onclick = sendOnMail;
    hidePreloader();
}

