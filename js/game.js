let timeLeft = 60;
let gameOver = false;
let teleportInterval = null;
let timerInterval = null;

// lets main.js ask if game is over
export function isGameOver() {
  return gameOver;
}

// start teleport loop
export function startTeleport(hiddenPlayer, player) {
  setInterval(() => {
    teleportHidden(hiddenPlayer, player);
  }, 2000);
}

// teleport hidden player
function teleportHidden(hiddenPlayer, player) {
  const mapLimit = 5;
  let newPos;
  let distance;

  do {
    newPos = {
      x: Math.random() * mapLimit * 2 - mapLimit,
      z: Math.random() * mapLimit * 2 - mapLimit,
    };

    distance = Math.sqrt(
      Math.pow(newPos.x - player.position.x, 2) +
        Math.pow(newPos.z - player.position.z, 2),
    );
  } while (distance < 4);

  hiddenPlayer.position.set(newPos.x, 1, newPos.z);
}

// distance logic
export function checkDistance(player, hiddenPlayer) {
  if (gameOver) return;

  const distance = player.position.distanceTo(hiddenPlayer.position);

  // far = almost invisible
  if (distance > 6) {
    hiddenPlayer.material.opacity = 0.03;
    hiddenPlayer.material.emissiveIntensity = 0;
  }

  // medium = slightly visible
  else if (distance > 3) {
    hiddenPlayer.material.opacity = 0.1;
    hiddenPlayer.material.emissiveIntensity = 1;
  }

  // close = glowing
  else if (distance > 1.5) {
    hiddenPlayer.material.opacity = 0.3;
    hiddenPlayer.material.emissiveIntensity = 3;
  }

  // very close = win
  else {
    winGame();
  }
}

// timer
export function startTimer(timerText) {
  timerInterval = setInterval(() => {
    if (gameOver) return;

    timeLeft--;
    timerText.textContent = "Time: " + timeLeft;

    if (timeLeft <= 0) {
      loseGame();
    }
  }, 1000);
}

// stop all running stuff
function stopGame() {
  gameOver = true;

  if (teleportInterval) {
    clearInterval(teleportInterval);
    teleportInterval = null;
  }

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// show end screen
function showEndScreen(text) {
  document.getElementById("message").textContent = text;
  document.getElementById("endScreen").style.display = "flex";
}

// win
function winGame() {
  if (gameOver) return;
  stopGame();
  showEndScreen("You Can See Me Now");
}

// lose
function loseGame() {
  if (gameOver) return;
  stopGame();
  showEndScreen("You Never Found Me");
}
