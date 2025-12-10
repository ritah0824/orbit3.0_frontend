// Task Management Functions

let tasks = [];
let currentTaskIndex = -1;

// Get all tasks from API
async function getTasks() {
    try {
        const response = await fetch(`${API_URL}/getTasks`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            console.log('❌ Not authenticated, showing login');
            updateUIForLoggedOutUser();
            loginOpen();
            return;
        }

        const data = await response.json();

        if (data.success) {
            tasks = data.data || [];
            console.log('✅ Tasks loaded:', tasks.length);
            renderTasks();
            
            // Update current task display if timer is running
            if (currentTaskIndex >= 0 && currentTaskIndex < tasks.length) {
                updateCurrentTaskDisplay(tasks[currentTaskIndex]);
            }
        }
    } catch (error) {
        console.error('Error getting tasks:', error);
    }
}

// Render tasks in the UI
function renderTasks() {
    const taskList = document.getElementById('task-list');
    
    if (! tasks || tasks.length === 0) {
        taskList.innerHTML = '<div style="opacity: 0.5;">No tasks yet. Click + to add one! </div>';
        return;
    }

    let html = '';
    tasks.forEach((task, index) => {
        const isActive = index === currentTaskIndex;
        const activeClass = isActive ? 'task-active' : '';
        
        html += `
            <div class="task-item ${activeClass}" onclick="selectTask(${index})">
                <div class="task-name">${task.name}</div>
                <div class="task-progress">${task.finish}/${task.num}</div>
            </div>
        `;
    });
    
    taskList.innerHTML = html;
}

// Select a task
function selectTask(index) {
    currentTaskIndex = index;
    renderTasks();
    updateCurrentTaskDisplay(tasks[index]);
}

// Update current task display above timer
function updateCurrentTaskDisplay(task) {
    const display = document.getElementById('current-task-display');
    if (task) {
        display.textContent = task.name;
        display.classList.remove('empty');
    } else {
        display.textContent = '\u00A0'; // Non-breaking space
        display.classList.add('empty');
    }
}

// Add new task
function clickAdd() {
    const taskName = prompt('Enter task name:');
    
    if (! taskName || ! taskName.trim()) {
        return;
    }

    const numPomodoros = prompt('Number of pomodoros needed:', '4');
    const num = parseInt(numPomodoros) || 4;

    addTask(taskName. trim(), num);
}

// Add task to API
async function addTask(name, num) {
    try {
        const response = await fetch(`${API_URL}/addTask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ name, num })
        });

        if (response.status === 401) {
            loginOpen();
            return;
        }

        const data = await response.json();

        if (data.success) {
            tasks = data.data || [];
            console.log('✅ Task added');
            renderTasks();
        }
    } catch (error) {
        console.error('Error adding task:', error);
        alert('Failed to add task. Please try again.');
    }
}

// Update task progress
async function updateTask(taskId, finish) {
    try {
        const response = await fetch(`${API_URL}/updateTask/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ finish })
        });

        if (response.status === 401) {
            loginOpen();
            return;
        }

        const data = await response.json();

        if (data.success) {
            tasks = data.data || [];
            console.log('✅ Task updated');
            renderTasks();
        }
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Delete single task
async function deleteTask(taskId) {
    if (!confirm('Delete this task?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/deleteTask/${taskId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.status === 401) {
            loginOpen();
            return;
        }

        const data = await response.json();

        if (data.success) {
            tasks = data.data || [];
            console.log('✅ Task deleted');
            
            // Reset current task if it was deleted
            if (currentTaskIndex >= tasks.length) {
                currentTaskIndex = tasks.length - 1;
            }
            
            renderTasks();
            
            if (currentTaskIndex >= 0) {
                updateCurrentTaskDisplay(tasks[currentTaskIndex]);
            } else {
                updateCurrentTaskDisplay(null);
            }
        }
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Delete all tasks
async function deleteAll() {
    if (!confirm('Delete ALL tasks?  This cannot be undone!')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/deleteAll`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (response.status === 401) {
            loginOpen();
            return;
        }

        const data = await response.json();

        if (data.success) {
            tasks = [];
            currentTaskIndex = -1;
            console.log('✅ All tasks deleted');
            renderTasks();
            updateCurrentTaskDisplay(null);
        }
    } catch (error) {
        console.error('Error deleting all tasks:', error);
    }
}

// Complete one pomodoro for current task
async function completePomodoro() {
    if (currentTaskIndex < 0 || currentTaskIndex >= tasks.length) {
        return;
    }

    const task = tasks[currentTaskIndex];
    
    if (task.finish < task.num) {
        await updateTask(task._id, task.finish + 1);
        await addRecord(); // Add to weekly report
        
        // Move to next task if current one is complete
        if (task.finish + 1 >= task.num) {
            if (currentTaskIndex < tasks.length - 1) {
                selectTask(currentTaskIndex + 1);
            }
        }
    }
}

// Add record for weekly report
async function addRecord() {
    try {
        await fetch(`${API_URL}/recordAdd`, {
            method: 'POST',
            credentials: 'include'
        });
        console.log('✅ Pomodoro recorded');
    } catch (error) {
        console.error('Error adding record:', error);
    }
}

// Show weekly report
async function report() {
    try {
        const response = await fetch(`${API_URL}/report`, {
            method: 'GET',
            credentials: 'include'
        });

        if (response.status === 401) {
            loginOpen();
            return;
        }

        const data = await response.json();

        if (data.success) {
            showReportChart(data.data);
        }
    } catch (error) {
        console.error('Error getting report:', error);
        alert('Failed to load report. Please try again.');
    }
}

// Show report chart
function showReportChart(reportData) {
    document.getElementById('tanceng-wrapper').style.display = 'flex';
    document.getElementById('tanceng-report').style.display = 'block';
    document.getElementById('tanceng-login').style.display = 'none';
    document.getElementById('tanceng-signup').style.display = 'none';

    // Calculate total hours (each pomodoro = 25 minutes)
    const totalPomodoros = reportData.reduce((sum, day) => sum + day.recordCount, 0);
    const totalHours = (totalPomodoros * 25 / 60).toFixed(1);
    document.getElementById('report-total').textContent = totalHours;

    // Prepare chart data
    const dates = reportData.map(d => d.date. substring(5)); // MM-DD format
    const counts = reportData.map(d => d.recordCount);

    // Create chart
    const chartDom = document.getElementById('layer-chart');
    const myChart = echarts.init(chartDom);
    
    const option = {
        xAxis:  {
            type: 'category',
            data: dates,
            axisLabel: {
                fontSize: 14
            }
        },
        yAxis: {
            type:  'value',
            axisLabel: {
                fontSize: 14
            }
        },
        series: [{
            data:  counts,
            type: 'bar',
            itemStyle: {
                color: '#6366f1'
            },
            label: {
                show: true,
                position: 'top',
                fontSize: 16
            }
        }],
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const value = params[0].value;
                const hours = (value * 25 / 60).toFixed(1);
                return `${params[0].name}<br/>${value} pomodoros<br/>${hours} hours`;
            }
        },
        grid: {
            left: '10%',
            right: '5%',
            top: '10%',
            bottom: '15%'
        }
    };

    myChart.setOption(option);
}