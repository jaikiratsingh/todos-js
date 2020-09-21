class BulkActions {
    constructor(isVisible, bulkActionsListeners) {
        this.props = {
            isVisible,
            bulkActionsListeners
        };

        this.deleteBulkBtn = document.querySelector('#delete-bulk');
        this.markCompleteBulkBtn = document.querySelector('#mark-complete-bulk');

        this.deleteBulkBtn.addEventListener('click', this.props.bulkActionsListeners.deleteBulkListener);
        this.markCompleteBulkBtn.addEventListener('click', this.props.bulkActionsListeners.markCompleteBulkListener);

        this.bulkActions = document.querySelector('#selected-todos-actions');

        this.render();
    }

    updateVisibilityProps = (isVisible) => {
        this.props.isVisible = isVisible;
        this.render();
    }

    render() {
        if(!this.props.isVisible) {
            this.bulkActions.style.display = 'none';
        }else {
            this.bulkActions.style.display = 'block';
        }
    }
}

export {BulkActions};   