const addBtn = document.getElementById('addBtn');
const removeAllBtn = document.querySelector('.removeAll');
const input = document.querySelector('.head input');
const currentTasks = document.querySelector('.current-tasks');
const completedTasks = document.querySelector('.completed-tasks');

// Initialize tasks from local storage or create an array has a static data
let tasks = JSON.parse(localStorage.getItem('tasks')) || [{id: 1722631507498, content: "The default task was set by the programmer {Ahmed Maher}.", completed: false}];

// ID for the task being edited
let modifiedId;

// Display tasks on page load
displayTasks(tasks);

// ("================================================================================================================");

// Add Task or Edit Task button click:
addBtn.onclick = function(e) {
    if (input.value.trim().length > 0) { // Validate the input
        // Add Task
        if (addBtn.innerText === 'Add Task') {
            createTask(input.value.trim());
        } 
        // Edit Task
        else { 
            editTask();
            resetAddButton();
        }
        input.value = ''; // Clear the input content
    }
}

// ("================================================================================================================");

// Create a new task:
function createTask(taskContent) {
    const task = {
        id: Date.now(),
        content: taskContent,
        completed: false
    };
    tasks.push(task); // Add task to the array
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks to local storage
    displayTasks(tasks);
}

// Edit an existing task:
function editTask() {
    tasks.forEach(task => {
        if (task.id === modifiedId) {
            task.content = input.value.trim();
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks to local storage
    displayTasks(tasks);
}

// ("================================================================================================================");

// Display tasks in the DOM:
function displayTasks(tasksArray) {
    const contentContainer = document.querySelector('.content');
    // Hide or show the tasks container based on tasksArray length
    contentContainer.classList.toggle('hide', tasksArray.length === 0);
    // Clear the current tasks and completed tasks containers
    currentTasks.innerHTML = '';
    completedTasks.innerHTML = '';
    // Add heading for completed tasks
    const heading = document.createElement('h3');
    heading.innerText = 'Completed Tasks:';
    completedTasks.appendChild(heading);
    // Iterate through tasksArray and create task elements
    tasksArray.forEach(task => {
        const taskDiv = createTaskDiv(task);
        if (task.completed) {
            completedTasks.appendChild(taskDiv);
        } else {
            currentTasks.appendChild(taskDiv);
        }
    });
    // Update the remove all button text
    removeAllBtn.innerHTML = `Remove All Tasks [${tasks.length}] <i class="fa-solid fa-trash"></i>`;
}

// ("================================================================================================================");

// Create task div with task content and buttons:
function createTaskDiv(task) {
    // Create task container div
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.setAttribute('data-id', task.id);
    // Create task content paragraph
    const taskContent = document.createElement('p');
    taskContent.innerText = task.content;
    // Create Task buttons
    const taskBtns = document.createElement('div');
    const doneBtn = createButton(task.completed ? "done fa-solid fa-square-check" : "done fa-regular fa-square-check", 'complete the task');
    const editBtn = createButton("edit fa-solid fa-pen", 'edit the task');
    const deleteBtn = createButton("delete fa-solid fa-trash-can", 'delete the task');
    // Append elements
    taskBtns.append(doneBtn, editBtn, deleteBtn);
    taskDiv.append(taskContent, taskBtns);
    return taskDiv;
}

// Create a button with specified classes and title:
function createButton(classNames, title) {
    const btn = document.createElement('i');
    btn.className = classNames;
    btn.setAttribute('title', title);
    return btn;
}

// ("================================================================================================================");

// Document click events:
document.onclick = function(e) {
    const taskId = e.target.closest('.task')?.getAttribute('data-id');
    if (!taskId) return;
    // Complete/Uncomplete Task
    if (e.target.classList.contains('done')) { 
        tasks.forEach(task => {
            if (task.id == taskId) {
                task.completed = !task.completed;
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks to local storage
        displayTasks(tasks);
    } 
    // Edit Task
    else if (e.target.classList.contains('edit')) { 
        tasks.forEach(task => {
            if (task.id == taskId) {
                modifiedId = task.id;
            }
        });
        input.value = e.target.closest('.task').querySelector('p').innerText;
        input.focus();
        setEditButton();
    } 
    // Delete Task
    else if (e.target.classList.contains('delete')) { 
        tasks = tasks.filter(task => task.id != taskId);
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Save tasks to local storage
        displayTasks(tasks);
    }
}

// ("================================================================================================================");

// Remove all tasks
removeAllBtn.addEventListener('click', () => {
    tasks = [];
    localStorage.removeItem('tasks'); // Clear local storage
    displayTasks(tasks);
});

// Helper functions
function setEditButton() {
    addBtn.innerText = 'Edit Task';
    addBtn.style.backgroundColor = '#26a69a';
}

function resetAddButton() {
    addBtn.innerText = 'Add Task';
    addBtn.style.backgroundColor = '#ff5722';
}

// ("================================================================================================================");

// Copyrights Year:
function copyrightsYear() {
    const coyrigthSpan = document.getElementById('copyright-year');
    let dateNow = new Date();
    coyrigthSpan.innerHTML = dateNow.getFullYear();
}
document.addEventListener('DOMContentLoaded', () => {
    copyrightsYear();
});