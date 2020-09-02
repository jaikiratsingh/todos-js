const todos = [];  // store todos here for now

const createTodoWindow = {
    dialog: document.querySelector('.create-todo-dialog'),
    titleInput: document.querySelector('.create-todo-title'),
    bodyArea: document.querySelector('.create-todo-body'),
    saveBtn: document.querySelector('.save-btn'),  // not visible
    discardBtn: document.querySelector('.discard-btn')
};

// constructor function for a todo
function Todo(title, body) {
    this.title = title;
    this.body = body;
}

const createTodoBtn = document.querySelector('.create-todo-button');

// function to open the todo dialog
function openCreateTodoDialog() {
    createTodoWindow.dialog.style.display = 'block';
}

// function to close the todo dialog
function closeCreateTodoDialog() {
    createTodoWindow.dialog.style.display = 'none';
}

// gets form information and returns as an object
function getFormInfo() {
    const title = createTodoWindow.titleInput.value || undefined;
    const body = createTodoWindow.bodyArea.value || undefined;

    if(!title) {
        throw new Error("Empty Todo Title");
    }
        
    return new Todo(title, body);
}

// saves the todo
function saveTodo() {
    try {
        const todo = getFormInfo();
        todos.push(todo);
        console.log(todos);
        closeCreateTodoDialog();
    }catch(e) {
        alert(e.message);
    }
}

createTodoBtn.addEventListener('click', openCreateTodoDialog);

createTodoWindow.saveBtn.addEventListener('click', saveTodo);
createTodoWindow.discardBtn.addEventListener('click', closeCreateTodoDialog);
