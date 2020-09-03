const createTodoWindow = {
    dialog: document.querySelector('.create-todo-dialog'),
    titleInput: document.querySelector('.create-todo-title'),
    bodyArea: document.querySelector('.create-todo-body'),
    saveBtn: document.querySelector('.save-btn'),  // not visible
    discardBtn: document.querySelector('.discard-btn')
};

const backDrop = document.querySelector('.backdrop');
const createTodoBtn = document.querySelector('.create-todo-button');
const todoListItem = document.querySelector('.todo-list');

// returns a todo element
function createTodoElement(todo) {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    if(todo.completed) {
        todoElement.classList.add('completed');
    }
    todoElement.setAttribute('data-todo-id', todo.id);

    todoElement.innerHTML = `
        <div class="todo-content">${todo.title}</div>
        <span class="material-icons edit-btn">edit</span>
        <span class="material-icons trash-btn">delete</span>
    `;

    return todoElement;
}

// display todos
function displayTodos(todos) {
    const todoList = document.querySelector('.todo-list');
    todoList.innerHTML = '';    // TODO: find a better way to do this
    todos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
}

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
function saveTodoElement() {    // TODO: Find a better name for this
    try {
        const todo = getFormInfo();
        todo.saveTodo();
        closeCreateTodoDialog();
    }catch(e) {
        alert(e.message);
    }
    displayTodos(getTodosAsync());
}

// performs the actions to delete a todo based on it's id
function deleteTodoElement(todoID) {
    try {
        const todo = todos.filter(todo => todo.id === todoID)[0];
        todo.deleteTodo();  // may throw an error
        displayTodos(getTodosAsync());
    }catch(e) {
        alert(e.message);
    }
}

// toggle a todo's selection
function toggleTodoSelection(todoElement) {
    try {
        const todoID = todoElement.getAttribute('data-todo-id');
        const todo = todos.filter(todo => todo.id === todoID)[0];
        todo.toggleTodo();
        displayTodos(getTodosAsync());
    }catch(e) {
        alert(e.message);
    }
}

// handle click event in todo list
function handleTodoListClick(event) {
    const todoElement = event.target.closest('.todo');
    if(!todoElement || !todoListItem.contains(todoElement)) {
        throw new Error("Something unexpected has happened here");
    }

    if(event.target.classList.contains("trash-btn")) {
        deleteTodoElement(todoElement.getAttribute('data-todo-id'));
    }else if(event.target.classList.contains("edit-btn")) {
        // do something
    }else {
        toggleTodoSelection(todoElement);
    }
}

displayTodos(getTodosAsync());
createTodoBtn.addEventListener('click', openCreateTodoDialog);
createTodoWindow.saveBtn.addEventListener('click', saveTodoElement);
createTodoWindow.discardBtn.addEventListener('click', closeCreateTodoDialog);
backDrop.addEventListener('click', closeCreateTodoDialog);
todoListItem.addEventListener('click', handleTodoListClick)