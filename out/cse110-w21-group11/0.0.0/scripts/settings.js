// Get the modal
var modal = document.getElementById("settings-modal");

// Get the button that opens the modal
var btn = document.getElementById("settings-btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// var twentyfiveMinutes = 60 * 1;
var twentyfiveMinutes = 60 * 25;
var pomodoro = 0;
//Timer Functions
window.onload = () => {
    let minute = 0;
    let seconds = 0;
    let totalSeconds = twentyfiveMinutes;
    let intervalId = null;
    document.getElementById("completePomos").innerHTML = "Number of Complete Pomodoros: " + pomodoro;
    function startTimer() {
        --totalSeconds;
        seconds = Math.floor(totalSeconds % 60);
        minute = Math.floor((totalSeconds / 60) % 60);
        minute = minute < 10 ? "0" + minute : minute;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        document.getElementById("minute").innerHTML = minute;
        document.getElementById("seconds").innerHTML = seconds;
        if(totalSeconds == 0){
            pomodoro++;
            totalSeconds = twentyfiveMinutes;
            clearInterval(intervalId);
            document.getElementById("completePomos").innerHTML = "Number of Complete Pomodoros: " + pomodoro;
            sound();
        }
    }

    var inputMins = document.getElementById("userMins");
    // TODO: custom seconds(?)
    // var inputSecs = document.getElementById("userSecs");
    inputMins.oninput = function(){
        Stop(); //so that there's no overlapping timers
        if(inputMins.value == "" || inputMins.value == "0" ){ //PROBLEM: if user wants to put more than one 0 for some reason, gives error
            document.getElementById("minute").innerHTML = '25';
            let normal = 25;
            twentyfiveMinutes = 60 * normal;
        }
        else if(inputMins.value < 10){
            document.getElementById("minute").innerHTML = '0' + inputMins.value;
            twentyfiveMinutes = 60 * inputMins.value;
        }
        else{
            document.getElementById("minute").innerHTML = inputMins.value;
            twentyfiveMinutes = 60 * inputMins.value;
        }
        document.getElementById("seconds").innerHTML = '00';
        minute = 0;
        seconds = 0;
        totalSeconds = twentyfiveMinutes;
        intervalId = null;
    }

    //Notfication Sound Functions
    function sound(){
        var x = document.getElementById("changeSelect").value;
        var volLevel = document.getElementById("volume-slider").value / 100;
        if(x == "Chirp"){
            var audioSound = new Audio('https://freesound.org/data/previews/456/456440_5121236-lq.mp3');
            audioSound.volume = volLevel;
        }
        else if(x == "Alarm-Clock"){
            var audioSound = new Audio('https://freesound.org/data/previews/219/219244_4082826-lq.mp3');
            audioSound.volume = volLevel;
        }
        else if(x == "None"){
            var audioSound = new Audio('https://freesound.org/data/previews/219/219244_4082826-lq.mp3');
            audioSound.volume = 0;
        }
        // infinite loop
        audioSound.addEventListener('ended', function() {
            this.currentTime = 0;
            this.play();
        }, false);
        audioSound.play();
        //Stop alarm sound
        document.getElementById("mixBut").onclick = function(event) {stopAlarm()}; //stop alarm when press stop
        document.getElementById("reset-btn").onclick = function(event) {stopAlarm()}; //stop alarm when press reset
        function stopAlarm() {
            if(audioSound){
                audioSound.pause();
                audioSound.currentTime = 0;
            }
        }
    }
    var slider = document.getElementById("volume-slider");
    var numInp = document.getElementById("volume-number");
    slider.oninput = function(){
        document.getElementById("volume-number").value = document.getElementById("volume-slider").value;
    }  
    numInp.oninput = function(){
        document.getElementById("volume-slider").value = document.getElementById("volume-number").value;
    }

    var mixBut = document.getElementById("mixBut");
    mixBut.addEventListener("click", Start);
    var resetTimer = document.getElementById("reset-btn");
    resetTimer.addEventListener("click", Reset);
    function Start(){
        intervalId = setInterval(startTimer, 1000);
        console.log("Started");
        mixBut.removeEventListener("click", Start);
        mixBut.addEventListener("click", Stop);
        document.getElementById("mixBut").style.background = "indianred";
        mixBut.value = "Stop";
    }
    function Stop(){
        if (intervalId){
            clearInterval(intervalId);
        }
        console.log("Stopped");
        mixBut.removeEventListener("click", Stop);
        mixBut.addEventListener("click", Start);
        document.getElementById("mixBut").style.background = "lightgreen";
        mixBut.value = "Start Timer";
    }
    function Reset(){
        totalSeconds = twentyfiveMinutes;
        if(inputMins.value == "" || inputMins.value == "0" ){ //PROBLEM: if user wants to put more than one 0 for some reason, gives error
            document.getElementById("minute").innerHTML = '25';
        }
        else if(inputMins.value < 10){
            document.getElementById("minute").innerHTML = '0' + inputMins.value;
        }
        else{
            document.getElementById("minute").innerHTML = inputMins.value;
        }
        document.getElementById("seconds").innerHTML = '00';
    }
}

(function(){
    var todo = document.querySelector( '#tasks' ),
        form = document.querySelector( 'form' ),
        field = document.querySelector( '#newitem' );
    form.addEventListener( 'submit', function( event ) {
      var text = field.value;
      if ( text !== '' ) {
        todo.innerHTML += '<li>' + text +
          ' <button onclick="Check(this);">check as done</button> <button onclick="Delete(this);">X</button> </li>';
        field.value = '';
      }
      event.preventDefault();
    }, false);
  })();

function Check(curr){
if(curr.parentNode.innerHTML.charAt(0) == "✓"){
    curr.parentNode.innerHTML= curr.parentNode.innerHTML.substring(1);
}
else{
    curr.parentNode.innerHTML = "✓" + curr.parentNode.innerHTML;
}
}

function Delete(curr){
curr.parentNode.parentNode.removeChild(curr.parentNode);    
}

var listClear = document.getElementById("clearList");

listClear.addEventListener("click", noList);

function noList(){
var ul = document.getElementById("tasks");
ul.innerHTML = "";
}