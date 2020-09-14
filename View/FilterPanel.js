import { todoStatuses, priorities, categories } from "../todo-model-functions";

class FilterPanel {
    constructor(filters, filterPanelHandlers) {
        /*
            filterPanelHandlers = {filterStatusChangedHandler, searchPatternChangedHandler, priorityChangedHandler, categoryChangedHandler, clearFiltersHandler}
        */
        this.props = {
            filters,
            filterPanelHandlers
        }

        this.filterStatusPanel = document.querySelector('#filter-status-panel');
        this.searchBarInput = document.querySelector('#searchbar__input');
        this.prioritySelect = document.querySelector('#filter-select-priority');
        this.categorySelect = document.querySelector('#filter-select-category');
        this.clearFiltersBtn = document.querySelector('#clear-filter-btn');

        this.addFilterPanelEventHandlers();
        this.render();
    }

    updateFiltersProps = (filters) => {
        this.props.filters = filters;
        this.render();
    }

    render = () => {
        this.searchBarInput.value = this.props.filters.pattern;
        this.prioritySelect.value = this.props.filters.priorityFilter.key;
        this.categorySelect.value = this.props.filters.categoryFilter.key;
        Array.from(this.filterStatusPanel.children).forEach(filterStatusOption => {
            if(filterStatusOption.getAttribute('data-filter-status') === this.props.filters.todoStatus) {
                filterStatusOption.classList.add('filter-option--selected');
            }else {
                filterStatusOption.classList.remove('filter-option--selected');
            }
        });

        for(const priority in priorities) {
            const option = document.createElement('option');
            option.value = priorities[priority].key;
            option.text = priorities[priority].value;

            if(priority === priorities.DEFAULT) {
                option.selected = true;
                option.disabled = true;
            }
            
            this.prioritySelect.add(option);
        }

        for(const category in categories) {
            const option = document.createElement('option');
            option.value = categories[category].key;
            option.text = categories[category].value;

            if(category === categories.DEFAULT) {
                option.selected = true;
                option.disabled = true;
            }
            
            this.categorySelect.add(option);
        }
    }

    addFilterPanelEventHandlers = () => {
        this.filterStatusPanel.addEventListener('click', this.filterStatusPanelChangedHandler);
        this.searchBarInput.addEventListener('keyup', this.searchbarValueChangedHandler);
        this.prioritySelect.addEventListener('change', this.prioritySelectValueChangedHandler);
        this.categorySelect.addEventListener('change', this.categorySelectValueChangedHandler);
        this.clearFiltersBtn.addEventListener('click', this.props.filterPanelHandlers.clearFiltersHandler);
    }

    filterStatusPanelChangedHandler = (event) => {
        const filterOptionClicked = event.target.closest('div[data-type="filter-option"]');
        if(!filterOptionClicked) {
            return ;
        }
    
        const filterStatus = (this.props.filters.todoStatus === filterOptionClicked.getAttribute('data-filter-status') ? (
            // old status was clicked again, so remove status
            todoStatuses.DEFAULT
        ) : (
            // new status is clicked
            filterOptionClicked.getAttribute('data-filter-status')
        ));
        
        this.props.filterPanelHandlers.filterStatusChangedHandler(filterStatus);  // call control
    }

    prioritySelectValueChangedHandler = (event) => {
        const prioritySelected = event.target.value;
        this.props.filterPanelHandlers.priorityChangedHandler(prioritySelected);
    }

    categorySelectValueChangedHandler = (event) => {
        const categorySelected = event.target.value;
        this.props.filterPanelHandlers.categoryChangedHandler(categorySelected);
    }

    searchbarValueChangedHandler = (event) => {
        const patternMatch = event.target.value;
        this.props.filterPanelHandlers.searchPatternChangedHandler(patternMatch);
    }
}

export {FilterPanel};