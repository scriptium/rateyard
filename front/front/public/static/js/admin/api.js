const PATH = `http://${window.location.hostname}:8000`

async function checkUserData(passURL, failURL) {
    let accessToken = localStorage.getItem('api_access_token');

    let fail = true;

    if (accessToken != null) {
        let tokenIsValid = await new Promise(function (resolve, reject) {
            let xhr = new XMLHttpRequest();
            xhr.open('POST', PATH + '/admin/check_token')
            xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
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
    if (fail) {
        if (failURL !== undefined)
            document.location.replace(failURL);
    }
    else if (passURL !== undefined)
        document.location.replace(passURL);
    return true
}

function login(username, password) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
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

function getStudents(ids) {
    let accessToken = localStorage.getItem('api_access_token');
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', PATH + '/admin/get_students')
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
        if (ids != undefined) {
            
            xhr.send(JSON.stringify(ids))
        }
        else xhr.send()
    })
}

function getGroups(editable, student_id) {
    let accessToken = localStorage.getItem('api_access_token');
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', PATH + '/admin/get_groups')
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

        if (typeof editable != 'udefined' || typeof student_id != undefined) {
            xhr.setRequestHeader('Content-type', 'application/json');
            let requestJSON = {};
            if (typeof editable != 'udefined') requestJSON.editable = editable;
            if (typeof student_id != 'udefined') requestJSON.student_id = student_id;

            xhr.send(JSON.stringify(requestJSON))
        }
        else xhr.send()
    })
}

function getClasses() {
    let accessToken = localStorage.getItem('api_access_token');
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', PATH + '/admin/get_classes')
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status == 200)
                    resolve({
                        text: xhr.responseText,
                        code: xhr.status
                    })
                else
                    reject({
                        text: xhr.responseText,
                        code: xhr.status
                    })
            }
        }
        xhr.send()
    })
}

function createStudents(studentsJSONString) {
    let accessToken = localStorage.getItem('api_access_token');
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', PATH + '/admin/create_students')
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
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
        xhr.send(studentsJSONString)
    })
}

function deleteStudents(studentIdsJSONString) {
    let accessToken = localStorage.getItem('api_access_token');
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', PATH + '/admin/delete_students')
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status == 200)
                    resolve({
                        text: xhr.responseText,
                        code: xhr.status
                    })
                else
                    reject({
                        text: xhr.responseText,
                        code: xhr.status
                    })
            }
        }
        xhr.send(studentIdsJSONString)
    })
}

function editStudents(studentsChangesJSONString) {
    let accessToken = localStorage.getItem('api_access_token');
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', PATH + '/admin/edit_students')
        xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status == 200)
                    resolve({
                        text: xhr.responseText,
                        code: xhr.status
                    })
                else
                    reject({
                        text: xhr.responseText,
                        code: xhr.status
                    })
            }
        }
        xhr.send(studentsChangesJSONString)
    })
}


