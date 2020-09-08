import {TodoApp} from './TodoApp.js';
import {createTodo, updateTodo, deleteTodo} from './mock-functions.js';
import {openCreateTodoDialog, getFormInfo, closeCreateTodoDialog} from './view-functions.js';

const createTodoWindow = {
    dialog: document.querySelector('.create-todo'),
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

const todoApp = new TodoApp();

const saveTodoElementHandler = () => {
    // try {
    const todo = getFormInfo();
    createTodo(todo)
        .then(_ => {
            closeCreateTodoDialog();
        })
        .catch(_ => {
            alert(e.message);
        })
        .finally(_ => {
            todoApp.getTodosAndDisplay();
        });
    // }catch(e) {
        // alert(e.message);
    // }
}

// performs the actions to delete a todo based on it's id
function deleteTodoElement(todoID) {
    deleteTodo(todoID)
        .then(res => {
            todoApp.getTodosAndDisplay();
        })
        .catch(e => {
            alert(e.message);
        });
}

// toggle a todo's selection
function toggleTodoSelection(todoElement) {
    const todoID = todoElement.getAttribute('data-todo-id');
    const todo = todoApp.findTodoByID(todoID);
    
    updateTodo(todoID, {completed: !todo.completed})
        .then(res => {
            todoApp.getTodosAndDisplay();
        }).catch(e => {
            alert(e.message);
        });
}

// handle click event in todo list
function handleTodoListClick(event) {
    const todoElement = event.target.closest('.todo');
    if(!todoElement || !todoList.contains(todoElement)) {
        throw new Error("Something unexpected has happened here");
    }

    if(event.target.classList.contains("trash-btn")) {
        deleteTodoElement(todoElement.getAttribute('data-todo-id'));
    }else {
        toggleTodoSelection(todoElement);
    }
}

function init() {
    todoApp.getTodosAndDisplay();
    filterTodosWindow.searchBarInput.addEventListener('keyup', todoApp.searchbarValueChangedHandler);
    filterTodosWindow.filterStatusPanel.addEventListener('click', todoApp.filterStatusClickHandler);
    filterTodosWindow.prioritySelect.addEventListener('change', todoApp.prioritySelectValueChangedHandler);
    filterTodosWindow.categorySelect.addEventListener('change', todoApp.categorySelectValueChangedHandler);
    filterTodosWindow.clearFiltersBtn.addEventListener('click', todoApp.clearFiltersHandler);

    createTodoBtn.addEventListener('click', openCreateTodoDialog);

    createTodoWindow.saveBtn.addEventListener('click', saveTodoElementHandler);
    createTodoWindow.discardBtn.addEventListener('click', closeCreateTodoDialog);

    todoList.addEventListener('click', handleTodoListClick);

    backDrop.addEventListener('click', closeCreateTodoDialog);
}

init();