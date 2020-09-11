import {todoStatuses, priorities, categories} from './todo-model-functions.js';
import {compareTodos} from './todo-model-functions.js';
import {getFilteredTodos} from './filter-functions.js';

const createTodoWindow = {
    dialog: document.querySelector('#create-todo-dialog'),
    titleInput: document.querySelector('#create-todo-title'),
    bodyArea: document.querySelector('#create-todo-body'),
    prioritySelect: document.querySelector('#create-todo-priority-choices'),
    categorySelect: document.querySelector('#create-todo-category-choices'),
    saveBtn: document.querySelector('#create-todo-save-btn'),  // not visible
    discardBtn: document.querySelector('#create-todo-discard-btn')
};

// clear the contents of the filter dialog
function clearFilterForm(priority = priorities.DEFAULT, category = categories.DEFAULT) {
    const filterStatusPanel = document.querySelector('#filter-status-panel');
    const searchBarInput = document.querySelector('#searchbar__input');
    const prioritySelect = document.querySelector('#filter-select-priority');
    const categorySelect = document.querySelector('#filter-select-category');

    Array.from(filterStatusPanel.children).forEach(filterOption => {
        filterOption.classList.remove('filter-option--selected');
    });
    searchBarInput.value = "";
    prioritySelect.value = priority.key;  // TODO: Take default priority as parameter
    categorySelect.value = category.key; // TODO: Take default priority as parameter
}

// TODO: Add default parameter for filters
const displayTodos = (todos, filters = {}) => {
    const filteredTodos = getFilteredTodos(todos, filters);
    filteredTodos.sort(compareTodos);
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';    // TODO: find a better way to do this
    filteredTodos.forEach(todo => {
        const todoElement = createTodoElement(todo);
        todoList.appendChild(todoElement);
    });
}

// toggle filter option in filter status panel
const toggleFilterStatusPanel = (eventTarget) => {
    const filterOptionClicked = eventTarget.closest('div[data-type="filter-option"]');
    const filterStatusPanel = eventTarget.closest('#filter-status-panel');

    Array.from(filterStatusPanel.children).forEach(filterOption => {  
        if(filterOption === filterOptionClicked) {
            return ;
        }

        filterOption.classList.remove('filter-option--selected');
        filterOption.removeAttribute('data-filter-selected');
    });

    filterOptionClicked.classList.toggle('filter-option--selected');
    filterOptionClicked.toggleAttribute('data-filter-selected');
}

// clear the contents of the form
function clearCreateTodosForm(priority = priorities.DEFAULT, category = categories.DEFAULT) {
    createTodoWindow.titleInput.value = '';
    createTodoWindow.bodyArea.value = '';
    createTodoWindow.prioritySelect.value = priority.key;
    createTodoWindow.categorySelect.value = category.key;
}

// function to open the todo dialog
function openCreateTodoDialog() {
    const backDrop = document.querySelector('#backdrop');

    clearCreateTodosForm();
    backDrop.style.display = 'block';
    createTodoWindow.dialog.style.display = 'block';
}

// function to close the todo dialog
function closeCreateTodoDialog() {
    const backDrop = document.querySelector('#backdrop');

    backDrop.style.display = 'none';
    createTodoWindow.dialog.style.display = 'none';
}

// creates a todo element and returns it
function createTodoElement(todo) {
    const todoElement = document.createElement('div');
    todoElement.classList.add('todo');
    if(todo.completed) {
        todoElement.classList.add('completed');
    }
    todoElement.setAttribute('data-type', 'todo');
    todoElement.setAttribute('data-todo-status', todo.completed ? todoStatuses.COMPLETED : todoStatuses.PENDING);
    todoElement.setAttribute('data-todo-id', todo.id);

    todoElement.innerHTML = `
        <div class="todo-content">${todo.title}</div>
        ${categories[todo.category].indicatorHTML}
        ${priorities[todo.priority].indicatorHTML}
        <span class="material-icons trash-btn" data-type="trash-btn">delete</span>
    `;

    return todoElement;
}

export {clearFilterForm, toggleFilterStatusPanel, displayTodos, openCreateTodoDialog, closeCreateTodoDialog, createTodoElement};