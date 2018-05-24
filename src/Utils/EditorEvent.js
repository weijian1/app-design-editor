class EditorEvent {
    constructor(eventName = 'baseevent') {
        this.cancelable = false;
        this.elementIndex = null;
        this.type = eventName;
    }
    
    preventDefault() {
        this.cancelable = true;
    }

    setElementIndex(elementIndex) {
        this.elementIndex = elementIndex;
    }
}

export default EditorEvent;