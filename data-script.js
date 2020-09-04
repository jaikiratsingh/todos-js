// These are todos in memory
let todos = []

// priority options
const priorities = {
    NO : 'NO_PRIORITY',
    LOW: 'LOW_PRIORITY',
    MEDIUM: 'MEDIUM_PRIORITY',
    HIGH: 'HIGH_PRIORITY'
}

// category options
const categories = {
    WORK: 'WORK',
    HOBBY: 'HOBBY',
    ADMIN: 'ADMIN',
}

// constructor function for a todo
function Todo(title, body, priority = priorities.NO_PRIORITY, category) {
    this.id = uuid(),
    this.title = title;
    this.body = body;
    this.priority = priority;
    this.completed = false;
    this.category = category;
}
