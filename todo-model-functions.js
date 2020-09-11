import {uuid} from './mock-functions.js'

// constructor function for a todo
function Todo(title, body, priority = priorities.DEFAULT.key, category = categories.DEFAULT.key) {
    this.id = uuid(),
    this.title = title;
    this.body = body;
    this.priority = priority;
    this.completed = false;
    this.category = category;
}

const priorities = {
    DEFAULT: {
        key: 'DEFAULT',
        value: 'No Priority',
        order: 0,
        indicatorHTML: '',
        comparesTo: function(priority) {
            return true;
        }
    },
    LOW: {
        key: 'LOW',
        value: 'Low Priority',
        order: 1,
        indicatorHTML: '<span class="priority-indicator low">!</span>',
        comparesTo: function(priority) {
            return this.key === priority;
        }
    },
    MEDIUM: {
        key: 'MEDIUM',
        value: 'Medium Priority',
        order: 2,
        indicatorHTML: '<span class="priority-indicator medium">!!</span>',
        comparesTo: function(priority) {
            return this.key === priority;
        }
    },
    HIGH: {
        key: 'HIGH',
        value: 'High Priority',
        order: 2,
        indicatorHTML: '<span class="priority-indicator high">!!!</span>',
        comparesTo: function(priority) {
            return this.key === priority;
        }
    }
}

const categories = {
    DEFAULT: {
        key: 'DEFAULT',
        value: 'No Category',
        indicatorHTML: '',
        comparesTo: function(category) {
            return true;
        }
    },
    WORK: {
        key: 'WORK',
        value: 'Work',
        indicatorHTML: '<span class="category-indicator">work</span>',
        comparesTo: function(category) {
            return this.key === category;
        }
    },
    HOBBY: {
        key: 'HOBBY',
        value: 'Hobby',
        indicatorHTML: '<span class="category-indicator">hobby</span>',
        comparesTo: function(category) {
            return this.key === category;
        }
    },
    ADMIN: {
        key: 'ADMIN',
        value: 'Admin',
        indicatorHTML: '<span class="category-indicator">admin</span>',
        comparesTo: function(category) {
            return this.key === category;
        }
    }
}

// todo status options
const todoStatuses = {
    DEFAULT: 'DEFAULT',
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    DELETED: 'DELETETED'
}

function compareTodos(todoOne, todoTwo) {
    if((todoOne.completed ^ todoTwo.completed) == 1) {  // check if one of the two has completed as true
        if(todoOne.completed) {
            return 1;
        }else {
            return -1;
        }
    }else {
        const orderOne = priorities[todoOne.priority].order;
        const orderTwo = priorities[todoTwo.priority].order;

        return orderTwo - orderOne;
    }
}

export {Todo, compareTodos, todoStatuses, priorities, categories};