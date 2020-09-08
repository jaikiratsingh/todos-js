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

// apply filters to todos and display them
function applyFiltersAndDisplay() {
    const filteredTodos = getFilteredTodos(todos);   // from state
    displayTodos(filteredTodos);
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