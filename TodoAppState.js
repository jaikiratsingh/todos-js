import {createTodo, readTodos, updateTodo, deleteTodo} from './mock-functions.js';
import {Todo, todoStatuses, categories, priorities, compareTodos} from './todo-model-functions.js';
import { getFilteredTodos } from './filter-functions.js';
import { FilterPanel } from './View/FilterPanel.js';
import { TodoList } from './View/TodoList.js';
import { CreateTodoWindow } from './View/CreateTodoWindow.js';

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
            toggleTodoHandler: this.toggleTodoHandler
        };

        this.createTodoWindowHandlers = {
            saveTodoHandler: this.saveTodoHandler
        };

        this.filterPanel = new FilterPanel(this.filters, this.filterPanelHandlers);
        this.todoList = new TodoList(this.todos, this.todoElementHandlers);
        this.createTodoWindow = new CreateTodoWindow(this.createTodoWindowHandlers);
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