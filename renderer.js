// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const idleTime = require('@paulcbetts/system-idle-time');
const fs = require('fs');
const player = require('play-sound')(opts = {});
const _ = require('lodash');
const readdir_rec = require('fs-readdir-recursive');

const inputLimit = document.querySelector('#idleTimeInput');
const timerActionCheckBox = document.querySelector('#timerAction');
const SOUNDS_PATH = __dirname+'/sounds';
let soundFiles = [];

let idleInterval;

function checkIdleTime(maxIdleTime) {
    let triggered = false;
    clearInterval(idleInterval);
    idleInterval = setInterval(function () {
        const idleTimeRecorded = idleTime.getIdleTime();
        const limit = parseInt(inputLimit.value) * 1000;
        if (idleTimeRecorded > limit) {
            if(!triggered) {
                triggered = true;
                const soundFile = _.sample(soundFiles);
                player.play(SOUNDS_PATH+'/'+soundFile,(err) => {
                    if (err) throw err;
                });
            }
        }else{
            triggered = false;
        }
    }, 1000)
}

function startTimer() {
    checkIdleTime(parseInt(idleTimeInput.value) * 1000);
}

function stopTimer() {
    clearInterval(idleInterval);
}

soundFiles = _.map(readdir_rec(SOUNDS_PATH));
console.log(soundFiles);
 
timerActionCheckBox.addEventListener('change',(e) => {
    e.currentTarget.checked?startTimer():stopTimer();
})

 