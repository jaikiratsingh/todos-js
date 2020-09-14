import {TodoElement} from './TodoElement.js';

class TodoList {
    constructor(todos, todoElementHandlers) {
        this.props = {
            todos,
            todoElementHandlers
        }

        this.todoList = document.querySelector('#todo-list');
        this.todoElements = [];
        
        this.render();
    }

    updateTodosProps = (todos) => {
        this.props.todos = todos;
        this.render();
    }

    render = () => {
        this.todoList.innerHTML = '';
        this.todoElements = [];

        this.props.todos.forEach(todo => {
            const todoElement = new TodoElement(todo, this.props.todoElementHandlers);
            this.todoElements.push(todoElement);
            this.todoList.appendChild(todoElement.getTodoElementNode());
        });
    }
}

export {TodoList};