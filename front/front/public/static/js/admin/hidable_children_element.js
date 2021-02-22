class HidableChild {
    constructor (element, isHidden) {
        this.element = element;
        this.isHidden = isHidden;
    }
}

class HidableChildrenElement {
    constructor (element) {
        this.element = element;
        this.elementHidableChildren = [];
        for (let elementChild of element.children)
            this.elementHidableChildren.push()
        this.changes = new Set();
    }
    hideChild (child) {
        let childNotFound = true;
        for (let hidableChild of this.elementHidableChildren)
        {

        }
        if (childNotFound) throw new Error('Child not found');
        this.changes.add(HidableChild(child, false));
    }
    update() {
    }
}