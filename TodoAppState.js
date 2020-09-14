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

    this.updateTodosState = (todos) => {
        this.todos = todos;
        displayTodos(this.todos, this.filters);
    }

    this.updateFiltersState = (filterUpdateObject) => {
        this.filters = {
            ...this.filters,
            ...filterUpdateObject
        };
        displayTodos(this.todos, this.filters);
    }

    this.getTodosAndDisplay = () => {
        readTodos()
        .then(res => res.data)
        .then(todosReceived => {
            this.updateTodosState(todosReceived);
        })
        .catch(e => {
            alert(e.message);
        });
    }

    this.saveTodoElementHandler = () => {
        const title = document.querySelector('#create-todo-title').value;
        const body = document.querySelector('#create-todo-body').value;
        const category = document.querySelector('#create-todo-category-choices').value;
        const priority = document.querySelector('#create-todo-priority-choices').value;

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
            .then(() => {
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
            .then(() => {
                this.getTodosAndDisplay();
            }).catch(e => {
                alert(e.message);
            });
    }
    
    // handle click event in todo list
    this.handleTodoListClick = (event) => {
        const todoElement = event.target.closest('div[data-type="todo"]');
        const todoList = document.querySelector('#todo-list');
        if(!todoElement || !todoList.contains(todoElement)) {
            throw new Error("Something unexpected has happened here");
        }
    
        if(event.target.getAttribute('data-type') === "trash-btn") {
            this.deleteTodoElement(todoElement.getAttribute('data-todo-id'));
        }else {
            this.toggleTodoSelection(todoElement);
        }
    }
 
    // handles the search bar input value changed event
    // TODO: Club these 3 into a single handler
    this.searchbarValueChangedHandler = (event) => {
        const patternToMatch = event.target.value;
        this.updateFiltersState({pattern: patternToMatch});
    }

    this.prioritySelectValueChangedHandler = (event) => {
        const prioritySelected = event.target.value;
        this.updateFiltersState({priorityFilter: priorities[prioritySelected]})
    }

    // handle the change event in category select filter
    this.categorySelectValueChangedHandler = (event) => {
        const categorySelected = event.target.value;
        this.updateFiltersState({categoryFilter: categories[categorySelected]})
    }

    // handler to clear applied filters
    this.clearFiltersHandler = () => {
        // reset state
        this.updateFiltersState({
            pattern: '',
            todoStatus: todoStatuses.DEFAULT,
            priorityFilter: priorities.DEFAULT,
            categoryFilter: categories.DEFAULT
        });
        clearFilterForm();
    }

    // handle the filter status changed
    this.filterStatusClickHandler = (event) => {
        const filterOptionClicked = event.target.closest('div[data-type="filter-option"]');
        if(!filterOptionClicked) {
            return ;
        }
        
        toggleFilterStatusPanel(event.target);

        const filterStatus = (filterOptionClicked.hasAttribute('data-filter-selected')
                             ? filterOptionClicked.getAttribute('data-filter-status')
                            : todoStatuses.DEFAULT);
        
        this.updateFiltersState({todoStatus: filterStatus});                     
    }
}

export {TodoAppState};