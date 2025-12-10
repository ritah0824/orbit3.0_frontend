// Timer state
var isStart = false;
var timeType = 0;   // 0: work, 1: rest

// Timer duration (in seconds)
const PARAM_WORK_SECONDS = 60 * 25;  // 25 minutes
const PARAM_REST_SECONDS = 60 * 5;   // 5 minutes
var workSeconds = 60 * 25;
var restSeconds = 60 * 5;

// For testing (uncomment these and comment above to test with shorter times):
// const PARAM_WORK_SECONDS = 5;
// const PARAM_REST_SECONDS = 2;
// var workSeconds = 5;
// var restSeconds = 2;

// Timer interval
setInterval(function () {
    if (isStart) {
        drawClock();
    }
}, 1000);

// Main timer logic
function drawClock() {
    if (timeType == 0) {
        // WORK PERIOD
        if (workSeconds > 0) {
            if (isStart) {
                workSeconds--;
            }
            drawNumber(workSeconds);
        } else {
            // Work period complete! 
            console.log('✅ Work period completed!');
            
            // Switch to rest period
            timeType = 1;
            restSeconds = PARAM_REST_SECONDS;
            drawNumber(restSeconds);
            
            // Update task progress and record completion
            completePomodoro();
            
            // Optional: Play completion sound/notification
            notifyWorkComplete();
        }
    } else {
        // REST PERIOD
        if (restSeconds > 0) {
            if (isStart) {
                restSeconds--;
            }
            drawNumber(restSeconds);
        } else {
            // Rest period complete! 
            console.log('✅ Rest period completed!');
            
            // Switch back to work period
            timeType = 0;
            workSeconds = PARAM_WORK_SECONDS;
            drawNumber(workSeconds);
            
            // Optional: Play notification sound
            notifyRestComplete();
        }
    }
}

// Update timer display
function drawNumber(num) {
    // Update title based on period type
    if (timeType == 0) {
        document.querySelector("#left-title").innerHTML = "LEFT TO WORK!";
        document.querySelector("#left-title").className = "work";
    } else {
        document.querySelector("#left-title").innerHTML = "LEFT TO REST!";
        document.querySelector("#left-title").className = "rest";
    }
    
    // Calculate minutes and seconds
    let sec = num % 60;
    let min = (num - sec) / 60;
    let numMin2 = min % 10;
    let numMin1 = (min - numMin2) / 10;
    let numSec2 = sec % 10;
    let numSec1 = (sec - numSec2) / 10;
    
    // Update display
    document.querySelector("#time-minute-1").innerHTML = numMin1;
    document.querySelector("#time-minute-2").innerHTML = numMin2;
    document. querySelector("#time-second-1").innerHTML = numSec1;
    document.querySelector("#time-second-2").innerHTML = numSec2;
    
    // Update button text
    if (isStart) {
        document.querySelector("#btn-start").innerHTML = "PAUSE";
    } else {
        document.querySelector("#btn-start").innerHTML = "START";
    }
}

// Reset timer
function reset() {
    isStart = false;
    
    if (timeType == 0) {
        workSeconds = PARAM_WORK_SECONDS;
    } else {
        restSeconds = PARAM_REST_SECONDS;
    }
    
    drawClock();
    console.log('🔄 Timer reset');
}

// Start/pause button click
function startClick() {
    // Check if user is logged in before starting
    if (!isStart) {
        // Check if there are any tasks
        if (tasks.length === 0) {
            alert('Please add a task before starting the timer!');
            return;
        }
        
        // If no task is selected, auto-select the first incomplete task
        if (currentTaskIndex < 0) {
            const firstIncompleteTask = tasks. findIndex(task => task.finish < task.num);
            if (firstIncompleteTask >= 0) {
                selectTask(firstIncompleteTask);
                console.log('✅ Auto-selected first incomplete task');
            } else {
                alert('All tasks are complete!  Add a new task or reset an existing one.');
                return;
            }
        }
    }
    
    // Toggle timer
    if (isStart) {
        isStart = false;
        document. querySelector("#btn-start").innerHTML = "START";
        console.log('⏸️ Timer paused');
    } else {
        isStart = true;
        document.querySelector("#btn-start").innerHTML = "PAUSE";
        console.log('▶️ Timer started');
    }
}

// Notification when work period completes
function notifyWorkComplete() {
    // Visual notification
    document.body.style.animation = 'flash 0.5s';
    setTimeout(() => {
        document.body.style.animation = '';
    }, 500);
    
    // Browser notification (if permitted)
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Pomodoro Complete!', {
            body: 'Great work! Time for a break.',
            icon: './images/icon.png' // Optional:  add an icon
        });
    }
    
    // Optional: Play sound
    // const audio = new Audio('./sounds/complete.mp3');
    // audio.play();
}

// Notification when rest period completes
function notifyRestComplete() {
    // Visual notification
    document.body.style.animation = 'flash 0.5s';
    setTimeout(() => {
        document. body.style.animation = '';
    }, 500);
    
    // Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('✨ Break Over!', {
            body: 'Ready to focus again? ',
            icon: './images/icon.png'
        });
    }
}

// Request notification permission on page load
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('✅ Notifications enabled');
            }
        });
    }
}

// Initialize timer on page load
function initializeTimer() {
    drawNumber(workSeconds);
    requestNotificationPermission();
}

// Call initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTimer);
} else {
    initializeTimer();
}