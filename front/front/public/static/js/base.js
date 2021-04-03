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
    if(!inputTextElement.classList.contains('wrong')) {
        if (inputTextElement.hasAttribute('oninput')) {
            inputTextElement.setAttribute(
                'default_oninput',
                inputTextElement.getAttribute('oninput')
            );
        }
        inputTextElement.setAttribute('oninput', 'makeInputTextNotWrong(this)');
        inputTextElement.classList.add('wrong');
    }
}

function makeDropDownSelectNotWrong(selectElement) {
    if (selectElement.hasAttribute('default_onchange')) {
        selectElement.setAttribute(
            'onchange',
            selectElement.getAttribute('default_onchange')
        );
        eval(selectElement.getAttribute('default_onchange').replace('this', 'selectElement'));
        selectElement.removeAttribute('default_onchange')
    }
    selectElement.removeAttribute('onchange');
    selectElement.classList.remove('wrong');
}

function makeDropDownSelectWrong(selectElement) {
    if(!selectElement.classList.contains('wrong')) {
        if (selectElement.hasAttribute('onchange')) {
            selectElement.setAttribute(
                'default_onchange',
                selectElement.getAttribute('onchange')
            );
        }
        selectElement.setAttribute('onchange', 'makeDropDownSelectNotWrong(this)');
        selectElement.classList.add('wrong');
    }
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

async function hidePreloader()
{
    let preloaderItem = document.getElementById('preloader');
    let animation = preloaderItem.animate([{opacity: 1}, {opacity: 0}], 500);
    await animation.finished;
    preloaderItem.classList.add('hidden');
}

let sidebarElement = document.getElementById('sidebar');
let sidebarCloseAreaElement = document.getElementById('sidebar_close_area');

async function openSidebar() {
    await Promise.all(
        sidebarElement.getAnimations({ subtree: true })
          .map(animation => animation.finished)
    );
    sidebarElement.classList.add('visible');
    sidebarCloseAreaElement.classList.add('opened');
    let animation = sidebarElement.animate([{transform: 'translateX(-100%)'}, {transform: 'none'}], {duration: 400});
    await animation.finished;
    sidebarElement.classList.add('opened');
}

async function closeSidebar() {
    await Promise.all(
        sidebarElement.getAnimations({ subtree: true })
          .map(animation => animation.finished)
    );
    sidebarElement.classList.remove('opened');
    let animation = sidebarElement.animate([{transform: 'none'}, {transform: 'translateX(-100%)'}], {duration: 400});
    await animation.finished;
    sidebarElement.classList.remove('visible');
    sidebarCloseAreaElement.classList.remove('opened');
}

