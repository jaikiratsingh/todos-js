import {findMatchesTodo, todoStatuses, priorities, categories} from './todo-model-functions.js';

// apply filters to todos
function getFilteredTodos(todos, filters) {
    const {pattern, todoStatus, priorityFilter, categoryFilter} = filters;
    const filteredTodos = todos
                            .filter(todo => todo.title.match(new RegExp(pattern, 'gi')))
                            .filter(todo => (
                                (todoStatus === todoStatuses.DEFAULT) || 
                                (todoStatus === todoStatuses.PENDING && todo.completed === false) || 
                                (todoStatus === todoStatuses.COMPLETED && todo.completed === true)))
                            .filter(todo => (priorityFilter.key === priorities.DEFAULT.key || todo.priority === priorityFilter.key))
                            .filter(todo => (categoryFilter.key === categories.DEFAULT.key || todo.category === priorityFilter.key));

    return filteredTodos;
}

export {getFilteredTodos};