import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createHiddenPlayer, hiddenPlayer } from "./player.js";
import {
  startTimer,
  checkDistance,
  startTeleport,
  isGameOver,
} from "./game.js";

// UI
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const timerText = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");
const message = document.getElementById("message");
const bgMusic = document.getElementById("bgMusic");

// end screen
const endScreen = document.getElementById("endScreen");
const winGif = document.getElementById("winGif");
const loseGif = document.getElementById("loseGif");

// 🎵 START MUSIC ON START SCREEN
window.addEventListener("load", () => {
  if (bgMusic) {
    bgMusic.volume = 0.2;
    bgMusic.play().catch((error) => {
      console.log("autoplay blocked:", error);
    });
  }
});

// game state
let gameStarted = false;

// scene
const scene = new THREE.Scene();

// camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 3, 8);

// renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = true;
controls.enableZoom = true;
controls.target.set(0, 1, 0);

// stop camera from going under the map
controls.minPolarAngle = 0.3;
controls.maxPolarAngle = Math.PI / 2.2;

// limit zoom
controls.minDistance = 4;
controls.maxDistance = 12;

// fog
scene.fog = new THREE.Fog(0x3a2a1f, 10, 30);

// light
const fireLight = new THREE.PointLight(0xff5a1f, 10, 35);
fireLight.position.set(0, 1, 0);
scene.add(fireLight);

// player model
let player = null;

// load player avatar
const loader = new GLTFLoader();
loader.load(
  "./models/chubby_ghost.glb",
  (gltf) => {
    player = gltf.scene;
    player.scale.set(0.06, 0.06, 0.06);
    player.position.set(0, 0.3, 0);
    scene.add(player);
  },
  undefined,
  (error) => {
    console.log("error loading player:", error);
  },
);

// hidden player
createHiddenPlayer(scene);

// keyboard input
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// movement
function movePlayer() {
  if (!gameStarted) return;
  if (isGameOver()) return;
  if (!player) return;

  const speed = 0.1;
  const mapLimit = 5;

  if (keys["w"]) {
    player.position.z -= speed;
    player.rotation.y = Math.PI;
  }

  if (keys["s"]) {
    player.position.z += speed;
    player.rotation.y = 0;
  }

  if (keys["a"]) {
    player.position.x -= speed;
    player.rotation.y = -Math.PI / 2;
  }

  if (keys["d"]) {
    player.position.x += speed;
    player.rotation.y = Math.PI / 2;
  }

  player.position.y = 0.3;

  player.position.x = Math.max(
    -mapLimit,
    Math.min(mapLimit, player.position.x),
  );
  player.position.z = Math.max(
    -mapLimit,
    Math.min(mapLimit, player.position.z),
  );
}

// start game
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameStarted = true;

  startTimer(timerText);

  if (player && hiddenPlayer) {
    startTeleport(hiddenPlayer, player);
  } else {
    const waitForModels = setInterval(() => {
      if (player && hiddenPlayer) {
        startTeleport(hiddenPlayer, player);
        clearInterval(waitForModels);
      }
    }, 100);
  }
});

// restart
restartBtn.addEventListener("click", () => {
  location.reload();
});

// load forest model
loader.load(
  "./models/forest.glb",
  (gltf) => {
    const forest = gltf.scene;
    forest.scale.set(0.5, 0.5, 0.5);
    forest.position.set(0, 0, 0);
    scene.add(forest);
  },
  undefined,
  (error) => {
    console.log("error loading model:", error);
  },
);

// end game screens
function showWinScreen() {
  message.textContent = "You Can See Me Now";
  endScreen.style.display = "flex";
  requestAnimationFrame(() => {
    endScreen.classList.add("show");
  });
  winGif.style.display = "block";
  loseGif.style.display = "none";
}

function showLoseScreen() {
  message.textContent = "You Never Found Me";
  endScreen.style.display = "flex";
  requestAnimationFrame(() => {
    endScreen.classList.add("show");
  });
  loseGif.style.display = "block";
  winGif.style.display = "none";
}

// let game.js access both
window.showWinScreen = showWinScreen;
window.showLoseScreen = showLoseScreen;

// loop
function animate() {
  requestAnimationFrame(animate);

  movePlayer();
  controls.update();

  if (gameStarted && !isGameOver() && player && hiddenPlayer) {
    checkDistance(player, hiddenPlayer);
  }

  renderer.render(scene, camera);
}

animate();

// resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
