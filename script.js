// time
date.textContent = time();

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
    msg.textContent = username + ", Select a level and enter a number!"
    nameBtn.disabled = true;
nameInput.disabled = true;
    if(username === ""){
        msg.textContent = "Please enter your name!";
        nameBtn.disabled = false;
        nameInput.disabled = false;
    }
}

function givingup(){
    msg.textContent = username + ", you gave up! The answer was: " + answer;
    reset();
    if(level==100){
        score = 100;
    }
    else if(level==10){
        score = 10;
    }
    else{
        score = 1;
    }
    updateScore();
}


function time(){
    let d = new Date();
// concatenate the date and time
    let str = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear()

    return str;
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
            level = levelArr[i].value;
        }
}
    answer = Math.floor(Math.random()*level)+1;
    makeGuess.textContent = "Level: " + level;
    guess.placeholder = answer; 
    score=0;
}
function makeGuess(){
    let userGuess = parseInt(guess.value);
    if(isNaN(userGuess) || userGuess <1 || userGuess > level){
        msg.textContent = "INVALID, guess a number " + username + "!";
        return;
    }
    
    score++;

    if(userGuess < answer){
        msg.textContent = "Too low, guess again, " + username + "!"
    }
    else if(userGuess == answer){
        msg.textContent = "Correct, " + username + "!" + " It took " + score + " tries.";
        reset();
        updateScore();
    }
    else{
        msg.textContent = "Too high, guess again, " + username + "!";
        }

}

    
    function reset(){
        guessBtn.disabled = true;
        guess.value = "";
        guess.placeholder = "";
        guess.disabled = true
        playBtn.disabled = false;
        for(let i=0; i<levelArr.length; i++){
            levelArr[i].disabled = false;
    
        }
    }

    function updateScore(){
        scoreArr.push(score); // adds current score to array of scores 
        wins.textContent = "Total wins: "+ scoreArr.length; 
        let sum = 0;
        scoreArr.sort((a,b)=> a - b); // sorts ascending
        // leaderboard
        const lb = document.getElementsByName("leaderboard");

        for(let i = 0; i<scoreArr.length; i++){
            sum+= scoreArr[i];
            if(i < lb.length){
                lb[i].textContent = scoreArr[i];
            }
        }
        let avg = sum/scoreArr.length;
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
