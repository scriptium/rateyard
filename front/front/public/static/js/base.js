function disableButton(button) {
    button.setAttribute('_onclick', button.getAttribute('onclick'))
    button.removeAttribute('onclick')
    button.classList.add('disabled')
}

function enableButton(button) {
    button.setAttribute('onclick', button.getAttribute('_onclick'))
    button.classList.remove('disabled')
}

function makeInputTextNotWrong(inputTextElement) {
    inputTextElement.removeAttribute('oninput');
    inputTextElement.classList.remove('wrong');
}

function makeInputTextWrong(inputTextElement) {
    inputTextElement.setAttribute('oninput', 'makeInputTextNotWrong(this)');
    inputTextElement.classList.add('wrong');
}