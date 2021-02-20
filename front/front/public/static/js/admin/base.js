function logoutButton(button) {
    disableButton(button)
    localStorage.removeItem('api_access_token');
    localStorage.removeItem('api_refresh_token');
    document.location.replace('login.php')
}

function fillClassesSelect(dropdowmElement, classes) {
    classes.forEach(_class => {
        let newOptionElement = document.createElement('option');
        newOptionElement.value = _class.id;
        newOptionElement.innerHTML = _class.name;
        dropdowmElement.appendChild(newOptionElement);
    });
}

let appearOnChangeElements = document.querySelectorAll(".appear_on_change");
let changedElements = new Set();

function updateChangedElements(element){
    let elementHasInitialValue = false;
    let elementInitialValue = element.getAttribute('initial_value');
    if (element.classList.contains('checkbox'))
    {
        element.classList.toggle('checked');
        if (element.classList.contains('checked') === (elementInitialValue === 'true'))
            elementHasInitialValue = true;
    }
    else if (element.value === elementInitialValue)
        elementHasInitialValue = true;

    if (elementHasInitialValue) changedElements.delete(element)
    else changedElements.add(element);

    console.log(elementHasInitialValue);

    if (changedElements.size > 0)
        appearOnChangeElements.forEach((element) => {
            element.classList.add('visible');
        });
    else
        appearOnChangeElements.forEach((element) => {
            element.classList.remove('visible');
        });
}

function discardChangesButton() {
    changedElements.forEach(
        (element) => {
            let elementInitialValue = element.getAttribute('initial_value');
            if (element.classList.contains('checkbox'))
            {
                if (elementInitialValue === 'true')
                    element.classList.add('checked');
                else
                    element.classList.remove('checked');
            }
            else 
                element.value = elementInitialValue;
        }
    );
    changedElements.clear();
    appearOnChangeElements.forEach(
        element => {
            element.classList.remove('visible');
        } 
    );
}