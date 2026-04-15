const mapLimit = 5;

//timer setup
let timeLeft = 60;
let gameOver = false;

//teleport hidden player
export function teleportHidden(hiddenPlayer) {
    hiddenPlayer.position.set(
        Math.random() * mapLimit * 2 - mapLimit,
        1,
        Math.random() * mapLimit * 2 - mapLimit
    );
}
export function startTeleport(hiddenPlayer) {
    setInterval(() => {
        teleportHidden(hiddenPlayer);
    }, 3000);
}

//Distance between players
export function checkDistance(player, hiddenPlayer) {
    const distance = player.position.distanceTo(hiddenPlayer.position);

    if (distance < 1.5) {
        hiddenPlayer.material.opacity = 1 - distance / 20;
        hiddenPlayer.material.emissiveIntensity = 5
    } else {
        hiddenPlayer.material.opacity = 0.05;
        hiddenPlayer.material.emissiveIntensity = 0;
    }
    if (distance < 2) {
        winGame();
    }
}

//Timer
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

//Win or Lose
function winGame() {
    gameOver = true;
    document.getElementById("message").textContent = "You Can See Me Now";
}

function loseGame() {
    gameOver = true;
    document.getElementById("message").textContent = "You Never Found Me";
}
