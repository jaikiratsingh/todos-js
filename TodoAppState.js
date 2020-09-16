import {createTodo, readTodos, updateTodo, deleteTodo} from './mock-functions.js';
import {Todo, todoStatuses, categories, priorities, compareTodos} from './todo-model-functions.js';
import { getFilteredTodos } from './filter-functions.js';
import { FilterPanel } from './View/FilterPanel.js';
import { TodoList } from './View/TodoList.js';
import { CreateTodoWindow } from './View/CreateTodoWindow.js';
import { EditTodoWindow } from './View/EditTodoWindow.js';

class TodoAppState {
    constructor() {
        this.todos = [];
        this.filters = {  
            pattern: '',
            todoStatus: todoStatuses.DEFAULT,
            priorityFilter: priorities.DEFAULT,
            categoryFilter: categories.DEFAULT
        };

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
            openEditWindowHandler: this.openEditWindowHandler
        };

        this.createTodoWindowHandlers = {
            saveTodoHandler: this.saveTodoHandler
        };

        this.editTodoWindowHandlers = {
            updateTodoHandler: this.updateTodoHandler
        }

        this.filterPanel = new FilterPanel(this.filters, this.filterPanelHandlers);
        this.todoList = new TodoList(this.todos, this.todoElementHandlers);
        this.createTodoWindow = new CreateTodoWindow(this.createTodoWindowHandlers);
        this.editTodoWindow = new EditTodoWindow(undefined, this.editTodoWindowHandlers);  // better way to pass 1st prop as undefined
    }
    
    updateTodosState = (todos) => {
        this.todos = todos;
        this.todos.sort(compareTodos);
        this.todoList.updateTodosProps(getFilteredTodos(this.todos, this.filters));
    }

    updateFiltersState = (filterUpdateObject) => {
        this.filters = {
            ...this.filters,
            ...filterUpdateObject
        };
        this.todoList.updateTodosProps(getFilteredTodos(this.todos, this.filters));
        this.filterPanel.updateFiltersProps(this.filters);
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
        deleteTodo(todoID)
            .finally(() => {
                this.getTodosAndDisplay();
            });
    }

    toggleTodoHandler = (todoID) => {
        const todo = this.todos.find(todo => todo.id === todoID);
        updateTodo(todoID, {completed: !todo.completed})
            .finally(() => {
                this.getTodosAndDisplay();
            });
    }

    openEditWindowHandler = (todoID) => {
        const todo = this.todos.find(todo => todo.id === todoID);
        this.editTodoWindow.updateProps({todo, isOpen: true});
    }

    updateTodoHandler = (updatedTodo) => {
        const {id: todoID, ...otherFields} = updatedTodo;  // TODO: is otherFields the correct term ?

        updateTodo(todoID, otherFields)
            .finally(() => {
                this.getTodosAndDisplay();
                this.editTodoWindow.updateProps({isOpen: false});
            });
    }

    saveTodoHandler = ({title, body, priority, category}) => {
        const todo = new Todo(title, body, priority, category);
        createTodo(todo)
            .finally(_ => {
                this.getTodosAndDisplay();
            });
    }

    getTodosAndDisplay = () => {
        readTodos()
        .then(res => res.data)
        .then(todosReceived => {
            this.updateTodosState(todosReceived);
        });
    }
}
export {TodoAppState};