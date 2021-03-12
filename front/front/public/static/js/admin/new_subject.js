let subjectNameElement = document.getElementById('subject_name');

function saveNewSubjectButton(buttonElement) {
    disableButton(buttonElement);
    
    createSubject(subjectNameElement.value).then((responseData) => {
        if (responseData.status == 400) {
            let parsedResponseJSON = responseData.json;

            console.log(parsedResponseJSON);
            if (parsedResponseJSON.includes(0)) makeInputTextWrong(subjectNameElement);

            enableButton(buttonElement);
        }
        else if (responseData.status == 200) {
            window.history.back();
        }
    });
}