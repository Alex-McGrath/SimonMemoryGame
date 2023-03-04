function startStatus() {
  // Select the div element
  var colorDiv = document.querySelector(".statusCircle");

  // Change its background color
  colorDiv.style.backgroundColor = "Green";
}

// Define the game variables
const colors = ["green", "red", "yellow", "blue"];
let gamePattern = [];
let userPattern = [];
let gameStarted = false;
let timeOut;

// Get the game elements
const startButton = document.querySelector(".startButton");
const circles = document.querySelectorAll(".allCircles > div");
const scoreCounter = document.getElementById("scoreCounter");
const highScore = document.getElementById("highScore");
const statusCircle = document.querySelector(".statusCircle");


// Start the game when the Start button is clicked
startButton.addEventListener("click", function() {
if (!gameStarted) {
  startGame();
} else {
  endGame(); // stop the game if it's already started
}
});
/**This is probably the most important function in my code, its the function that initiates everything and starts the
 * game, It begins the 3 second countdown and declares the arrays that store the pattern (user and game), it resets
 * the level to 0 to keep track of the level that the user is on and calls the next necessary functions.
 */
// Start a new game
function startGame() {
  countdown();
  if (gameStarted) {
  return;
}

gamePattern = [];
userPattern = [];
level = 0;
gameStarted = true;
clearTimeout(timeOut);
circles.forEach(function(circle) {
  circle.classList.remove("active");
});
timeOut = setTimeout(function() {
  nextSequence();
}, 3000);
}

/*This function is for the countdown at the start of the game, its what displays it on the screen at the very
start of the game so the user knows when its going to start*/
function countdown(){
var countdown = 3; // set the countdown to 3 seconds
var countdownInterval = setInterval(function() {
  if (countdown === 0) {
    clearInterval(countdownInterval); // clear the interval when countdown reaches 0
    document.getElementById("countdown").style.display = "none"

  } else {
    document.getElementById("countdown").innerHTML = countdown; // display the countdown on the page
    countdown--; // decrement the countdown
  }
}, 1000);
}

// Starts the next level of the game by generating the next sequence of colors and flashes them
function nextSequence() {
scoreCounter.textContent = formatScore(level);
const nextColor = colors[Math.floor(Math.random() * colors.length)];
gamePattern.push(nextColor);
flashPattern(gamePattern);
level++;

}

// Flash a sequence of colors
function flashPattern(pattern) {
let i = 0;
let intervalTime = 800;
const interval = setInterval(function() {
  flashColor(pattern[i]);
  i++;
  if (i >= pattern.length) {
    clearInterval(interval);
    enableInput();

  }
  if (level >= 2) {
    intervalTime = 700; // decrease timeout for level 5 and above
  }
  if (level >= 9) {
    intervalTime = 600; // decrease timeout for level 9 and above
  }
  if (level >= 13) {
    intervalTime = 400; // decrease timeout for level 13 and above as required in brief
  }
}, intervalTime);
}

// Flash a single color
function flashColor(color) {
const circle = document.getElementById(color);
circle.classList.add("active");
let timeout = 500;

if (level >= 2) {
  timeout = 400; // decrease timeout for level 5 and above
}
if (level >= 9) {
  timeout = 300; // decrease timeout for level 9 and above
}
if (level >= 13) {
  timeout = 200; // decrease timeout for level 13 and above as required in brief
}
setTimeout(function() {
  circle.classList.remove("active");
}, timeout);

if (!gameStarted) {
  clearTimeout(timeOut);
  circles.forEach(function(circle) {
    circle.classList.remove("active");
    circle.removeEventListener("click", handleInput);
  });
}
}

// function enables the player to input the sequence by adding event listeners to the colored circles.
function enableInput() {
userPattern = [];
circles.forEach(function(circle) {
  circle.addEventListener("click", handleInput);
});
/*timeOut = setTimeout(function() {
  loseGame();
}, 5000);*/
}

// Disable user input by removing the event listeners.
function disableInput() {
circles.forEach(function(circle) {
  circle.removeEventListener("click", handleInput);
});
}
// Handle user input by adding the clicked color to the user's pattern and checking if the pattern matches the game pattern.
function handleInput(event) {
const selectedColor = event.target.id;
userPattern.push(selectedColor);
flashColor(selectedColor);
clearTimeout(timeOut); // clear the timeout
for (let i = 0; i < userPattern.length; i++) {
  if (userPattern[i] !== gamePattern[i]) {
    loseGame();
    return;
  }
}
if (userPattern.length === gamePattern.length) {
  disableInput();
  if (checkPattern()) {
    setTimeout(function() {
    nextSequence();
    }, 1000);

  } else {
    // check if the current input is wrong
    if (userPattern[0] !== gamePattern[0]) {
      loseGame();
    } else {
      // handle wrong input after the same amount of buttons are pressed
      const lastInput = userPattern[userPattern.length - 1];
      const correctInput = gamePattern[userPattern.length - 1];
    }
  }
}
}



// Check if the user pattern matches the game pattern
function checkPattern() {
for (let i = 0; i < userPattern.length; i++) {
  if (userPattern[i] !== gamePattern[i]) {
    return false;
  }
}
return true;
}


// handles the case when the player loses the game by displaying a message, flashing the correct pattern, and resetting the player's input.
function loseGame() {
  document.getElementById("statusText").innerHTML = "Game Over! Press start to play again.";
  document.getElementById("statusText").style.color = "red";
  
  
    setTimeout(function() {
      flashPattern(gamePattern);
      enableInput();
      userPattern = [];
    }, 1000);
  
  clearTimeout(timeOut); // clear the timeout
  circles.forEach(function(circle) {
    circle.classList.remove("active");
  });
  endGame();
  }



// End the game
function endGame() {
clearTimeout(timeOut);
timeOut = null;
disableInput(); // remove the event listeners from the circles
gameStarted = false;
startButton.textContent = "Again";
gamePattern = [];
userPattern = [];
statusCircle.style.backgroundColor = "red";
if (parseInt(scoreCounter.textContent) > parseInt(highScore.textContent)) {
  highScore.textContent = scoreCounter.textContent;
}
scoreCounter.textContent = "00";
let count = 0;
let flashInterval = setInterval(function() {
  if (count < 5) {
    // flash the circles white
    circles.forEach(function(circle) {
      circle.classList.add("active");
    });
    // after 300ms, change the circles back to their original colors
    setTimeout(function() {
      circles.forEach(function(circle) {
        circle.classList.remove("active");
      });
    }, 200);
    count++;
  } else {
    // stop the flashing after five times
    clearInterval(flashInterval);
  }
}, 300);
}


// Format the score with leading zeros
function formatScore(score) {
return score.toString().padStart(2, "0");
}