import {findMatchesTodo, todoStatuses, priorities, categories} from './todo-model-functions.js';

// apply filters to todos
function getFilteredTodos(todos, filters) {
    let filteredTodos = [...todos]; // TODO: make a deep copy here
    const {pattern, todoStatus, priorityFilter, categoryFilter} = filters;
    
    filteredTodos = findMatchesTodo(pattern, filteredTodos);   // filtering according to search pattern
    filteredTodos = filteredTodos.filter(todo => {
        switch(todoStatus) {
            case todoStatuses.NO :
                return  true;
            case todoStatuses.PENDING :
                return todo.completed === false;
            case todoStatuses.COMPLETED :
                return todo.completed === true;
        }
    });

    if(priorityFilter !== priorities.NO) {
        filteredTodos = filteredTodos.filter(todo => todo.priority === priorityFilter);
    }

    if(categoryFilter !== categories.NO) {
        filteredTodos = filteredTodos.filter(todo => todo.category === categoryFilter);
    }

    return filteredTodos;
}

export {getFilteredTodos};