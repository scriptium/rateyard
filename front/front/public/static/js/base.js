function disableButton(button) {
    button.classList.add('disabled');
}

function enableButton(button) {
    button.classList.remove('disabled');
}

function makeInputTextNotWrong(inputTextElement) {
    inputTextElement.removeAttribute('oninput');
    inputTextElement.classList.remove('wrong');
}

function makeInputTextWrong(inputTextElement) {
    inputTextElement.setAttribute('oninput', 'makeInputTextNotWrong(this)');
    inputTextElement.classList.add('wrong');
}