function disableButton(button) {
    button.classList.add('disabled');
}

function enableButton(button) {
    button.classList.remove('disabled');
}

function makeInputTextNotWrongWithoutOnchange(inputTextElement) {
    if (inputTextElement.hasAttribute('default_oninput')) {
        inputTextElement.setAttribute(
            'oninput',
            inputTextElement.getAttribute('default_oninput')
        );
        inputTextElement.removeAttribute('default_oninput')
    }
    else inputTextElement.removeAttribute('oninput');
    inputTextElement.classList.remove('wrong');
}
function makeInputTextNotWrong(inputTextElement) {
    if (inputTextElement.hasAttribute('default_oninput')) {
        inputTextElement.setAttribute(
            'oninput',
            inputTextElement.getAttribute('default_oninput')
        );
        eval(inputTextElement.getAttribute('default_oninput').replace('this', 'inputTextElement'));
        inputTextElement.removeAttribute('default_oninput')
    }
    else inputTextElement.removeAttribute('oninput');
    inputTextElement.classList.remove('wrong');
}

function makeInputTextWrong(inputTextElement) {
    if (inputTextElement.hasAttribute('oninput')) {
        inputTextElement.setAttribute(
            'default_oninput',
            inputTextElement.getAttribute('oninput')
        );
    }
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
