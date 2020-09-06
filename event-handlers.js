// handles the search pattern of the search bar
function searchPatternHandler() {
    const patternToMatch = this.value;
    console.log(patternToMatch);

    const filteredTodos = getFilteredTodos(todos);
    const matchedTodos = findMatchesTodo(patternToMatch, filteredTodos);

    console.log(matchedTodos);

    displayTodos(matchedTodos);
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

// opens the dialog for filtering todos
function openFilterTodosDialog() {
    backDrop.style.display = 'block';
    filterTodosWindow.dialog.style.display = 'block';
}

// closes the dialog for filtering todos
function closeFilterTodosDialog() {
    backDrop.style.display = 'none';
    filterTodosWindow.dialog.style.display = 'none';
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

// handler to apply filters
function applyFiltersHandler() {
    const filteredTodos = getFilteredTodos(todos);

    displayTodos(filteredTodos);
    closeFilterTodosDialog();
}

// handler to clear applied filters
function clearFiltersHandler() {
    clearFilterForm();
    displayTodos(todos);
}
