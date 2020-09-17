import { categories, priorities } from "../todo-model-functions";

class EditTodoWindow {
    constructor(props, editTodoWindowHandlers) {
        this.props = {
            todo: (props ? props.todo : undefined),   // todo used to populate the window
            isOpen : (props ? props.isOpen : undefined)  // should open the window or not
        }

        this.node = null;  // node pointing to the actual DOM element
        this.editTodoWindowHandlers = editTodoWindowHandlers;

        this.backDrop = this.createBackDrop();

        this.render();
        this.backDrop.addEventListener('click', this.removeEditWindow);
    }

    // resets node pointer
    resetWindow = () => {
        this.node = null;
    }

    // creates a backdrop for when the window appears
    createBackDrop = () => {
        const backDrop = document.createElement('div');
        backDrop.id = 'backdrop';
        backDrop.classList.add('backdrop');
        return backDrop;
    }

    // updates the props and re-renders the window
    updateProps = ({todo, isOpen}) => {
        this.props = {
            todo, isOpen
        };
        this.render();
    }

    // renders the window according to the props received
    render = () => {    
        if(this.props.isOpen) {
            this.showPopulateEditWindow();
        }else {
            this.removeEditWindow();
        }
    }

    // Shows and Populates the Window according to the Props
    showPopulateEditWindow = () => {
        // create node
        this.node = this.createDisplayWindow();

        // populate
        this.populateEditWindow();

        document.body.appendChild(this.backDrop);
        this.backDrop.style.display = 'block';
        document.body.appendChild(this.node);
    }

    // Populate the window
    populateEditWindow = () => {
        const editTodoTitle = this.node.querySelector('#edit-todo-title');
        editTodoTitle.value = this.props.todo.title || '';

        const editTodoBody = this.node.querySelector('#edit-todo-body');
        editTodoBody.value = this.props.todo.body || '';

        const selectPriorityOptions = this.node.querySelector('#edit-todo-priority-choices');
        for(const priority in priorities) {
            const option = document.createElement('option');
            option.value = priorities[priority].key;
            option.text = priorities[priority].value;

            if(this.props.todo.priority === priority) {
                option.selected = true;
            }
            
            selectPriorityOptions.add(option);
        }

        const selectCategoryOptions = this.node.querySelector('#edit-todo-category-choices');
        for(const category in categories) {
            const option = document.createElement('option');
            option.value = categories[category].key;
            option.text = categories[category].value;

            if(category === this.props.todo.category) {
                option.selected = true;
            }
            
            selectCategoryOptions.add(option);
        }
    }

    // event handler for when the save button is clicked
    updateBtnClickHandler = () => {
        const title = this.node.querySelector('#edit-todo-title').value;
        const body = this.node.querySelector('#edit-todo-body').value;
        const category = this.node.querySelector('#edit-todo-category-choices').value;
        const priority = this.node.querySelector('#edit-todo-priority-choices').value;

        this.editTodoWindowHandlers.updateTodoHandler({
            id: this.props.todo.id, title, body, category, priority
        });
    }

    // removes the window from the DOM
    removeEditWindow = () => {
        if(this.node) {
            document.body.removeChild(this.node);
            document.body.removeChild(this.backDrop);
            this.resetWindow();
        }
    }

    // creates the DOM structure for the window and assigns Event Handlers
    createDisplayWindow = () => {
        const editTodoDialog = document.createElement("div");
        editTodoDialog.id = "edit-todo-dialog";
        editTodoDialog.classList.add("edit-window");

        const editTodoTitle = document.createElement("input");
        editTodoTitle.type = "text";
        editTodoTitle.id = "edit-todo-title";
        editTodoTitle.classList.add("create-todo-title");

        editTodoDialog.appendChild(editTodoTitle); 
        editTodoDialog.appendChild(document.createElement('hr'));

        const todoEditOptions = document.createElement("div");
        todoEditOptions.classList.add("todo-options");

        const priorityOptions = document.createElement('div');
        priorityOptions.classList.add("todo-option");
        priorityOptions.classList.add("priority-options");

        const flagIcon = document.createElement("span");
        flagIcon.classList.add("material-icons");
        flagIcon.innerHTML = "flag";
        priorityOptions.appendChild(flagIcon);

        const selectPriorityOptions = document.createElement("select");
        selectPriorityOptions.id = "edit-todo-priority-choices";
        selectPriorityOptions.classList.add("priority-choices");
        priorityOptions.appendChild(selectPriorityOptions);

        todoEditOptions.appendChild(priorityOptions);

        const categoryOptions = document.createElement('div');
        categoryOptions.classList.add("todo-option");
        categoryOptions.classList.add("category-options");

        const inboxIcon = document.createElement("span");
        inboxIcon.classList.add("material-icons");
        inboxIcon.innerHTML = "inbox";
        categoryOptions.appendChild(inboxIcon);

        const selectCategoryOptions = document.createElement("select");
        selectCategoryOptions.id = "edit-todo-category-choices";
        selectCategoryOptions.classList.add("category-choices");
        categoryOptions.appendChild(selectCategoryOptions);

        todoEditOptions.appendChild(categoryOptions);

        editTodoDialog.appendChild(todoEditOptions);

        editTodoDialog.appendChild(document.createElement('hr'));

        const editTodoBody = document.createElement("textarea");
        editTodoBody.id = "edit-todo-body";
        editTodoBody.classList.add("edit-todo-body");

        editTodoDialog.appendChild(editTodoBody);

        const buttonDiv = document.createElement('div');
        buttonDiv.classList.add("buttons");

        const updateBtn = document.createElement('div');
        updateBtn.id = "edit-todo-save-btn";
        updateBtn.innerText = 'Update';
        updateBtn.classList.add("save-btn");
        buttonDiv.appendChild(updateBtn);

        const discardBtn = document.createElement('div');
        discardBtn.id = 'edit-todo-discard-btn';
        discardBtn.innerText = 'Discard';
        discardBtn.classList.add('discard-btn');
        buttonDiv.appendChild(discardBtn);

        editTodoDialog.appendChild(buttonDiv);


        updateBtn.addEventListener('click', this.updateBtnClickHandler);
        discardBtn.addEventListener('click', this.removeEditWindow);

        return editTodoDialog;
    }
}

export {EditTodoWindow};