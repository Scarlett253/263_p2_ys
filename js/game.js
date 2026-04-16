let timeLeft = 60;
let gameOver = false;
let teleportInterval;

// start teleport loop
export function startTeleport(hiddenPlayer) {
  teleportInterval = setInterval(() => {
    teleportHidden(hiddenPlayer);
  }, 4000); // every 4 sec (feels better)
}

// teleport hidden player
function teleportHidden(hiddenPlayer) {
  const mapLimit = 5;

  hiddenPlayer.position.set(
    Math.random() * mapLimit * 2 - mapLimit,
    1,
    Math.random() * mapLimit * 2 - mapLimit,
  );
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

  // VERY close = win
  else {
    winGame();
  }
}

// timer
export function startTimer(timerText) {
  const timerInterval = setInterval(() => {
    if (gameOver) return;

    timeLeft--;
    timerText.textContent = "Time: " + timeLeft;

    if (timeLeft <= 0) {
      loseGame();
      clearInterval(timerInterval);
    }
  }, 1000);
}

// win
function winGame() {
  gameOver = true;
  document.getElementById("message").textContent = "You Can See Me Now";
}

// lose
function loseGame() {
  gameOver = true;
  document.getElementById("message").textContent = "You Never Found Me";
}
