let subjectNameElement = document.getElementById('subject_name');

function saveNewSubjectButton(buttonElement) {
    disableButton(buttonElement);
    
    let requestJSON = [{
        subject_name: subjectNameElement.value,
    }]

    createSubjects(requestJSON).then((responseData) => {
        if (responseData.status == 400) {
            let parsedResponseJSON = responseData.json;

            console.log(parsedResponseJSON);
            if (parsedResponseJSON[0].includes(0)) makeInputTextWrong(subjectNameElement);

            enableButton(buttonElement);
        }
        else if (responseData.status == 200) {
            window.history.back();
        }
    });
}