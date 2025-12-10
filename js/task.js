let tasks = [];
let current = 0;
let handle = "";

// ✅ UPDATED: Your Railway backend URL
// const BASE_API = "https://orbit20-production-9e31.up.railway.app"
const BASE_API = "http://115.190.50.47:3000"
// const BASE_API = "http://localhost:3000"

function clickAdd() {
    // if (!localStorage.getItem("user")) {
    // if (!document.cookie) {
    //     loginOpen();
    //     return;
    // }
    handle = "add";
    renderTasksDom();
}

function clickSave() {
    let name = document.querySelector("#input-task-name").value;
    let num = document.querySelector("#input-task-num").value;
    addTask(name, num);
}

function clickCancel() {
    handle = "";
    renderTasksDom();
}

function clickNum1() {
    let num = parseInt(document.querySelector("#input-task-num").value);
    document.querySelector("#input-task-num").value = num + 1;
}

function clickNum0() {
    let num = parseInt(document.querySelector("#input-task-num").value);
    if (num > 1) {
        document.querySelector("#input-task-num").value = num - 1;
    }
}

function existTask() {
    let exist = false;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].finish < tasks[i].num) {
            exist = true;
            break;
        }
    }
    return exist;
}

// ✅ Get current active task
function getCurrentTask() {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].finish < tasks[i].num) {
            return tasks[i];
        }
    }
    return null;
}

// ✅ UPDATED: Use opacity to hide/show while keeping space
function updateCurrentTaskDisplay() {
    const currentTask = getCurrentTask();
    const displayElement = document.querySelector("#current-task-display");
    
    if (currentTask) {
        // Show task name with progress
        displayElement.innerHTML = `${currentTask.name} (${currentTask.finish}/${currentTask.num})`;
        displayElement.classList.remove('empty');
    } else {
        // Hide text but keep the space
        displayElement.innerHTML = "&nbsp;"; // Non-breaking space to maintain height
        displayElement.classList.add('empty');
    }
}

function getTasks() {
    // if (!document.cookie) {
    //     tasks = [];
    //     renderTasksDom();
    //     return;
    // }
    fetch(BASE_API + "/getTasks", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        credentials: 'include'
    })
    .then(response => response.json())
    .then(res => {
        tasks = res.data;
        handle = "";
        renderTasksDom();
        updateCurrentTaskDisplay(); // ✅ ADDED
    })
    .catch(error => {
        console.error('Error fetching tasks:', error);
        alert('Failed to load tasks. Please check your connection.');
    });
}

function addTask(name, num) {
    // if (!document.cookie) {
    //     loginOpen();
    //     return;
    // }
    if (name) {
        fetch(BASE_API + "/addTask?name=" + encodeURIComponent(name) + "&num=" + num, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(res => {
            tasks = res.data;
            handle = "";
            renderTasksDom();
            updateCurrentTaskDisplay(); // ✅ ADDED
        })
        .catch(error => {
            console.error('Error adding task:', error);
            alert('Failed to add task. Please try again.');
        });
    }
    else {
        alert("name is required")
    }
}

function updateTask() {
    // write record
    fetch(BASE_API + "/recordAdd", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(res => {
            
        })
        .catch(error => {
            console.error('Error record add:', error);
        });
    let id = "";
    let finish = "";
    let isDelete = false;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].finish < tasks[i].num) {
            id = tasks[i]._id;
            finish = tasks[i].finish + 1;
            if (finish == tasks[i].num) {
                isDelete = true;
                timeType = 0;
                reset();
            }
            break;
        }
    }
    if (isDelete) {
        audioPlay("alarm");
        fetch(BASE_API + "/deleteTask?id=" + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                tasks = res.data;
                handle = "";
                renderTasksDom();
                updateCurrentTaskDisplay(); // ✅ ADDED
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    }
    else {
        fetch(BASE_API + "/updateTask?id=" + id + "&finish=" + finish,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            },
            credentials: 'include'
        })
            .then(response => response.json())
            .then(res => {
                tasks = res.data;
                handle = "";
                renderTasksDom();
                updateCurrentTaskDisplay(); // ✅ ADDED
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    }
}

function deleteTask(id) {
    audioPlay("delete");
    fetch(BASE_API + "/deleteTask?id=" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(res => {
            tasks = res.data;
            handle = "";
            renderTasksDom();
            updateCurrentTaskDisplay(); // ✅ ADDED
        })
        .catch(error => {
            console.error('Error deleting task:', error);
        });
}

function deleteAll() {
    audioPlay("delete");
    fetch(BASE_API + "/deleteAll", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        credentials: 'include'
    })
        .then(response => response.json())
        .then(res => {
            tasks = res.data;
            handle = "";
            renderTasksDom();
            updateCurrentTaskDisplay(); // ✅ ADDED
        })
        .catch(error => {
            console.error('Error deleting all tasks:', error);
        });
}

function renderTasksDom() {
    let outputHtml = "";
    if (handle == "add") {
        document.querySelector("#task-top").style.display = "none";
        outputHtml += `
            <div style="margin-top: 6vh;text-align:left;">
                <div>ADD A NEW TASK!</div>
                <textarea name="message" rows="2" cols="50" id="input-task-name" type="text" placeholder="Enter here what you will be working on." style="background: rgba(255, 255, 255, 0.3); padding-left: 1vh"></textarea>
                <div style="display: flex; justify-content: start; align-items: center; margin-top:5vh;">
                    <div style="font-size:3.20vh;">SET POMOS</div>
                    <input id="input-task-num" value="1"  type="text" style="background: rgba(255, 255, 255, 0.3);">
                    <img class="up-dowm-btn"style="margin-right:1.28vh;" src="./images/up.png" alt="" onclick="clickNum1()">
                    <img class="up-dowm-btn" src="./images/down.png" alt="" onclick="clickNum0()">
                </div>
                <div class="btn" style="text-align:center; justify-content: start; margin-top:10vh;">
                    <div class="btn-item" style="margin-left:4vh;" onclick="clickCancel()">CANCEL</div>
                    <div class="btn-item" onclick="clickSave()">SAVE</div>
                </div>
            </div>
        `;
    }
    else {
        document.querySelector("#task-top").style.display = "flex";
        if (tasks && tasks.length > 0) {
            outputHtml += `<div style="height: 53vh; overflow-y: auto;">`;
            for (let i = 0; i < tasks.length; i++) {
                outputHtml += `
                    <div style="width: 100%; display: flex; align-items:center; border: 3px solid #FFFFFF; width: 100%; padding:0 1.9vh;font-size:2.45vh; height:7.02vh; margin-bottom:2.8vh;">
                        <div style="flex-grow: 1; text-align: left;">${tasks[i].name}</div>
                        <div>${tasks[i].finish}/${tasks[i].num}</div>
                        <img style="height:2.53vh; margin:0 0 0.6vh 2vh; cursor: pointer;" src="./images/remove.png" onclick="deleteTask('${tasks[i]._id}')">
                    </div>   
                `;
            }
            outputHtml += `</div>`;
        }
        else {
            // ✅ UPDATED: Added 40% opacity to the entire message
            outputHtml += `
            <div style="margin-top:25vh; opacity: 0.4;">
                Click <img style="width: 2.682vh;height:2.682vh;margin:0 1vh; cursor: pointer;" src="./images/add.png" alt="" onclick="clickAdd()"> to create new tasks!
            </div>
        `;
        }
    }
    document.querySelector("#task-list").innerHTML = outputHtml;
}

function audioPlay(name) {
    let audioDom = document.querySelector("#audio-bg");
    audioDom.src = `./mp3/${name}.mp3`;
    audioDom.play()
}

