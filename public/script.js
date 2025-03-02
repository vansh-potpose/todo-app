// Fetch tasks from the server
async function fetchTasks() {
    const response = await fetch('http://localhost:5000/tasks');
    const tasks = await response.json();
    renderTasks(tasks);
}

// Render tasks in the lists
function renderTasks(tasks) {
    const taTasks = tasks.filter(task => task.type === 'TA');
    const examTasks = tasks.filter(task => task.type === 'Exam');
    const practicalTasks = tasks.filter(task => task.type === 'Practical');

    document.getElementById('taTasks').innerHTML = '';
    document.getElementById('examTasks').innerHTML = '';
    document.getElementById('practicalTasks').innerHTML = '';

    taTasks.forEach(task => appendTask(task, 'ta'));
    examTasks.forEach(task => appendTask(task, 'exam'));
    practicalTasks.forEach(task => appendTask(task, 'practical'));
}

// Append a task to the respective list
function appendTask(task, type) {
    const taskList = document.getElementById(`${type}Tasks`);
    const li = document.createElement('li');
    li.textContent = `${task.description} (Due: ${task.dueDate})`;

    // Edit Button
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.onclick = () => editTask(task, type);

    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => deleteTask(task._id);

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
}

// Add a task to the server
async function addTask(type) {
    const taskInput = document.getElementById(`${type}TaskInput`);
    const taskDate = document.getElementById(`${type}TaskDate`);

    if (taskInput.value.trim() === '') {
        alert("Task cannot be empty!");
        return;
    }

    const newTask = {
        type: type === 'ta' ? 'TA' : type.charAt(0).toUpperCase() + type.slice(1),
        description: taskInput.value,
        dueDate: taskDate.value,
    };

    const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
    });

    const task = await response.json();
    appendTask(task, type);

    // Clear input fields
    taskInput.value = '';
    taskDate.value = '';
}

// Edit an existing task
async function editTask(task, type) {
    const newDescription = prompt("Edit Task:", task.description);
    const newDueDate = prompt("Edit Due Date (YYYY-MM-DD):", task.dueDate);

    if (newDescription !== null && newDueDate !== null) {
        const updatedTask = { description: newDescription, dueDate: newDueDate };
        await fetch(`http://localhost:5000/tasks/${task._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        });
        fetchTasks(); // Refresh task lists
    }
}

// Delete a task
async function deleteTask(id) {
    await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
    });
    fetchTasks(); // Refresh task lists
}

// Initial fetch of tasks
window.onload = fetchTasks;
