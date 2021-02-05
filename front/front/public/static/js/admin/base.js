function disableButton(button)
{
    button.setAttribute('_onclick', button.getAttribute('onclick'))
    button.removeAttribute('onclick')
    button.classList.add('disabled')
}

function enableButton (button)
{
    button.setAttribute('onclick', button.getAttribute('_onclick'))
    button.classList.remove('disabled')
}