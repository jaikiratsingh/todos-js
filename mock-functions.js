// Mocks the functionalities of some popular functions

// TODO: Remove IIFE and take todos [] to global (module)

// mocks the uuid() functions
const uuid = (function() {
    let uid = 0;
    
    return function() {
        uid += 1;
        return uid.toString();
    }
})();

// mocks the functionality of working internet
const workingInternet = true;

// to mock server side of todos
const [createTodo, readTodos, updateTodo, deleteTodo] = (function() {
    let todos = [
        {
            id: uuid(),
            title: 'Go for a jog',
            body: undefined,
            completed: false,
            priority: 'LOW',
            category: 'ADMIN'
        },
        {
            id: uuid(),
            title: 'Read Novel',
            body: undefined,
            completed: true,
            priority: 'LOW',
            category: 'HOBBY'
        },
        {
            id: uuid(),
            title: 'Attend Morning Meeting',
            body: undefined,
            completed: false,
            priority: 'HIGH',
            category: 'WORK'
        },
        {
            id: uuid(),
            title: 'Go to the bank',
            body: undefined,
            completed: false,
            priority: 'MEDIUM',
            category: 'ADMIN'
        },
    ];
    const MAX_DELAY = 500;
    const getRandomTime = () => Math.floor(Math.random()*MAX_DELAY);

    // mocks create api
    function createTodo(todo) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(workingInternet) {
                    todos.push({...todo});
                    resolve({
                        status: 200,
                        message: "Todo created successfully"
                    });
                }else {
                    reject({
                        status: 404,
                        message: "Something went wrong. Please check your internet connection"
                    })
                }
            }, getRandomTime());
        });
    }

    // TODO: add functionality for RegExp
    function readTodos() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(workingInternet) {
                    resolve({
                        status: 200,
                        data: todos,
                        message: "Successful connection"
                    });
                }else {
                    reject({
                        status: 404,
                        data: undefined,
                        message: "Something went wrong. Please check your internet connection"
                    })
                }
            }, getRandomTime());
        });
    }

    // TODO: add functionality for updating title and body as well
    // if update todo fails, create
    function updateTodo(todoID, updateObject) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(workingInternet) {
                    const [todo] = todos.filter(todo => todo.id === todoID);

                    for(let property in updateObject) {
                        if(updateObject.hasOwnProperty(property)) {
                            todo[property] = updateObject[property];
                        }
                    }

                    resolve({
                        status: 200,
                        message: "Todo updated successfully"
                    });
                }else {
                    reject({
                        status: 404,
                        data: undefined,
                        message: "Something went wrong. Please check your internet connection"
                    })
                }
            }, getRandomTime());
        });
    }

    function deleteTodo(todoID) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if(workingInternet) {
                    todos = todos.filter(todo => todo.id !== todoID);

                    resolve({
                        status: 200,
                        message: "Todo deleted successfully"
                    });
                }else {
                    reject({
                        status: 404,
                        data: undefined,
                        message: "Something went wrong. Please check your internet connection"
                    })
                }
            }, getRandomTime());
        }); 
    } 


    return [createTodo, readTodos, updateTodo, deleteTodo];
})();

export {uuid, createTodo, readTodos, updateTodo, deleteTodo};