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
    },
    LOW: {
        key: 'LOW',
        value: 'Low Priority',
        order: 1,
        indicatorHTML: '<span class="priority-indicator low">!</span>',
    },
    MEDIUM: {
        key: 'MEDIUM',
        value: 'Medium Priority',
        order: 2,
        indicatorHTML: '<span class="priority-indicator medium">!!</span>',
    },
    HIGH: {
        key: 'HIGH',
        value: 'High Priority',
        order: 2,
        indicatorHTML: '<span class="priority-indicator high">!!!</span>',
    },
}

const categories = {
    DEFAULT: {
        key: 'DEFAULT',
        value: 'No Category',
        indicatorHTML: '',
    },
    WORK: {
        key: 'WORK',
        value: 'Work',
        indicatorHTML: '<span class="category-indicator">work</span>',
    },
    HOBBY: {
        key: 'HOBBY',
        value: 'Hobby',
        indicatorHTML: '<span class="category-indicator">hobby</span>',
    },
    ADMIN: {
        key: 'ADMIN',
        value: 'Admin',
        indicatorHTML: '<span class="category-indicator">admin</span>',
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