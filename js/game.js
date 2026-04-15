const mapLimit = 20;

//timer setup
const timeLeft = 60;
const gameOver = false;

//teleport hidden player
function teleportHidden(hiddenPlayer) {
    hiddenPlayer.position.set(
        Math.random() * mapLimit * 2 - mapLimit,
        1,
        Math.random() * mapLimit * 2 - mapLimit
    );
}
function startTeleport(hiddenPlayer) {
    setInterval(() => {
        teleportHidden(hiddenPlayer);
    }, 3000);
}

//Distance between players
function checkDistance(player, hiddenPlayer) {
    const distance = player.position.distanceTo(hiddenPlayer.position);

    if (distance < 20) {
        hiddenPlayer.material.opacity = 1 - distance / 20;
        hiddenPlayer.material.emissiveIntensity = 2 * (1 - distance / 20);
    } else {
        hiddenPlayer.material.opacity = 0.05;
        hiddenPlayer.material.emissiveIntensity = 0;
    }
    if (distance < 2) {
        winGame();
    }
}

//Timer
function startTimer() {
    const timerInterval = setInterval(() => {
        if (gameOver) return;

        timeLeft--;
        console.log("Time:", timeLeft);

        if (timeLeft <= 0) {
            loseGame();
            clearInterval(timerInterval);
        }
    }, 1000);
}

//Win or Lose
function winGame() {
    gameOver = true;
    console.log("You Can See Me Now");
}

function loseGame() {
    gameOver = true;
    console.log("You Never Found Me");
}
