// constructor function for a todo
function Todo(title, body, priority = priorities.NO_PRIORITY, category) {
    this.id = uuid(),
    this.title = title;
    this.body = body;
    this.priority = priority;
    this.completed = false;
    this.category = category;
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

// Compare 2 todos for order in the list
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

// apply filters to todos
function getFilteredTodos(todos) {
    let filteredTodos = todos;
    const selectedPriorityFilterValue = filters.priorityFilter;
    const selectedCategoryFilterValue = filters.categoryFilter;

    if(selectedPriorityFilterValue !== priorities.NO) {
        filteredTodos = filteredTodos.filter(todo => todo.priority === selectedPriorityFilterValue);
    }

    if(selectedCategoryFilterValue !== categories.NO) {
        filteredTodos = filteredTodos.filter(todo => todo.category === selectedCategoryFilterValue);
    }

    return filteredTodos;
}

// find matching todos according to regex
function findMatchesTodo(todoTitlePattern, todos) {
    const regex = new RegExp(todoTitlePattern, 'gi');
    return todos.filter(todo => todo.title.match(regex));
}
