const todos = [];  // store todos here for now

const createTodoWindow = {
    dialog: document.querySelector('.create-todo-dialog'),
    titleInput: document.querySelector('.create-todo-title'),
    bodyArea: document.querySelector('.create-todo-body'),
    saveBtn: document.querySelector('.save-btn'),  // not visible
    discardBtn: document.querySelector('.discard-btn')
};

const backDrop = document.querySelector('.backdrop');

// constructor function for a todo
function Todo(title, body) {
    this.title = title;
    this.body = body;
}

// Saves this todo
Todo.prototype.save = function() {
    todos.push(this);  // TODO: make it asycnhronous and throw error if save is failed
}

// Asynchronous call which fetches Todos
function getTodosAsync() {
    // TODO: make asynchronous call and store the result in todos
    return todos;
}

// returns a todo element
function getTodoElement(todo) {
    const todoElement = document.createElement('div');
    todoElement.classList.add("todo");
    todoElement.innerHTML = `${todo.title}`;
    return todoElement;
}

// display todos
function displayTodos(todos) {
    const todoList = document.querySelector('.todo-list');
    todoList.innerHTML = '';    // TODO: find a better way to do this
    todos.forEach(todo => {
        const todoElement = getTodoElement(todo);
        todoList.appendChild(todoElement);
    });
}

const createTodoBtn = document.querySelector('.create-todo-button');

// function to open the todo dialog
function openCreateTodoDialog() {
    clearForm();
    backDrop.style.display = 'block';
    createTodoWindow.dialog.style.display = 'block';
}

// function to close the todo dialog
function closeCreateTodoDialog() {
    backDrop.style.display = 'none';
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

// clear the contents of the form
function clearForm() {
    createTodoWindow.titleInput.value = '';
    createTodoWindow.bodyArea.value = '';
}

// performs the actions to save the todo
function saveTodoAction() {    // TODO: Find a better name for this
    try {
        const todo = getFormInfo();
        todo.save();
        closeCreateTodoDialog();
    }catch(e) {
        alert(e.message);
    }
    displayTodos(getTodosAsync());
}
createTodoBtn.addEventListener('click', openCreateTodoDialog);

createTodoWindow.saveBtn.addEventListener('click', saveTodoAction);
createTodoWindow.discardBtn.addEventListener('click', closeCreateTodoDialog);
backDrop.addEventListener('click', closeCreateTodoDialog);