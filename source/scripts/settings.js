// TODOs:
/* 
- Settings modal not responsive to window size
- Custom minutes and seconds don’t work together (only changing one of them works at a time)
  - messes up if secs is inputted before mins 
- When the goal for number of pomodoros for long break is reached, alert for both short break and long break both alert
- Having short and long breaks not freeze the timer
- Add JSDoc comments
- Unit testing

- Jonathan working on resizing the settings modal, as well as tweaking CSS and making HTML more readable
- Arela working on custom minutes and seconds. Can't really get it to work properly
- Brian will help Arela with custom minutes and seconds. Separate the short break and long break alert

*/

let secondsPerPomo = 60 * 25; // Number of seconds in single pomo session
let timeRemaining = secondsPerPomo; // Time remaining in session in seconds
let pomodoro = 0; // Number of pomodoros completed
let intervalId = null; // ID of interval calling the timeAdvance method
let onBreak = false;

/**
 * This function advances time by one second. It will be called by setInterval in startButton
 */
function timeAdvance() {
  --timeRemaining;

  let minute = Math.floor((timeRemaining / 60) % 60);
  let seconds = Math.floor(timeRemaining % 60);
  minute = minute < 10 ? "0" + minute : minute;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById("minute").innerHTML = minute;
  document.getElementById("seconds").innerHTML = seconds;

  /*
   * Break handling
   */

  if (timeRemaining <= 0) {
    // If a break just completed
    if (onBreak) {
      onBreak = false;

      clearInterval(intervalId);
      timeRemaining = secondsPerPomo;
      sound();
    }
    // If a pomo session just completed
    else {
      onBreak = true;
      pomodoro++;
      document.getElementById("completePomos").innerHTML =
        "Number of Complete Pomodoros: " + pomodoro;
      clearInterval(intervalId);
      sound();

      const pomosUntilLongBreak = document.getElementById("userPomos").value;

      // If it is time for a long break
      if (pomodoro % pomosUntilLongBreak == 0 && pomodoro != 0) {
        alert("Time to take a long break");

        const minutesPerLongBreak = document.getElementById("breakPomos").value;
        if(minutesPerLongBreak == ""){ //default value: 30 mins
            timeRemaining = 60 * 30;
        }
        else{
            timeRemaining = 60 * minutesPerLongBreak;
        }
      }
      // If it is time for a short break
      else {
        alert("Time to take a short break");

        const minutesPerShortBreak = document.getElementById("shortBreakPomos").value;
        if(minutesPerShortBreak == ""){ //default value: 5 mins
            timeRemaining = 60 * 5;
        }
        else{
            timeRemaining = 60 * minutesPerShortBreak;
        }
      }
    }
  }
}
// keep count of how many pomodoros have been completed
document.getElementById("completePomos").innerHTML =
  "Number of Complete Pomodoros: " + pomodoro;

/**
 * startButton and stopButton will be called by the start/stop button
 * The single button will swap between the two functions each time one is called
 */
const mixBut = document.getElementById("mixBut");

function startButton() {
  if (secondsPerPomo == 0) {
    // defaults back to 25 mins if both mins and secs 0
    timeRemaining = 25 * 60;
  }
  intervalId = setInterval(timeAdvance, 1000);
  console.log("Started");
  mixBut.removeEventListener("click", startButton);
  mixBut.addEventListener("click", stopButton);
  document.getElementById("mixBut").style.background = "indianred";
  mixBut.value = "Stop";
}
function stopButton() {
  if (intervalId) {
    clearInterval(intervalId);
  }
  console.log("Stopped");
  mixBut.removeEventListener("click", stopButton);
  mixBut.addEventListener("click", startButton);
  document.getElementById("mixBut").style.background = "lightgreen";

  // Updating the time display given that a new time remaining will have been set for a break
  let minute = Math.floor((timeRemaining / 60) % 60);
  let seconds = Math.floor(timeRemaining % 60);
  minute = minute < 10 ? "0" + minute : minute;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById("minute").innerHTML = minute;
  document.getElementById("seconds").innerHTML = seconds;
  mixBut.value = "Start Timer";
}
mixBut.addEventListener("click", startButton);

/**
 * resetButton will be linked to the reset button and resets the pomo session
 */
function resetButton() {
  timeRemaining = secondsPerPomo;
  // minutes
  if (inputMins.value == "") {
    document.getElementById("minute").innerHTML = "25";
  } else if (inputMins.value == "0") {
    document.getElementById("minute").innerHTML = "00";
  } else if (inputMins.value < 10) {
    document.getElementById("minute").innerHTML = "0" + inputMins.value;
  } else {
    document.getElementById("minute").innerHTML = inputMins.value;
  }
  // seconds
  if (inputSecs.value == "" || inputSecs.value == "0") {
    document.getElementById("seconds").innerHTML = "00";
  } else if (inputSecs.value < 10) {
    document.getElementById("seconds").innerHTML = "0" + inputSecs.value;
  } else {
    document.getElementById("seconds").innerHTML = inputSecs.value;
  }
}
document.getElementById("reset-btn").addEventListener("click", resetButton);

/*
 * Settings Modal
 */

// When the user clicks anywhere outside of the modal, close it
const modal = document.getElementById("settings-modal");
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

/**
 * Updating timer when the inputMins element in the settings menu changes
 */
const inputMins = document.getElementById("userMins");
inputMins.oninput = function () {
  stopButton(); // so that there's no overlapping timers
  let indexMins = 0;
  // doesnt allow for custom timer to start with a 0 and more numbers
  if (inputMins.value.length > 1) {
    while (inputMins.value.substring(indexMins, indexMins + 1) == "0") {
      indexMins++;
    }
  }
  inputMins.value = inputMins.value.substring(indexMins);
  if (inputMins.value == "") {
    document.getElementById("minute").innerHTML = "25";
    secondsPerPomo = 60 * 25;
  } else if (inputMins.value == "0") {
    document.getElementById("minute").innerHTML = "00";
    secondsPerPomo = 0;
  } else if (inputMins.value < 10) {
    document.getElementById("minute").innerHTML = "0" + inputMins.value;
    const addTime =
      parseInt(60 * inputMins.value, 10) + parseInt(inputSecs.value, 10);
    secondsPerPomo = addTime;
  } else if (inputMins.value > 59) {
    // max mins for pomo timer 2 hours
    inputMins.value = 59;
    const addTime =
      parseInt(60 * inputMins.value, 10) + parseInt(inputSecs.value, 10);
    secondsPerPomo = addTime;
  } else {
    document.getElementById("minute").innerHTML = inputMins.value;
    const addTime =
      parseInt(60 * inputMins.value, 10) + parseInt(inputSecs.value, 10);
    secondsPerPomo = addTime;
  }
  timeRemaining = secondsPerPomo;
  intervalId = null;
};

/**
 * Updating timer when the inputSecs element in the settings menu changes
 */
const inputSecs = document.getElementById("userSecs");
inputSecs.oninput = function () {
  stopButton(); // so that there's no overlapping timers
  let indexSecs = 0;
  // doesnt allow for custom timer to start with a 0 and more numbers
  if (inputSecs.value.length > 1) {
    while (inputSecs.value.substring(indexSecs, indexSecs + 1) == "0") {
      indexSecs++;
    }
  }
  inputSecs.value = inputSecs.value.substring(indexSecs);
  if (inputSecs.value == "" || inputSecs.value == "0") {
    document.getElementById("seconds").innerHTML = "00";
  } else if (inputSecs.value < 10) {
    document.getElementById("seconds").innerHTML = "0" + inputSecs.value;
    const addTime =
      parseInt(60 * inputMins.value, 10) + parseInt(inputSecs.value, 10);
    secondsPerPomo = addTime;
  } else if (inputSecs.value >= 60) {
    // max mins for pomo timer 2 hours
    inputSecs.value = 59;
    const addTime =
      parseInt(60 * inputMins.value, 10) + parseInt(inputSecs.value, 10);
    secondsPerPomo = addTime;
  } else {
    document.getElementById("seconds").innerHTML = inputSecs.value;
    const addTime =
      parseInt(60 * inputMins.value, 10) + parseInt(inputSecs.value, 10);
    secondsPerPomo = addTime;
  }
  timeRemaining = secondsPerPomo;
  intervalId = null;
};

/*
 * Notfication Sound Functions
 */
function sound() {
  // alarm("alarm");
  const x = document.getElementById("changeSelect").value;
  const volLevel = document.getElementById("volume-slider").value / 100;
  let audioSound;
  if (x == "Chirp") {
    audioSound = new Audio(
      "https://freesound.org/data/previews/456/456440_5121236-lq.mp3"
    );
    audioSound.volume = volLevel;
  } else if (x == "Alarm-Clock") {
    audioSound = new Audio(
      "https://freesound.org/data/previews/219/219244_4082826-lq.mp3"
    );
    audioSound.volume = volLevel;
  } else if (x == "None") {
    audioSound = new Audio(
      "https://freesound.org/data/previews/219/219244_4082826-lq.mp3"
    );
    audioSound.volume = 0;
  }
  // infinite loop
  audioSound.addEventListener(
    "ended",
    function () {
      this.currentTime = 0;
      this.play();
    },
    false
  );
  audioSound.play();
  // Stop alarm sound
  document.getElementById("mixBut").onclick = function (event) {
    stopAlarm();
  }; // stop alarm when press stop
  document.getElementById("reset-btn").onclick = function (event) {
    stopAlarm();
  }; // stop alarm when press reset
  function stopAlarm() {
    if (audioSound) {
      audioSound.pause();
      audioSound.currentTime = 0;
    }
  }
}

/**
 * Making sure the volume-number and the volume-slider always match
 */
const slider = document.getElementById("volume-slider");
const numInp = document.getElementById("volume-number");
slider.oninput = function () {
  document.getElementById("volume-number").value = document.getElementById(
    "volume-slider"
  ).value;
};
numInp.oninput = function () {
  document.getElementById("volume-slider").value = document.getElementById(
    "volume-number"
  ).value;
};
