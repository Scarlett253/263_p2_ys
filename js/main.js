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

// fog (simple, not too aggressive)
scene.fog = new THREE.Fog(0x120603, 10, 30);

// 🔥 ONLY LIGHT (keep it simple)
const fireLight = new THREE.PointLight(0xff5a1f, 6, 25);
fireLight.position.set(0, 1, 0);
scene.add(fireLight);

// visible player
const player = new THREE.Mesh(
  new THREE.SphereGeometry(0.5),
  new THREE.MeshStandardMaterial({ color: 0x00ffff }),
);
player.position.set(0, 1, 0);
scene.add(player);

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

  const speed = 0.1;
  const mapLimit = 5;

  if (keys["w"]) player.position.z -= speed;
  if (keys["s"]) player.position.z += speed;
  if (keys["a"]) player.position.x -= speed;
  if (keys["d"]) player.position.x += speed;

  player.position.y = 1;

  player.position.x = Math.max(
    -mapLimit,
    Math.min(mapLimit, player.position.x),
  );
  player.position.z = Math.max(
    -mapLimit,
    Math.min(mapLimit, player.position.z),
  );
}

// UI
const startBtn = document.getElementById("startBtn");
const startScreen = document.getElementById("startScreen");
const timerText = document.getElementById("timer");
const restartBtn = document.getElementById("restartBtn");

// start game
startBtn.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameStarted = true;

  startTimer(timerText);
  startTeleport(hiddenPlayer, player);
});

// restart
restartBtn.addEventListener("click", () => {
  location.reload();
});

// load model
const loader = new GLTFLoader();
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

// loop
function animate() {
  requestAnimationFrame(animate);

  movePlayer();
  controls.update();

  if (gameStarted && !isGameOver()) {
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
