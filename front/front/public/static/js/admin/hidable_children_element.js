class HidableChildrenElement {
    constructor(element) {
        this.element = element;
        this.hiddenChildren = new Set();
        this.childrenIndexes = new Map();
        for (let childIndex=0; childIndex<element.children.length; childIndex++)
            this.childrenIndexes.set(element.children[childIndex], childIndex);
        this.changes = new Map();
    }
    hide(child) {
        if (!this.childrenIndexes.has(child))
            throw new Error('Child not found');
        this.changes.set(child, false);
    }
    show(child) {
        if (!this.childrenIndexes.has(child))
            throw new Error('Child not found');
        this.changes.set(child, true);
    }
    showAll() {
        for (let hiddenChild of this.hiddenChildren)
            this.changes.set(hiddenChild, true);
    }
    hideAll() {
        for (let child of this.element.children)
            this.changes.set(child, false);
    }
    update() {
        for (var [child, makeVisible] of this.changes) {
            if (makeVisible && this.hiddenChildren.has(child)) {
                let childIndex = this.childrenIndexes.get(child);
                let childNotInserted = true;
                for (let checkChild of this.element.children) {
                    if (childIndex < this.childrenIndexes.get(checkChild)) {
                        checkChild.before(child);
                        childNotInserted = false;
                        break;
                    }
                }
                if (childNotInserted) this.element.appendChild(child);
                this.hiddenChildren.delete(child);

            }
            else if (!makeVisible && !this.hiddenChildren.has(child)) {
                this.hiddenChildren.add(child);
                this.element.removeChild(child);          
            }
        }
        this.changes.clear();
    }
}