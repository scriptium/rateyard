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

function createCheckboxElement() {
    let checkboxElement = document.createElement('div');
    checkboxElement.classList.add('checkbox');
    checkboxElement.setAttribute('onclick', 'toggleCheckbox(this)');
    return checkboxElement;
}

function toggleCheckbox(checkboxElement, onclick) {
    if (typeof onclick != 'undefined') onclick(checkboxElement);
    checkboxElement.classList.toggle('checked');
}
