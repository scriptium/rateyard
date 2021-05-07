const subjectsPromise = getSubjects();
const subjectId = (new URLSearchParams(window.location.search)).get('id');
let subject;
const subjectNameElement = document.querySelector('#subject_name');
const subjectDataFilledPromise = new Promise(async resolve => {
    for (let tempSubject of (await subjectsPromise).json) {
        if (tempSubject.id == subjectId) {
            subject = tempSubject
            break;
        }
    }
    subjectNameElement.value = subject.name;
    subjectNameElement.setAttribute('initial_value', subject.name);
    resolve();
});
const changesSet = new ChangesSet(document.querySelectorAll('.appear_on_change'));
subjectNameElement.oninput = () => {
    changesSet.updateChangedElements(subjectNameElement);
}
const discardChangesElement = document.querySelector('#discard_changes');
discardChangesElement.onclick = () => {
    changesSet.discardChanges();
}
const saveChangesElement = document.querySelector('#save_changes');
saveChangesElement.onclick = async () => {
    saveChangesElement.classList.add('disabled');
    let changes = { subject_id: subjectId };
    for (let changedElement of changesSet.changedElements) {
        changes[changedElement.id] = changedElement.value;
        changedElement.setAttribute('initial_value', changedElement.value);
    }
    await editSubjects([changes]);
    changesSet.discardChanges();
    saveChangesElement.classList.remove('disabled');
}
const deleteSubjectElement = document.querySelector('#delete_subject');
deleteSubjectElement.onclick = async () => {
    let confirmed = confirm('Усі викладачі та оцінки за цим предметом буде видалено. Видалити предмет?');
    if (!confirmed) return;
    deleteSubjectElement.classList.add('disabled');
    await deleteSubjects([subjectId]);
    location.replace('subjects.php');
}
window.onload = async () => {
    await subjectDataFilledPromise;
    hidePreloader();
}