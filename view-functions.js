import {todoStatuses, priorities, categories} from './todo-model-functions.js';
import {Todo} from './todo-model-functions.js';

const createTodoWindow = {
    dialog: document.querySelector('.create-todo'),
    titleInput: document.querySelector('.create-todo-title'),
    bodyArea: document.querySelector('.create-todo-body'),
    prioritySelect: document.querySelector('.todo-options .priority-choices'),
    categorySelect: document.querySelector('.todo-options .category-choices'),
    saveBtn: document.querySelector('.save-btn'),  // not visible
    discardBtn: document.querySelector('.discard-btn')
};

// gets form information and returns as an object
function getFormInfo() {
    const title = document.querySelector('.create-todo-title').value;
    const body = document.querySelector('.create-todo-body').value;
    const category = document.querySelector('.todo-options .category-choices').value;
    const priority = document.querySelector('.todo-options .priority-choices').value;

    if(!title) {
        throw new Error("Empty Todo Title");
    }
        
    return new Todo(title, body, priority, category);
}

// clear the contents of the filter dialog
function clearFilterForm() {
    const filterStatusPanel = document.querySelector('.filter-options__section--2');
    const searchBarInput = document.querySelector('.searchbar input');
    const prioritySelect = document.querySelector('.filter-option__select--priority');
    const categorySelect = document.querySelector('.filter-option__select--category');

    Array.from(filterStatusPanel.children).forEach(filterOption => {
        filterOption.classList.remove('filter-option--selected');
    });
    searchBarInput.value = "";
    prioritySelect.value = priorities.NO;
    categorySelect.value = categories.NO;
}

// clear the contents of the form
function clearCreateTodosForm() {
    createTodoWindow.titleInput.value = '';
    createTodoWindow.bodyArea.value = '';
    createTodoWindow.prioritySelect.value = priorities.NO;
    createTodoWindow.categorySelect.value = 'default';
}

// function to open the todo dialog
function openCreateTodoDialog() {
    const backDrop = document.querySelector('.backdrop');

    clearCreateTodosForm();
    backDrop.style.display = 'block';
    createTodoWindow.dialog.style.display = 'block';
}

// function to close the todo dialog
function closeCreateTodoDialog() {
    const backDrop = document.querySelector('.backdrop');

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
    todoElement.setAttribute('data-todo-status', todo.completed ? todoStatuses.COMPLETED : todoStatuses.PENDING);
    todoElement.setAttribute('data-todo-id', todo.id);

    let priorityIndicatorHTML;
    let categoryIndicatorHTML;
    switch(todo.priority) {
        case priorities.NO :
            priorityIndicatorHTML = '';
            break;
        case priorities.LOW :
            priorityIndicatorHTML = `<span class="priority-indicator low">!</span>`;
            break;
        case priorities.MEDIUM :
            priorityIndicatorHTML = `<span class="priority-indicator medium">!!</span>`;
            break;
        case priorities.HIGH :
            priorityIndicatorHTML = `<span class="priority-indicator high">!!!</span>`;
            break;
    }

    switch(todo.category) {
        case categories.NO :
            categoryIndicatorHTML = '';
            break;
        case categories.WORK :
            categoryIndicatorHTML = '<span class="category-indicator">work</span>';
            break;
        case categories.HOBBY :
            categoryIndicatorHTML = '<span class="category-indicator">hobby</span>';
            break;
        case categories.ADMIN :
            categoryIndicatorHTML = '<span class="category-indicator">admin</span>';
            break;
    }

    todoElement.innerHTML = `
        <div class="todo-content">${todo.title}</div>
        ${categoryIndicatorHTML}
        ${priorityIndicatorHTML}
        <span class="material-icons trash-btn">delete</span>
    `;

    return todoElement;
}

export {clearFilterForm, getFormInfo, openCreateTodoDialog, closeCreateTodoDialog, createTodoElement};