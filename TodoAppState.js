import {clearFilterForm, displayTodos, closeCreateTodoDialog, toggleFilterStatusPanel} from './view-functions.js';
import {createTodo, readTodos, updateTodo, deleteTodo} from './mock-functions.js';
import {Todo, todoStatuses, categories, priorities} from './todo-model-functions.js';

function TodoAppState() {   
    this.todos = [];
    this.filters = {  
        pattern: '',
        todoStatus: todoStatuses.DEFAULT,
        priorityFilter: priorities.DEFAULT,
        categoryFilter: categories.DEFAULT
    };

    this.getTodosAndDisplay = () => {
        readTodos()
        .then(res => res.data)
        .then(todosReceived => {
            this.todos = todosReceived;
            displayTodos([...this.todos], {...this.filters});
        })
        .catch(e => {
            alert(e.message);
        });
    }

    this.saveTodoElementHandler = () => {
        const title = document.querySelector('.create-todo-title').value;
        const body = document.querySelector('.create-todo-body').value;
        const category = document.querySelector('.todo-options .category-choices').value;
        const priority = document.querySelector('.todo-options .priority-choices').value;

        if(!title) {
            throw new Error("Empty Todo Title");
        }
            
        const todo = new Todo(title, body, priority, category);

        createTodo(todo)
            .then(_ => {
                closeCreateTodoDialog();
            })
            .catch(_ => {
                alert(e.message);
            })
            .finally(_ => {
                this.getTodosAndDisplay();
            });
    }
    
    // performs the actions to delete a todo based on it's id
    this.deleteTodoElement = (todoID) => {
        deleteTodo(todoID)
            .then(res => {
                this.getTodosAndDisplay();
            })
            .catch(e => {
                alert(e.message);
            });
    }
    
    // toggle a todo's selection
    this.toggleTodoSelection = (todoElement) => {
        const todoID = todoElement.getAttribute('data-todo-id');
        const todo = this.todos.find(todo => todo.id === todoID);
        
        updateTodo(todoID, {completed: !todo.completed})
            .then(res => {
                this.getTodosAndDisplay();
            }).catch(e => {
                alert(e.message);
            });
    }
    
    // handle click event in todo list
    this.handleTodoListClick = (event) => {
        const todoElement = event.target.closest('.todo');
        const todoList = document.querySelector('.todo-list');
        if(!todoElement || !todoList.contains(todoElement)) {
            throw new Error("Something unexpected has happened here");
        }
    
        if(event.target.classList.contains("trash-btn")) {
            this.deleteTodoElement(todoElement.getAttribute('data-todo-id'));
        }else {
            this.toggleTodoSelection(todoElement);
        }
    }
 
    // handles the search bar input value changed event
    // TODO: Club these 3 into a single handler
    this.searchbarValueChangedHandler = (event) => {
        const patternToMatch = event.target.value;
        this.filters = {...this.filters, pattern: patternToMatch};
        
        displayTodos([...this.todos], {...this.filters});
    }

    this.prioritySelectValueChangedHandler = (event) => {
        const prioritySelected = event.target.value;
    
        // update state
        this.filters = {
            ...this.filters,
            priorityFilter: priorities[prioritySelected]
        }

        displayTodos([...this.todos], {...this.filters});
    }

    // handle the change event in category select filter
    this.categorySelectValueChangedHandler = (event) => {
        const categorySelected = event.target.value;

        // update state
        this.filters = {
            ...this.filters,
            categoryFilter: categories[categorySelected]
        };

        displayTodos([...this.todos], {...this.filters});
    }

    // handler to clear applied filters
    this.clearFiltersHandler = () => {
        // reset state
        this.filters = {
            pattern: '',
            todoStatus: todoStatuses.DEFAULT,
            priorityFilter: priorities.DEFAULT,
            categoryFilter: categories.DEFAULT
        };

        clearFilterForm();
        displayTodos([...this.todos], {...this.filters});
    }

    // handle the filter status changed
    this.filterStatusClickHandler = (event) => {
        const filterOptionClicked = event.target.closest('.filter-option');
        if(!filterOptionClicked) {
            return ;
        }
        
        toggleFilterStatusPanel(event.target);

        let filterStatus = todoStatuses.DEFAULT;

        if(filterOptionClicked.classList.contains('filter-option--selected')) {
            filterStatus = filterOptionClicked.getAttribute('data-filter-status');
        }

        // set filter state
        this.filters = {
            ...this.filters,
            todoStatus: filterStatus,
        };

        displayTodos([...this.todos], {...this.filters});
    }
}

export {TodoAppState};