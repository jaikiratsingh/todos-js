const todos = [
    // {
    //     title: 'make tea'
    // },
    // {
    //     title: 'go to the grocery store'
    // }
];  // store todos here for now

// constructor function for a todo
function Todo(title, body) {
    this.id = uuid(),
    this.title = title;
    this.body = body;
    this.completed = false;
}

// Saves this todo
Todo.prototype.saveTodo = function() {
    todos.push(this);  // TODO: make it asycnhronous and throw error if save is failed
}

Todo.prototype.deleteTodo = function() {
    todos.splice(todos.indexOf(this), 1);  // TODO: Make this asynchronous and throw an error if failed
}

Todo.prototype.toggleTodo = function() {
    this.completed = !this.completed;  // TODO: Make this asynchronous and throw an error if failed
}

// Asynchronous call which fetches Todos
function getTodosAsync() {
    // TODO: make asynchronous call and store the result in todos
    return todos;
}