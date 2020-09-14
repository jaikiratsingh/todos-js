import {priorities, categories} from '../todo-model-functions.js';

class CreateTodoWindow {
    constructor(createTodoWindowHandlers) {
        /**
         * createTodoWindowHandlers = {saveTodoHandler}
         */
        this.createTodoBtn = document.querySelector('#create-todo-btn');

        this.dialog = document.querySelector('#create-todo-dialog');
        this.titleInput = document.querySelector('#create-todo-title');
        this.bodyArea = document.querySelector('#create-todo-body');
        this.prioritySelect = document.querySelector('#create-todo-priority-choices');
        this.categorySelect = document.querySelector('#create-todo-category-choices');
        this.saveBtn = document.querySelector('#create-todo-save-btn');
        this.discardBtn = document.querySelector('#create-todo-discard-btn');

        this.backDrop = document.querySelector('#backdrop');

        this.createTodoWindowHandlers = createTodoWindowHandlers;
        
        this.addCreateTodoEventHandlers();

        this.render();
    }

    render = () => {
        for(const priority in priorities) {
            const option = document.createElement('option');
            option.value = priorities[priority].key;
            option.text = priorities[priority].value;

            if(priority === priorities.DEFAULT) {
                option.selected = true;
                option.disabled = true;
            }
            
            this.prioritySelect.add(option);
        }

        for(const category in categories) {
            const option = document.createElement('option');
            option.value = categories[category].key;
            option.text = categories[category].value;

            if(category === categories.DEFAULT) {
                option.selected = true;
                option.disabled = true;
            }
            
            this.categorySelect.add(option);
        }
    }

    addCreateTodoEventHandlers = () => {
        this.createTodoBtn.addEventListener('click', this.openCreateTodoDialog);
        this.saveBtn.addEventListener('click', this.saveBtnClickedHandler);
        this.discardBtn.addEventListener('click', this.discardBtnClickedHandler);
        this.backDrop.addEventListener('click', this.discardBtnClickedHandler);
    }

    saveBtnClickedHandler = () => {
        const title = this.titleInput.value;
        const body = this.bodyArea.value;
        const category = this.categorySelect.value;
        const priority = this.prioritySelect.value;

        this.clearCreateTodosForm();

        this.createTodoWindowHandlers.saveTodoHandler({
            title, body, category, priority
        });

        this.closeCreateTodoDialog();
    }

    discardBtnClickedHandler = () => {
        this.clearCreateTodosForm();
        this.closeCreateTodoDialog();
    }

    // clear the contents of the form
    clearCreateTodosForm = (priority = priorities.DEFAULT, category = categories.DEFAULT) => {
        this.titleInput.value = '';
        this.bodyArea.value = '';
        this.prioritySelect.value = priority.key;
        this.categorySelect.value = category.key;
    }

    // function to open the todo dialog
    openCreateTodoDialog = () => {
        this.backDrop.style.display = 'block';
        this.dialog.style.display = 'block';
    }

    // function to close the todo dialog
    closeCreateTodoDialog = () => {
        this.backDrop.style.display = 'none';
        this.dialog.style.display = 'none';
    }
}

export {CreateTodoWindow};