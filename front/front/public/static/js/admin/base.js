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

function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('api_access_token');
    localStorage.removeItem('api_refresh_token');
    document.location.replace('login.php')
}