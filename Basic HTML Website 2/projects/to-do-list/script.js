const taskInput = document.getElementById('task-input');
const addButton = document.getElementById('add-button');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function addTask() {
    if (taskInput.value === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskInput.value,
        completed: false
    };

    tasks.push(task);
    saveToLocalStorage();
    renderTask(task);
    taskInput.value = '';
}

function renderTask(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    if (task.completed) li.classList.add('checked');
    
    li.innerHTML = `
        ${task.text}
        <span class="delete-btn">&times;</span>
    `;

    li.addEventListener('click', function(e) {
        if (e.target.tagName !== 'SPAN') {
            toggleTask(task.id);
        }
    });

    li.querySelector('.delete-btn').addEventListener('click', function() {
        deleteTask(task.id);
    });

    taskList.appendChild(li);
}

function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        const li = document.querySelector(`li[data-id="${id}"]`);
        li.classList.toggle('checked');
        saveToLocalStorage();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    const li = document.querySelector(`li[data-id="${id}"]`);
    li.remove();
    saveToLocalStorage();
}

function saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Event Listeners
addButton.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Initial render
tasks.forEach(task => renderTask(task)); 