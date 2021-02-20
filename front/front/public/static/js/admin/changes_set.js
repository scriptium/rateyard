class ChangesSet {
    constructor(appearOnChangeElementsArray) {
        this.changedElements = new Set();
        this.appearOnChangeElements = appearOnChangeElementsArray;
    }
    updateChangedElements(element){
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
    
        if (elementHasInitialValue) this.changedElements.delete(element)
        else this.changedElements.add(element);
    
        if (this.changedElements.size > 0)
            this.appearOnChangeElements.forEach((element) => {
                element.classList.add('visible');
            });
        else
            this.appearOnChangeElements.forEach((element) => {
                element.classList.remove('visible');
            });
    }
    discardChanges() {
        this.changedElements.forEach(
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
        this.changedElements.clear();
        this.appearOnChangeElements.forEach(
            element => {
                element.classList.remove('visible');
            } 
        );
    }
}