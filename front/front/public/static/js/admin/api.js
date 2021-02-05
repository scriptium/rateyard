const PATH = `http://${window.location.hostname}:8000`

async function checkUserData(passURL, failURL) {
    accessToken = localStorage.getItem('api_access_token');

    fail = true;

    if (accessToken != null) {
        tokenIsValid = await new Promise(function (resolve, reject) {
            xhr = new XMLHttpRequest();
            xhr.open('POST', PATH + '/admin/check_token')
            xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
            xhr.onload = () => {
                if (xhr.status == 200) {
                    resolve(true)
                }
                else {
                    resolve(false)
                }
            }
            xhr.send()
        })
        if (tokenIsValid) fail = false;
    }
    console.log(fail)

    if (fail && failURL !== undefined) document.location.replace(failURL);
    else if (passURL !== undefined) document.location.replace(passURL);
}

function login(username, password) {
    return new Promise(function (resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.open('POST', PATH + '/auth/login_admin')
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () => {
            resolve({
                text: xhr.responseText,
                code: xhr.status
            })
        }
        xhr.send(JSON.stringify({
            username,
            password
        }))
    })
}

function getStudents(){
    accessToken = localStorage.getItem('api_access_token');
    return new Promise(function (resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.open('GET', PATH + '/admin/get_students')
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        xhr.onload = () => {
            resolve({
                text: xhr.responseText,
                code: xhr.status
            })
        }
        xhr.send()
    })
}

