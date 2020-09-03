const todos = [
    {
        title: 'make tea'
    },
    {
        title: 'go to the grocery store'
    }
];  // store todos here for now

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

// constructor function for a todo
function Todo(title, body) {
    this.id = uuid(),
    this.title = title;
    this.body = body;
}

// Saves this todo
Todo.prototype.saveTodo = function() {
    todos.push(this);  // TODO: make it asycnhronous and throw error if save is failed
}

Todo.prototype.deleteTodo = function() {
    todos.splice(todos.indexOf(this), 1);  // TODO: Make this asynchronous and throw an error if failed
}

// Asynchronous call which fetches Todos
function getTodosAsync() {
    // TODO: make asynchronous call and store the result in todos
    return todos;
}

// returns a todo element
function createTodoElement(todo) {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo');
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

// handle click event in todo list
function handleTodoListClick(event) {
    const todoElement = event.target.closest('.todo');
    if(!todoElement || !todoListItem.contains(todoElement)) {
        throw new Error("Something unexpected has happened here");
    }

    if(event.target.classList.contains("trash-btn")) {
        deleteTodoElement(todoElement.getAttribute('data-todo-id'));
    }
}

displayTodos(getTodosAsync());
createTodoBtn.addEventListener('click', openCreateTodoDialog);
createTodoWindow.saveBtn.addEventListener('click', saveTodoElement);
createTodoWindow.discardBtn.addEventListener('click', closeCreateTodoDialog);
backDrop.addEventListener('click', closeCreateTodoDialog);
todoListItem.addEventListener('click', handleTodoListClick)