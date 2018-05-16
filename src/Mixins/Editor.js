let getElementByParent = (el, parentClassName) => {
    let parentEl = el.parentElement;
    while (!parentEl.classList.contains(parentClassName.substr(1)) && parentEl.parentElement != null) {
        parentEl = parentEl.parentElement;
    }
    return parentEl;
}

let getElementByChildren = (el, childrenClassName) => {
    let childEl = el.querySelector(childrenClassName);
    return childEl;
}

export default {
    computed: {
        editorParent() {
            let el = getElementByParent(this.$el, '.design-editor');
            return el ? el.__vue__ : null;
        },
        wrapperChildren() {
            let el = direction == getElementByChildren(this.$el, '.editor-wrapper');
            return el ? el.__vue__ : null;
        },
        wrapperParent() {
            let el = getElementByParent(this.$el, '.editor-wrapper');
            return el ? el.__vue__ : null;
        },
        bodyChildren() {
            let el = getElementByChildren(this.$el, '.editor-body');
            return el ? el.__vue__ : null;
        },
        bodyParent() {
            let el = getElementByParent(this.$el, '.editor-body');
            return el ? el.__vue__ : null;
        }
    }
}