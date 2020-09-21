import {createTodo, readTodos, updateTodo, deleteTodo, deleteBulkTodos, updateBulkTodos, createBulkTodos} from './mock-functions.js';
import {Todo, todoStatuses, categories, priorities, compareTodos} from './todo-model-functions.js';
import { getFilteredTodos } from './filter-functions.js';
import { FilterPanel } from './View/FilterPanel.js';
import { TodoList } from './View/TodoList.js';
import { CreateTodoWindow } from './View/CreateTodoWindow.js';
import { EditTodoWindow } from './View/EditTodoWindow.js';
import { DocumentListeners } from './View/DocumentListeners.js';
import {actions} from './actions.js';
import { BulkActions } from './View/BulkActions.js';

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
        this.selectedTodos = [];

        this.filterPanelHandlers = {
            filterStatusChangedHandler: this.filterStatusChangedHandler,
            searchPatternChangedHandler: this.searchPatternChangedHandler,
            priorityChangedHandler: this.priorityChangedHandler,
            categoryChangedHandler: this.categoryChangedHandler,
            clearFiltersHandler: this.clearFiltersHandler
        };

        this.todoElementHandlers = {
            deleteTodoHandler: this.deleteTodoHandler,
            toggleTodoHandler: this.toggleTodoHandler,
            openEditWindowHandler: this.openEditWindowHandler,
            selectTodoHandler: this.selectTodoHandler
        };

        this.createTodoWindowHandlers = {
            saveTodoHandler: this.saveTodoHandler
        };

        this.editTodoWindowHandlers = {
            updateTodoHandler: this.updateTodoHandler
        }

        this.documentListeners = new DocumentListeners({
            undoHandler: this.undoHandler,
            redoHandler: this.redoHandler
        });

        this.filterPanel = new FilterPanel(this.getCurrentStateFilters(), this.filterPanelHandlers);
        this.todoList = new TodoList(this.getCurrentStateTodos(), this.selectedTodos, this.todoElementHandlers);
        this.createTodoWindow = new CreateTodoWindow(this.createTodoWindowHandlers);
        this.editTodoWindow = new EditTodoWindow(undefined, this.editTodoWindowHandlers);  // better way to pass 1st prop as undefined
        this.bulkActions = new BulkActions(this.selectedTodos.length !== 0, {
            deleteBulkListener: this.deleteBulkListener,
            markCompleteBulkListener: this.markCompleteBulkListener
        });
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

        const newTodos = todos.map(todo => ({...todo}));  // use lodash to make deep copy

        this.history = [...this.history, {
            todos: newTodos,
            filters: {...filterState},
            diff: {
                action,
                payload
            }
        }];
        this.updateSelectedTodos([]);
        // update counter
        this.currentIndexState = this.currentIndexState + 1;
        this.todoList.updateTodosProps(getFilteredTodos(this.getCurrentStateTodos(), this.getCurrentStateFilters()));
    }

    updateFiltersState = (filterUpdateObject) => {
        const todoState = this.getCurrentStateTodos();
        const filterState = this.getCurrentStateFilters();

        const newTodos = todoState.map(todo => ({...todo}));  // use lodash to make deep copy

        // delete undo-ed states
        this.history = this.history.filter((state, index) => index <= this.currentIndexState);
        // add a new state
        this.history = [...this.history, {
            todos: newTodos,  // do we need a deep copy here ??
            filters: {...filterState, ...filterUpdateObject},
            diff: {
                action: actions.NONE,
                payload: null
            }

        }];
        // update counter
        this.currentIndexState = this.currentIndexState + 1;
        this.updateSelectedTodos([]);

        this.todoList.updateTodosProps(getFilteredTodos(this.getCurrentStateTodos(), this.getCurrentStateFilters()));
        this.filterPanel.updateFiltersProps(this.getCurrentStateFilters());
    }

    updateCurrentIndexState = (pointerIndex) => {
        this.currentIndexState = pointerIndex;

        this.todoList.updateTodosProps(getFilteredTodos(this.getCurrentStateTodos(), this.getCurrentStateFilters()));
        this.filterPanel.updateFiltersProps(this.getCurrentStateFilters());
    }

    updateSelectedTodos = (selectedTodos) => {
        this.selectedTodos = selectedTodos;
        this.todoList.updateSelectedTodosProps(this.selectedTodos);
        this.bulkActions.updateVisibilityProps(this.selectedTodos.length !== 0);
    }

    deleteBulkListener = () => {
        const selectedTodos = this.selectedTodos.map(todoID => this.getCurrentStateTodos().find(todo => todo.id === todoID));

        deleteBulkTodos(this.selectedTodos).then(() => {
            this.getTodosAndDisplay({
                action: actions.DELETE_BULK,
                payload: selectedTodos
            });
        });
    }

    markCompleteBulkListener = () => {
        const selectedTodos = this.selectedTodos.map(todoID => this.getCurrentStateTodos().find(todo => todo.id === todoID));

        const updateTodosObject = this.selectedTodos.map(todoID => ({id: todoID, completed: true}));

        updateBulkTodos(updateTodosObject).then(() => {
            this.getTodosAndDisplay({
                action: actions.UPDATE_BULK,
                payload: selectedTodos
            });
        });
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
                this.updateCurrentIndexState(newIndex);
                break;
            case actions.ADD.name :
                createTodo(payload).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // undo failed. handle later
                });
                break;
            case actions.UPDATE.name :
                const {id: todoID, ...todoWithoutID} = payload;
                updateTodo(todoID, todoWithoutID).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // update failed. handle later
                });
                break;
            case actions.DELETE.name :
                deleteTodo(payload.id).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // undo failed. handle later
                });
                break;
            case actions.ADD_BULK.name :
                createBulkTodos(payload).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // undo failed, handle later
                })
                break;
            case actions.UPDATE_BULK.name :
                updateBulkTodos(payload).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // undo failed, try later
                });
                break;
            default :
                throw new Error("Problem");
        }
    }

    redoHandler = () => {
        const newIndex = this.currentIndexState + 1;

        if(newIndex === this.history.length) {
            return ;
        }

        // perform inverse action of current state action
        const {action: nextAction, payload} = this.history[newIndex].diff;

        switch(nextAction.name) {
            case actions.NONE.name :
                this.updateCurrentIndexState(newIndex);
                break;
            case actions.ADD.name :
                createTodo(payload).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // undo failed. handle later
                });
                break;
            case actions.UPDATE.name :
                const {id: todoID, ...todoWithoutID} = payload;
                updateTodo(todoID, todoWithoutID).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // update failed. handle later
                });
                break;
            case actions.DELETE.name :
                deleteTodo(payload.id).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // undo failed. handle later
                });
                break;
            case actions.DELETE_BULK.name :
                deleteBulkTodos(payload).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // undo failed. handle later
                });
                break;
            case actions.UPDATE_BULK.name :
                updateBulkTodos(payload).then(() => {
                    // do nothing
                    this.updateCurrentIndexState(newIndex);
                }).catch(() => {
                    // undo failed, try later
                });
                break;
            default :
                break;
        }
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
                    payload: {
                        ...todo,
                        completed: !todo.completed
                    }
                });
            });
    }

    openEditWindowHandler = (todoID) => {
        const todo = this.getCurrentStateTodos().find(todo => todo.id === todoID);
        this.editTodoWindow.updateProps({todo, isOpen: true});
    }

    updateTodoHandler = (updatedTodo) => {
        const {id: todoID, ...otherFields} = updatedTodo;  // TODO: is otherFields the correct term ?

        updateTodo(todoID, otherFields)
            .finally(() => {
                this.getTodosAndDisplay({
                    action: actions.UPDATE,
                    payload: updatedTodo
                });
                this.editTodoWindow.updateProps({isOpen: false});
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

    selectTodoHandler = (todoID) => {
        if(this.selectedTodos.includes(todoID)) {
            const newSelectedTodosList = this.selectedTodos.filter(selectedTodoID => selectedTodoID !== todoID);
            this.updateSelectedTodos(newSelectedTodosList);
        }else {
            this.updateSelectedTodos([...this.selectedTodos, todoID]);
        }
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