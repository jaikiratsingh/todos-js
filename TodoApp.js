import { TodoList } from './TodoList.js';
import {clearFilterForm} from './view-functions.js';
import {readTodos} from './mock-functions.js';
import {todoStatuses, categories, priorities} from './todo-model-functions.js';

function TodoApp() {   
    let todos = [];
    let filters = {
        pattern: '',
        todoStatus: todoStatuses.NO,
        priorityFilter: priorities.NO,
        categoryFilter: categories.NO
    };

    const todoList = new TodoList();

    this.getTodosAndDisplay = () => {
        readTodos()
        .then(res => res.data)
        .then(todosReceived => {
            todos = todosReceived;
            todoList.applyFiltersAndDisplay([...todos], {...filters});
        })
        .catch(e => {
            alert(e.message);
        });
    }

    // handles the search bar input value changed event
    this.searchbarValueChangedHandler = (event) => {
        const patternToMatch = event.target.value;
        filters = {...filters, pattern: patternToMatch};
        
        todoList.applyFiltersAndDisplay([...todos], {...filters});
    }

    this.prioritySelectValueChangedHandler = (event) => {
        const prioritySelected = event.target.value;
    
        // update state
        filters = {
            ...filters,
            priorityFilter: prioritySelected
        }
    
        todoList.applyFiltersAndDisplay([...todos], {...filters});
    }

    // handle the change event in category select filter
    this.categorySelectValueChangedHandler = (event) => {
        const categorySelected = event.target.value;

        // update state
        filters = {
            ...filters,
            categoryFilter: categorySelected
        };

        todoList.applyFiltersAndDisplay([...todos], {...filters});
    }

    // finds and returns todo by id
    this.findTodoByID = (todoID) => {
        const [todo] = todos.filter(todo => todo.id === todoID);

        return todo;
    }

    // handler to clear applied filters
    this.clearFiltersHandler = () => {
        // reset state
        filters = {
            pattern: '',
            todoStatus: todoStatuses.NO,
            priorityFilter: priorities.NO,
            categoryFilter: categories.NO
        };

        clearFilterForm();
        todoList.applyFiltersAndDisplay([...todos], {...filters});
    }

    // handle the filter status changed
    this.filterStatusClickHandler = (event) => {
        const filterOptionClicked = event.target.closest('.filter-option');
        if(!filterOptionClicked) {
            return ;
        }

        const filterStatusPanel = event.target.closest('.filter-options__section--2');

        Array.from(filterStatusPanel.children).forEach(filterOption => {   // this here refers to element which has the event listener applied to
            if(filterOption === filterOptionClicked) {
                return ;
            }

            filterOption.classList.remove('filter-option--selected');
        });

        filterOptionClicked.classList.toggle('filter-option--selected');
        
        let filterStatus = todoStatuses.NO;

        if(filterOptionClicked.classList.contains('filter-option--selected')) {
            filterStatus = filterOptionClicked.getAttribute('data-filter-status');
        }

        // set filter state
        filters = {
            ...filters,
            todoStatus: filterStatus,
        };

        todoList.applyFiltersAndDisplay([...todos], {...filters});
    }
}

export {TodoApp};