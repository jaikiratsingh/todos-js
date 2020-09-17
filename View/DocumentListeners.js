class DocumentListeners {
    constructor(documentListenerHandlers) {
        this.documentListenerHandlers = documentListenerHandlers;
        this.addEventHandlers();
    }

    addEventHandlers = () => {
        document.addEventListener('keyup', (e) => {
            if((e.ctrlKey || e.metaKey) && e.key === 'z') {
                this.documentListenerHandlers.undoHandler();
            }else if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'Z') {
                this.documentListenerHandlers.redoHandler();
            }
        })
    }

}

export {DocumentListeners};