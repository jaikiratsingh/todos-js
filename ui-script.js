const createTodoWindow = {
    dialog: document.querySelector('.create-todo-dialog'),
    titleInput: document.querySelector('.create-todo-title'),
    bodyArea: document.querySelector('.create-todo-body'),
    prioritySelect: document.querySelector('.todo-options .priority-choices'),
    categorySelect: document.querySelector('.todo-options .category-choices'),
    saveBtn: document.querySelector('.save-btn'),  // not visible
    discardBtn: document.querySelector('.discard-btn')
};

const filterTodosWindow = {
    dialog: document.querySelector('.filter-todos-dialog'),
    prioritySelect: document.querySelector('.filter-options .priority-choices'),
    categorySelect: document.querySelector('.filter-options .category-choices'),
    applyFiltersBtn: document.querySelector('.apply-filter-btn'),
    clearFiltersBtn: document.querySelector('.clear-filter-btn')
}

const searchBarInput = document.querySelector('.searchbar input');
const backDrop = document.querySelector('.backdrop');
const createTodoBtn = document.querySelector('.create-todo-button');
const filterTodosBtn = document.querySelector('.filter-todos-button');
const todoListItem = document.querySelector('.todo-list');

// returns a todo element
function createTodoElement(todo) {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    if(todo.completed) {
        todoElement.classList.add('completed');
    }
    todoElement.setAttribute('data-todo-id', todo.id);

    let priorityIndicatorHTML;
    switch(todo.priority) {
        case priorities.NO :
            priorityIndicatorHTML = '';
            break;
        case priorities.LOW :
            priorityIndicatorHTML = `<span class="priority-indicator low">!</span>`;
            break;
        case priorities.MEDIUM :
            priorityIndicatorHTML = `<span class="priority-indicator medium">!!</span>`;
            break;
        case priorities.HIGH :
            priorityIndicatorHTML = `<span class="priority-indicator high">!!!</span>`;
            break;
    }

    todoElement.innerHTML = `
        <div class="todo-content">${todo.title}</div>
        ${priorityIndicatorHTML}
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

// gets todos from api and displays them
function getTodosAndDisplay() {
    readTodos()
        .then(res => res.data)
        .then(todosReceived => {
            todos = todosReceived;
            const filteredTodos = getFilteredTodos(todos);
            displayTodos(filteredTodos);
        })
        .catch(e => {
            alert(e.message);
        });
}

// apply filters to todos
function getFilteredTodos(todos) {
    let filteredTodos = todos;
    const selectedPriorityFilterValue = filterTodosWindow.prioritySelect.value;
    const selectedCategoryFilterValue = filterTodosWindow.categorySelect.value;

    if(selectedPriorityFilterValue !== priorities.NO) {
        filteredTodos = filteredTodos.filter(todo => todo.priority === selectedPriorityFilterValue);
    }

    if(selectedCategoryFilterValue !== categories.NO) {
        filteredTodos = filteredTodos.filter(todo => todo.category === selectedCategoryFilterValue);
    }

    return filteredTodos;
}

// find matching todos according to regex
function findMatchesTodo(todoTitlePattern, todos) {
    const regex = new RegExp(todoTitlePattern, 'gi');
    return todos.filter(todo => todo.title.match(regex));
}

// clear the contents of the filter dialog
function clearFilterForm() {
    searchBarInput.value = "";
    filterTodosWindow.prioritySelect.value = priorities.NO;
    filterTodosWindow.categorySelect.value = 'default';
}

// gets form information and returns as an object
function getFormInfo() {
    const title = createTodoWindow.titleInput.value;
    const body = createTodoWindow.bodyArea.value;
    const category = createTodoWindow.categorySelect.value;
    const priority = createTodoWindow.prioritySelect.value;

    if(!title) {
        throw new Error("Empty Todo Title");
    }
        
    return new Todo(title, body, priority, category);
}

// clear the contents of the form
function clearCreateTodosForm() {
    createTodoWindow.titleInput.value = '';
    createTodoWindow.bodyArea.value = '';
    createTodoWindow.prioritySelect.value = priorities.NO;
    createTodoWindow.categorySelect.value = 'default';
}

// performs the actions to delete a todo based on it's id
function deleteTodoElement(todoID) {
    deleteTodo(todoID)
        .then(res => {
            getTodosAndDisplay();
        })
        .catch(e => {
            alert(e.message);
        });
}

// toggle a todo's selection
function toggleTodoSelection(todoElement) {
    const todoID = todoElement.getAttribute('data-todo-id');
    const [todo] = todos.filter(todo => todo.id === todoID);
    
    updateTodo(todoID, {completed: !todo.completed})
        .then(res => {
            getTodosAndDisplay();
        }).catch(e => {
            alert(e.message);
        });
}

getTodosAndDisplay();

searchBarInput.addEventListener('keyup', searchPatternHandler);

createTodoBtn.addEventListener('click', openCreateTodoDialog);
filterTodosBtn.addEventListener('click', openFilterTodosDialog);

createTodoWindow.saveBtn.addEventListener('click', saveTodoElement);
createTodoWindow.discardBtn.addEventListener('click', closeCreateTodoDialog);

todoListItem.addEventListener('click', handleTodoListClick);

filterTodosWindow.applyFiltersBtn.addEventListener('click', applyFiltersHandler);
filterTodosWindow.clearFiltersBtn.addEventListener('click', clearFiltersHandler);

backDrop.addEventListener('click', () => {
    closeCreateTodoDialog();
    closeFilterTodosDialog();
});
