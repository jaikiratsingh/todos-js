import {createTodo, readTodos, updateTodo, deleteTodo} from './mock-functions.js';
import {Todo, todoStatuses, categories, priorities, compareTodos} from './todo-model-functions.js';
import { getFilteredTodos } from './filter-functions.js';
import { FilterPanel } from './View/FilterPanel.js';
import { TodoList } from './View/TodoList.js';
import { CreateTodoWindow } from './View/CreateTodoWindow.js';
import { DocumentListeners } from './View/DocumentListeners.js';
import {actions} from './actions.js';

class TodoAppState {
    constructor() {
        this.history = [{
            todos: [],
            filters: {  
                pattern: '',
                todoStatus: todoStatuses.DEFAULT,
                priorityFilter: priorities.DEFAULT,
                categoryFilter: categories.DEFAULT
            },
            diff: {
                action: actions.NONE,
                payload: null
            }
        }];  // to store histories
        this.currentIndexState = 0;

        this.filterPanelHandlers = {
            filterStatusChangedHandler: this.filterStatusChangedHandler,
            searchPatternChangedHandler: this.searchPatternChangedHandler,
            priorityChangedHandler: this.priorityChangedHandler,
            categoryChangedHandler: this.categoryChangedHandler,
            clearFiltersHandler: this.clearFiltersHandler
        };

        this.todoElementHandlers = {
            deleteTodoHandler: this.deleteTodoHandler,
            toggleTodoHandler: this.toggleTodoHandler
        };

        this.createTodoWindowHandlers = {
            saveTodoHandler: this.saveTodoHandler
        };

        this.documentListeners = new DocumentListeners({
            undoHandler: this.undoHandler,
            redoHandler: this.redoHandler
        });

        this.filterPanel = new FilterPanel(this.getCurrentStateFilters(), this.filterPanelHandlers);
        this.todoList = new TodoList(this.getCurrentStateTodos(), this.todoElementHandlers);
        this.createTodoWindow = new CreateTodoWindow(this.createTodoWindowHandlers);
    }

    getCurrentStateTodos = () => {
        return this.history[this.currentIndexState].todos;
    }

    getCurrentStateFilters = () => {
        return this.history[this.currentIndexState].filters;
    }
    
    updateTodosState = (todos, diff) => {
        todos.sort(compareTodos);

        const action = (diff !== undefined) ? diff.action : null;
        const payload = (diff !== undefined) ? diff.payload : null;

        // hold latest filter state
        const filterState = this.getCurrentStateFilters();

        // delete undo-ed states
        this.history = this.history.filter((state, index) => index <= this.currentIndexState);
        // add a new state
        this.history = [...this.history, {
            todos: [...todos],
            filters: {...filterState},
            diff: {
                action,
                payload
            }
        }];
        // update counter
        this.currentIndexState = this.currentIndexState + 1;
        this.todoList.updateTodosProps(getFilteredTodos(this.getCurrentStateTodos(), this.getCurrentStateFilters()));
    }

    updateFiltersState = (filterUpdateObject) => {
        const todoState = this.getCurrentStateTodos();
        const filterState = this.getCurrentStateFilters();

        // delete undo-ed states
        this.history = this.history.filter((state, index) => index <= this.currentIndexState);
        // add a new state
        this.history = [...this.history, {
            todos: [...todoState],  // do we need a deep copy here ??
            filters: {...filterState, ...filterUpdateObject},
            diff: {
                action: actions.NONE,
                payload: null
            }

        }];
        // update counter
        this.currentIndexState = this.currentIndexState + 1;

        this.todoList.updateTodosProps(getFilteredTodos(this.getCurrentStateTodos(), this.getCurrentStateFilters()));
        this.filterPanel.updateFiltersProps(this.getCurrentStateFilters());
    }

    updateCurrentIndexState = (pointerIndex) => {
        this.currentIndexState = pointerIndex;

        this.todoList.updateTodosProps(getFilteredTodos(this.getCurrentStateTodos(), this.getCurrentStateFilters()));
        this.filterPanel.updateFiltersProps(this.getCurrentStateFilters());
    }

    undoHandler = () => {
        const newIndex = this.currentIndexState - 1;

        if(newIndex === 0) {
            return ;
        }
        
        // perform inverse action of current state action
        const {action: currAction, payload} = this.history[this.currentIndexState].diff;
        
        switch(currAction.inverse) {
            case actions.NONE.name :
                break;
            case actions.ADD.name :
                createTodo(payload).then(() => {
                    // do nothing
                }).catch(() => {
                    // undo failed. handle later
                });
                break;
            case actions.UPDATE.name :
                const {id: todoID, ...todoWithoutID} = payload;
                updateTodo(todoID, todoWithoutID).then(() => {
                    // do nothing
                }).catch(() => {
                    // update failed. handle later
                });
                break;
            case actions.DELETE.name :
                deleteTodo(payload.id).then(() => {
                    // do nothing
                }).catch(() => {
                    // undo failed. handle later
                });
                break;
            default :
                break;
        }

        this.updateCurrentIndexState(newIndex);
    }

    redoHandler = () => {
        const newIndex = this.currentIndexState + 1;

        if(newIndex === this.history.length) {
            return ;
        }

        // perform inverse action of current state action
        const {action: currAction, payload} = this.history[newIndex].diff;

        switch(currAction.name) {
            case actions.NONE.name :
                break;
            case actions.ADD.name :
                createTodo(payload).then(() => {
                    // do nothing
                }).catch(() => {
                    // undo failed. handle later
                });
                break;
            case actions.UPDATE.name :
                const {id: todoID, ...todoWithoutID} = payload;
                updateTodo(todoID, todoWithoutID).then(() => {
                    // do nothing
                }).catch(() => {
                    // update failed. handle later
                });
                break;
            case actions.DELETE.name :
                deleteTodo(payload.id).then(() => {
                    // do nothing
                }).catch(() => {
                    // undo failed. handle later
                });
                break;
            default :
                break;
        }

        this.updateCurrentIndexState(newIndex);
    }

    filterStatusChangedHandler = (filterStatus) => {
        this.updateFiltersState({todoStatus: filterStatus});
    }

    searchPatternChangedHandler = (patternToMatch) => {
        this.updateFiltersState({pattern: patternToMatch});
    }

    priorityChangedHandler = (priorityKey) => {
        this.updateFiltersState({priorityFilter: priorities[priorityKey]});
    }

    categoryChangedHandler = (categoryKey) => {
        this.updateFiltersState({categoryFilter: categories[categoryKey]});
    }

    clearFiltersHandler = () => {
        this.updateFiltersState({
            pattern: '',
            todoStatus: todoStatuses.DEFAULT,
            priorityFilter: priorities.DEFAULT,
            categoryFilter: categories.DEFAULT
        });
    }

    deleteTodoHandler = (todoID) => {
        const todo = this.getCurrentStateTodos().find(todo => todo.id === todoID);
        
        deleteTodo(todoID)
            .finally(() => {
                this.getTodosAndDisplay({
                    action: actions.DELETE,
                    payload: todo
                });
            });
    }

    toggleTodoHandler = (todoID) => {
        const todo = this.getCurrentStateTodos().find(todo => todo.id === todoID);
        updateTodo(todoID, {completed: !todo.completed})
            .finally(() => {
                this.getTodosAndDisplay({
                    action: actions.UPDATE,
                    payload: todo
                });
            });
    }

    saveTodoHandler = ({title, body, priority, category}) => {
        const todo = new Todo(title, body, priority, category);
        createTodo(todo)
            .finally(_ => {
                this.getTodosAndDisplay({
                    action: actions.ADD,
                    payload: todo
                });
            });
    }

    getTodosAndDisplay = (diff) => {
        readTodos()
        .then(res => res.data)
        .then(todosReceived => {
            this.updateTodosState(todosReceived, diff);
        });
    }
}
export {TodoAppState};