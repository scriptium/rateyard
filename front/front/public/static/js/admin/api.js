const PATH = `http://${window.location.hostname}:8000`

async function checkUserData(passURL, failURL) {
    let accessToken = localStorage.getItem('api_access_token');

    let fail = true;

    if (accessToken != null) {
        let tokenIsValid = await new Promise(function (resolve, reject) {
            xhr = new XMLHttpRequest();
            xhr.open('POST', PATH + '/admin/check_token')
            xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE)
                {
                    if (xhr.status == 200) {
                        resolve(true)
                    }
                    else {
                        resolve(false)
                    }
                }
            }
            xhr.send()
        })
        if (tokenIsValid) fail = false;
    }
    if (fail){
        if (failURL !== undefined)
            document.location.replace(failURL);
    }
    else if (passURL !== undefined)
        document.location.replace(passURL);
}

function login(username, password) {
    return new Promise(function (resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.open('POST', PATH + '/auth/login_admin')
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onload = () => {
            if (xhr.status == 200)
                resolve({
                    text: xhr.responseText,
                    code: xhr.status
                })
            else reject({
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
            if (xhr.status == 200)
                resolve({
                    text: xhr.responseText,
                    code: xhr.status
                })
            else reject({
                text: xhr.responseText,
                code: xhr.status
            })
        }
        xhr.send()
    })
}

function getGroups(){
    accessToken = localStorage.getItem('api_access_token');
    return new Promise(function (resolve, reject) {
        xhr = new XMLHttpRequest();
        xhr.open('GET', PATH + '/admin/get_groups')
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        xhr.onload = () => {
            if (xhr.status == 200)
                resolve({
                    text: xhr.responseText,
                    code: xhr.status
                })
            else reject({
                text: xhr.responseText,
                code: xhr.status
            })
        }
        xhr.send()
    })
}

