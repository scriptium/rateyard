checkingData = checkUserData(undefined, 'login.php');

let classesResponseData;

checkingData.then(() => {
    classesResponseData = getClasses()
});

window.onload = async () => {
    await checkingData;
    classesResponseData.then((responseData) => {
        let classesSelectElement = document.getElementById('classes_select');
        fillClassesSelect(classesSelectElement, JSON.parse(responseData.text));
        classesSelectElement.parentElement.classList.add('visible');
    });
}