let classNameElement = document.getElementById('name');

function saveNewClassButton(buttonElement) {
    disableButton(buttonElement);
    createClass(classNameElement.value, []).then((responseData) => {
        if (responseData.status == 400) {
            makeInputTextWrong(classNameElement);
            enableButton(buttonElement);
        }
        else if (responseData.status == 200) {
            location.replace('classes.php')
        }
    });
}