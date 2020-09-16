import { todoStatuses, categories, priorities } from "../todo-model-functions";

class TodoElement {
    constructor(todo, todoElementHandlers) {
        /**
         * todoElementHandlers = {deleteTodoHandler, toggleTodoHandler}
         */
        this.props = {
            todo,
            todoElementHandlers
        };
        this.node = this.render();

        this.node.addEventListener('click', this.todoElementClickHandler);
    }

    getTodoElementNode = () => {
        return this.node;
    }

    todoElementClickHandler = (event) => {
        const todoID = this.props.todo.id;

        if(event.target.getAttribute('data-type') === "trash-btn") {
            this.props.todoElementHandlers.deleteTodoHandler(todoID);
        }else if(event.target.getAttribute('data-type') === 'radio-btn') {
            this.props.todoElementHandlers.toggleTodoHandler(todoID);
        }else {
            this.props.todoElementHandlers.openEditWindowHandler(todoID);
        }
    }

    render = () => {
        const todoElement = document.createElement('div');
        todoElement.classList.add('todo');
        if(this.props.todo.completed) {
            todoElement.classList.add('completed');
        }
        todoElement.setAttribute('data-type', 'todo');
        todoElement.setAttribute('data-todo-status', this.props.todo.completed ? todoStatuses.COMPLETED : todoStatuses.PENDING);
        todoElement.setAttribute('data-todo-id', this.props.todo.id);
    
        todoElement.innerHTML = ` 
            <div class="todo__radio ${this.props.todo.completed && 'checked'}" data-type="radio-btn"></div>
            <div class="todo-content">${this.props.todo.title}</div>
            ${categories[this.props.todo.category].indicatorHTML}
            ${priorities[this.props.todo.priority].indicatorHTML}
            <span class="material-icons trash-btn" data-type="trash-btn">delete</span>
        `;
    
        return todoElement;
    }
}

export {TodoElement};