import {uuid} from './mock-functions.js'

// constructor function for a todo
function Todo(title, body, priority = priorities.NO_PRIORITY, category) {
    this.id = uuid(),
    this.title = title;
    this.body = body;
    this.priority = priority;
    this.completed = false;
    this.category = category;
}

// todo status options
const todoStatuses = {
    NO: 'default',
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED',
    DELETED: 'DELETETED'
}

// priority options
const priorities = {
    NO : 'NO_PRIORITY',
    LOW: 'LOW_PRIORITY',
    MEDIUM: 'MEDIUM_PRIORITY',
    HIGH: 'HIGH_PRIORITY'
}

// category options
const categories = {
    NO: 'default',
    WORK: 'WORK',
    HOBBY: 'HOBBY',
    ADMIN: 'ADMIN',
}

// get order according to priority
function getOrderPriority(priority) {
    switch(priority) {
        case priorities.LOW :
            return 1;
        case priorities.MEDIUM :
            return 2;
        case priorities.HIGH :
            return 3;
        default :
            return 0;
    }
}

function compareTodos(todoOne, todoTwo) {
    if((todoOne.completed ^ todoTwo.completed) == 1) {  // check if one of the two has completed as true
        if(todoOne.completed) {
            return 1;
        }else {
            return -1;
        }
    }else {
        const orderOne = getOrderPriority(todoOne.priority);
        const orderTwo = getOrderPriority(todoTwo.priority);

        return orderTwo - orderOne;
    }
}

// find matching todos according to regex
function findMatchesTodo(todoTitlePattern, todos) {
    const regex = new RegExp(todoTitlePattern, 'gi');
    return todos.filter(todo => todo.title.match(regex));
}


export {Todo, compareTodos, findMatchesTodo, todoStatuses, priorities, categories};