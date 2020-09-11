import {TodoAppState} from './TodoAppState.js';
import {openCreateTodoDialog, closeCreateTodoDialog} from './view-functions.js';

const createTodoWindow = {
    dialog: document.querySelector('.create-todo'),   // dont use classes for querySelector
    titleInput: document.querySelector('.create-todo-title'),
    bodyArea: document.querySelector('.create-todo-body'),
    prioritySelect: document.querySelector('.todo-options .priority-choices'),
    categorySelect: document.querySelector('.todo-options .category-choices'),
    saveBtn: document.querySelector('.save-btn'),  // not visible
    discardBtn: document.querySelector('.discard-btn')
};

const filterTodosWindow = {
    searchBarInput: document.querySelector('.searchbar input'),
    filterStatusPanel: document.querySelector('.filter-options__section--2'),
    prioritySelect: document.querySelector('.filter-option__select--priority'),
    categorySelect: document.querySelector('.filter-option__select--category'),
    clearFiltersBtn: document.querySelector('.clear-filter-btn')
}

const backDrop = document.querySelector('.backdrop');
const createTodoBtn = document.querySelector('.create-todo-btn');
const todoList = document.querySelector('.todo-list');

const todoApp = new TodoAppState();

function init() {
    todoApp.getTodosAndDisplay();
    filterTodosWindow.searchBarInput.addEventListener('keyup', todoApp.searchbarValueChangedHandler);
    filterTodosWindow.filterStatusPanel.addEventListener('click', todoApp.filterStatusClickHandler);
    filterTodosWindow.prioritySelect.addEventListener('change', todoApp.prioritySelectValueChangedHandler);
    filterTodosWindow.categorySelect.addEventListener('change', todoApp.categorySelectValueChangedHandler);
    filterTodosWindow.clearFiltersBtn.addEventListener('click', todoApp.clearFiltersHandler);

    createTodoBtn.addEventListener('click', openCreateTodoDialog);

    createTodoWindow.saveBtn.addEventListener('click', todoApp.saveTodoElementHandler);
    createTodoWindow.discardBtn.addEventListener('click', closeCreateTodoDialog);

    todoList.addEventListener('click', todoApp.handleTodoListClick);

    backDrop.addEventListener('click', closeCreateTodoDialog);
}

init();