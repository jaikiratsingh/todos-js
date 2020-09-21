import {TodoElement} from './TodoElement.js';

class TodoList {
    constructor(todos, selectedTodos, todoElementHandlers) {
        this.props = {
            todos,
            selectedTodos,
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

    updateSelectedTodosProps = (todoIDs) => {
        this.props.selectedTodos = todoIDs;
        this.render();
    }

    render = () => {
        this.todoList.innerHTML = '';
        this.todoElements = [];

        this.props.todos.forEach(todo => {
            const isSelected = this.props.selectedTodos.includes(todo.id);
            const todoElement = new TodoElement(todo, isSelected, this.props.todoElementHandlers);
            this.todoElements.push(todoElement);
            this.todoList.appendChild(todoElement.getTodoElementNode());
        });
    }
}

export {TodoList};