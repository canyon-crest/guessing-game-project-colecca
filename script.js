let roundStartTime;       // timestamp when round starts
let fastestTime = null;   // fastest round duration in milliseconds
let totalTime = 0;
let totalGames = 0;

window.onload = function() {
  // Adds suffix for day (1st, 2nd, 3rd, etc.)
  function getDateSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  // Updates date + time
  function showDateTime() {
    const now = new Date();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const date = now.getDate();
    const suffix = getDateSuffix(date);
    const year = now.getFullYear();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
    const dateString = `${dayName}, ${monthName} ${date}${suffix}, ${year}`;

    document.getElementById("dateTime").textContent = `${dateString} — ${timeString}`;
  }

  // Show immediately, then update every second
  showDateTime();
  setInterval(showDateTime, 1000);
};

const playBtn = document.getElementById("playBtn");
const guessBtn = document.getElementById("guessBtn");
const nameBtn = document.getElementById("nameBtn");
const giveUpBtn = document.getElementById("giveUpBtn");
const hintBtn = document.getElementById("hintBtn");
const nameInput = document.getElementById("nameInput");
const msg = document.getElementById("msg");
const wins = document.getElementById("wins");
const avgScore = document.getElementById("avgScore");
const guess = document.getElementById("guess");

// global variables/constants 
let score, answer, level, username, proximity, rel;
const levelArr = document.getElementsByName("level");
const scoreArr = [];

// event listeners 
playBtn.addEventListener("click", play);
guessBtn.addEventListener("click", makeGuess);
nameBtn.addEventListener("click", enterName);
giveUpBtn.addEventListener("click", givingup);
hintBtn.addEventListener("click", giveHint);

function enterName(){
    username = nameInput.value.charAt(0).toUpperCase() + nameInput.value.slice(1).toLowerCase();
    if(username === ""){
        msg.textContent = "Please enter your name!";
        nameBtn.disabled = false;
        nameInput.disabled = false;
        playBtn.disabled = true;
    } else {
        msg.textContent = username + ", Select a level and enter a number!";
        nameBtn.disabled = true;
        nameInput.disabled = true;
        playBtn.disabled = false;
    }
}

function givingup(){
    // Display message but do NOT count as a win
    score = level;
    msg.textContent = username + ", you gave up! The answer was: " + answer;
    updateScore(false);
    reset();
}

function play(){
    playBtn.disabled = true;
    guessBtn.disabled = false;
    guess.disabled = false;
    giveUpBtn.disabled = false;
    hintBtn.disabled = false;
    msg.textContent = "Game on, " + username + "! Make your guess.";

    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = true;
        if(levelArr[i].checked){
            level = parseInt(levelArr[i].value);
        }
    }

    answer = Math.floor(Math.random()*level)+1;
    msg.innerHTML = "Game on, " + username + "! Make your guess between 1 and " + level + ".";
    guess.placeholder = "Enter your guess"; 
    score = 0;

    roundStartTime = new Date().getTime(); // store start time in ms
}

function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess < 1 || userGuess > level){
        msg.textContent = "INVALID, guess a number " + username + "!";
        return;
    }

    score++;

    if(userGuess < answer){
        msg.textContent = "Too low, guess again, " + username + "!";
    }
    else if(userGuess > answer){
        msg.textContent = "Too high, guess again, " + username + "!";
    }
    else {
        // User guessed correctly
        let roundEndTime = new Date().getTime();
        let roundDuration = roundEndTime - roundStartTime;
        totalTime += roundDuration;
        totalGames++;

        // Performance feedback logic
        let performanceMsg = "";
        if(level <= 5){
            if(score === 1) performanceMsg = "🔥 Amazing! First try!";
            else if(score <= 2) performanceMsg = "😊 Great job!";
            else performanceMsg = "😐 Not bad, but could be better!";
        } else {
            let guessRatio = score / level;
            if(guessRatio <= 0.05) performanceMsg = "🔥 Amazing! Very efficient!";
            else if(guessRatio <= 0.15) performanceMsg = "😊 Great job!";
            else if(guessRatio <= 0.3) performanceMsg = "😐 Not bad, but could be better!";
            else performanceMsg = "😅 That was tough… keep practicing!";
        }

        msg.textContent = `Correct, ${username}! It took ${score} guesses (Level ${level}). ${performanceMsg}`;

        // Update fastestTime if this is a new record
        if(fastestTime === null || roundDuration < fastestTime){
            fastestTime = roundDuration;
        }

        document.getElementById("fastestTime").textContent = 
            "Fastest Game: " + (fastestTime / 1000).toFixed(2) + " seconds";

        let avgTimeSeconds = (totalTime / totalGames / 1000).toFixed(2);
        document.getElementById("avgTime").textContent =
            "Average Time per Game: " + avgTimeSeconds + " seconds";

        reset();
        updateScore();
    }
}

function reset(){
    guessBtn.disabled = true;
    guess.value = "";
    guess.placeholder = "";
    guess.disabled = true;
    playBtn.disabled = false;
    for(let i=0; i<levelArr.length; i++){
        levelArr[i].disabled = false;
    }
}

function updateScore(countWin=true){
    scoreArr.push(score); // adds current score to array of scores 
    wins.textContent = "Total wins: "+ scoreArr.length; 

    let sum = 0;
    scoreArr.sort((a,b)=> a - b); // sorts ascending

    // leaderboard
    const lb = document.getElementsByName("leaderboard");
    for(let i = 0; i<scoreArr.length; i++){
        sum += scoreArr[i];
        if(i < lb.length){
            lb[i].textContent = scoreArr[i];
        }
    }

    let avg = sum / scoreArr.length;
    avgScore.textContent = "Average Score: " + avg.toFixed(2);
}

function giveHint(){
    let proximity;
    rel = Math.abs(answer - parseInt(guess.value)) / level;
    if(rel <= 0.05) proximity = "Boiling hot!";
    else if(rel <= 0.1) proximity = "Very hot!";
    else if(rel <= 0.2) proximity = "Hot";
    else if(rel <= 0.3) proximity = "Warm";
    else if(rel <= 0.4) proximity = "Cold";
    else proximity = "Freezing!";
    msg.textContent = "You're " + proximity;    
}
