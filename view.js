const createTodoWindow = {
    dialog: document.querySelector('.create-todo'),
    titleInput: document.querySelector('.create-todo-title'),
    bodyArea: document.querySelector('.create-todo-body'),
    prioritySelect: document.querySelector('.todo-options .priority-choices'),
    categorySelect: document.querySelector('.todo-options .category-choices'),
    saveBtn: document.querySelector('.save-btn'),  // not visible
    discardBtn: document.querySelector('.discard-btn')
};

const filterTodosWindow = {
    searchBarInput: document.querySelector('.searchbar input'),
    filterStatusPanel: document.querySelector('.filter-options__section--2'),
    prioritySelect: document.querySelector('.filter-option__select--priority'),
    categorySelect: document.querySelector('.filter-option__select--category'),
    clearFiltersBtn: document.querySelector('.clear-filter-btn')
}

const backDrop = document.querySelector('.backdrop');
const createTodoBtn = document.querySelector('.create-todo-btn');
const todoListItem = document.querySelector('.todo-list');

// returns a todo element
function createTodoElement(todo) {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    if(todo.completed) {
        todoElement.classList.add('completed');
    }
    todoElement.setAttribute('data-todo-status', todo.completed ? todoStatuses.COMPLETED : todoStatuses.PENDING);
    todoElement.setAttribute('data-todo-id', todo.id);

    let priorityIndicatorHTML;
    let categoryIndicatorHTML;
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

    switch(todo.category) {
        case categories.NO :
            categoryIndicatorHTML = '';
            break;
        case categories.WORK :
            categoryIndicatorHTML = '<span class="category-indicator">work</span>';
            break;
        case categories.HOBBY :
            categoryIndicatorHTML = '<span class="category-indicator">hobby</span>';
            break;
        case categories.ADMIN :
            categoryIndicatorHTML = '<span class="category-indicator">admin</span>';
            break;
    }

    todoElement.innerHTML = `
        <div class="todo-content">${todo.title}</div>
        ${categoryIndicatorHTML}
        ${priorityIndicatorHTML}
        <span class="material-icons trash-btn">delete</span>
    `;

    return todoElement;
}

// display todos
function displayTodos(todos) {
    todos.sort(compareTodos);
    const todoList = document.querySelector('.todo-list');
    todoList.innerHTML = '';    // TODO: find a better way to do this
    todos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
}

// clear the contents of the filter dialog
function clearFilterForm() {
    Array.from(filterTodosWindow.filterStatusPanel.children).forEach(filterOption => {
        filterOption.classList.remove('filter-option--selected');
    });
    filterTodosWindow.searchBarInput.value = "";
    filterTodosWindow.prioritySelect.value = priorities.NO;
    filterTodosWindow.categorySelect.value = categories.NO;
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

// handles the search pattern of the search bar
function searchbarValueChangedHandler() {
    const patternToMatch = this.value;
    filters = {...filters, pattern: patternToMatch};   // update state
    
    applyFiltersAndDisplay();
}

// handle the filter status changed
function filterStatusClickHandler(event) {
    const filterOptionClicked = event.target.closest('.filter-option');
    if(!filterOptionClicked) {
        return ;
    }

    if(!this.contains(filterOptionClicked)) {
        throw new Error("Something unexpected has happened here");
    }

    Array.from(this.children).forEach(filterOption => {
        if(filterOption === filterOptionClicked) {
            return ;
        }

        filterOption.classList.remove('filter-option--selected');
    });

    filterOptionClicked.classList.toggle('filter-option--selected');
    
    let filterStatus = todoStatuses.NO;

    if(filterOptionClicked.classList.contains('filter-option--selected')) {
        filterStatus = filterOptionClicked.getAttribute('data-filter-status');
    }

    // set filter state
    filters = {
        ...filters,
        todoStatus: filterStatus,
    };

    applyFiltersAndDisplay();
}

// handle the change event in priority select filter
function prioritySelectValueChangedHandler() {
    const prioritySelected = this.value;

    // update state
    filters = {
        ...filters,
        priorityFilter: prioritySelected
    }

    applyFiltersAndDisplay();
}

// handle the change event in category select filter
function categorySelectValueChangedHandler() {
    const categorySelected = this.value;

    // update state
    filters = {
        ...filters,
        categoryFilter: categorySelected
    };

    applyFiltersAndDisplay();
}

// handler to clear applied filters
function clearFiltersHandler() {
    // reset state
    filters = {
        pattern: '',
        todoStatus: todoStatuses.NO,
        priorityFilter: priorities.NO,
        categoryFilter: categories.NO
    };

    clearFilterForm();
    applyFiltersAndDisplay();
}

// function to open the todo dialog
function openCreateTodoDialog() {
    clearCreateTodosForm();
    backDrop.style.display = 'block';
    createTodoWindow.dialog.style.display = 'block';
}

// function to close the todo dialog
function closeCreateTodoDialog() {
    backDrop.style.display = 'none';
    createTodoWindow.dialog.style.display = 'none';
}

// performs the actions to save the todo
function saveTodoElement() {    // TODO: Find a better name for this
    try {
        const todo = getFormInfo();
        createTodo(todo)
            .then(_ => {
                closeCreateTodoDialog();
            })
            .catch(_ => {
                alert(e.message);
            })
            .finally(_ => {
                getTodosAndDisplay();
            });
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

getTodosAndDisplay();

filterTodosWindow.searchBarInput.addEventListener('keyup', searchbarValueChangedHandler);
filterTodosWindow.filterStatusPanel.addEventListener('click', filterStatusClickHandler);
filterTodosWindow.prioritySelect.addEventListener('change', prioritySelectValueChangedHandler);
filterTodosWindow.categorySelect.addEventListener('change', categorySelectValueChangedHandler);
filterTodosWindow.clearFiltersBtn.addEventListener('click', clearFiltersHandler);

createTodoBtn.addEventListener('click', openCreateTodoDialog);

createTodoWindow.saveBtn.addEventListener('click', saveTodoElement);
createTodoWindow.discardBtn.addEventListener('click', closeCreateTodoDialog);

todoListItem.addEventListener('click', handleTodoListClick);



backDrop.addEventListener('click', () => {
    closeCreateTodoDialog();
    // closeFilterTodosDialog();
});
