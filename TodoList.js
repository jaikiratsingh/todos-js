import {createTodoElement} from './view-functions.js';
import {getFilteredTodos} from './filter-functions.js';
import {compareTodos} from './todo-model-functions.js';

function TodoList() {
    this.displayTodos = (todos) => {
        todos.sort(compareTodos);
        const todoList = document.querySelector('.todo-list');
        todoList.innerHTML = '';    // TODO: find a better way to do this
        todos.forEach(todo => {
            const todoElement = createTodoElement(todo);
            todoList.appendChild(todoElement);
        });
    }   

    // apply filters to todos and display them
    this.applyFiltersAndDisplay = (todos, filters) => {
        const filteredTodos = getFilteredTodos(todos, filters);
        this.displayTodos(filteredTodos);
    }
}

export {TodoList};