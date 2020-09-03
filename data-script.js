// These are todos in memory
let todos = []

// constructor function for a todo
function Todo(title, body) {
    this.id = uuid(),
    this.title = title;
    this.body = body;
    this.completed = false;
}
