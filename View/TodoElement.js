import { todoStatuses, categories, priorities } from "../todo-model-functions";

class TodoElement {
    constructor(todo, isSelected, todoElementHandlers) {
        /**
         * todoElementHandlers = {deleteTodoHandler, toggleTodoHandler}
         */
        this.props = {
            todo,
            isSelected,
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

        switch(event.target.getAttribute('data-type')) {
            case 'trash-btn' :
                this.props.todoElementHandlers.deleteTodoHandler(todoID);
                break;
            case 'radio-btn' :
                this.props.todoElementHandlers.toggleTodoHandler(todoID);
                break;
            case 'select-checkbox' :
                this.props.todoElementHandlers.selectTodoHandler(todoID);
                event.preventDefault();
                break;
            default :
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

        const todoWrapper = document.createElement("div");
        todoWrapper.classList.add("todo__wrapper");
        todoWrapper.appendChild(todoElement);

        const selectTodoRadio = document.createElement("input");
        selectTodoRadio.classList.add("todo__select");
        selectTodoRadio.checked = this.props.isSelected;
        selectTodoRadio.setAttribute('data-type', 'select-checkbox');
        selectTodoRadio.type = "checkbox";

        if(selectTodoRadio.checked === false) {
            todoWrapper.addEventListener('mouseenter', () => {
                selectTodoRadio.style.display = 'block';
            });
    
            todoWrapper.addEventListener('mouseleave', () => {
                selectTodoRadio.style.display = 'none';
            });
        }else {
            selectTodoRadio.style.display = 'block';
        }

        todoWrapper.appendChild(selectTodoRadio);
    
        return todoWrapper;
    }
}

export {TodoElement};