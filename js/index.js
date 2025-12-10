var isStart = false;
var timeType = 0;   //0:work,1:reset
const PARAM_WORK_SECONDS = 60 * 25;
const PARAM_RESET_SECONDS = 60 * 5;
var workSeconds = 60 * 25;
var resetSeconds = 60 * 5;
// const PARAM_WORK_SECONDS = 5;
// const PARAM_RESET_SECONDS = 2;
// var workSeconds = 5;
// var resetSeconds = 2;

setInterval(function () {
    if (isStart) {
        drawClock();
    }
}, 1000);

function drawClock() {
    if (timeType == 0) {
        if (workSeconds > 0) {
            if (isStart) {
                workSeconds--;
            }
            drawNumber(workSeconds);
        }
        else {
            timeType = 1;
            resetSeconds = PARAM_RESET_SECONDS;
            drawNumber(resetSeconds);
            //update task status
            updateTask();
        }
    }
    else {
        if (resetSeconds > 0) {
            if (isStart) {
                resetSeconds--;
            }
            drawNumber(resetSeconds);
        }
        else {
            // if (existTask()) {
                
            // }
            timeType = 0;
            workSeconds = PARAM_WORK_SECONDS;
            drawNumber(resetSeconds);
        }
    }
}

function drawNumber(num) {
    if (timeType == 0) {
        document.querySelector("#left-title").innerHTML = "LEFT TO WORK!";
    }
    else {
        document.querySelector("#left-title").innerHTML = "LEFT TO REST!";
    }
    let sec = num % 60;
    let min = (num - sec) / 60;
    let numMin2 = min % 10;
    let numMin1 = (min - numMin2) / 10;
    let numSec2 = sec % 10;
    let numSec1 = (sec - numSec2) / 10;
    document.querySelector("#time-minute-1").innerHTML = numMin1;
    document.querySelector("#time-minute-2").innerHTML = numMin2;
    document.querySelector("#time-second-1").innerHTML = numSec1;
    document.querySelector("#time-second-2").innerHTML = numSec2;
    if (isStart) {
        document.querySelector("#btn-start").innerHTML = "PAUSE";
    }
    else {
        document.querySelector("#btn-start").innerHTML = "START";
    }
}

function reset() {
    isStart = false;
    if (timeType == 0) {
        workSeconds = PARAM_WORK_SECONDS;
    }
    else {
        resetSeconds = PARAM_RESET_SECONDS;
    }
    drawClock();
}

function startClick() {
    // if (existTask()) {    
        
    // }
    if (isStart) {
        isStart = false;
        document.querySelector("#btn-start").innerHTML = "START";
    }
    else {
        isStart = true;
        document.querySelector("#btn-start").innerHTML = "PAUSE";
    }
}
