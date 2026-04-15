import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createHiddenPlayer, hiddenPlayer } from "./player.js";
import { startTimer, checkDistance, startTeleport } from "./game.js";

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

createHiddenPlayer(scene);
hiddenPlayer.material.emissiveIntensity = 0;

startTeleport(hiddenPlayer);

//timer
const timerText = document.getElementById("timer");
startTimer(timerText);

const mapLimit = 5;

//fog
const sceneFogColor = new THREE.Color(0x222222);
scene.fog = new THREE.Fog(sceneFogColor, 20, 120);

// camera
const useFollowCamera = false; //turn on "true" to block the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 30, 60);

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// mouse controls for testing the map
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);

// lights
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(0, 20, 10);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

//player1
const playerGeometry = new THREE.SphereGeometry(0.5);
const playerMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  emissive: 0x00ffff,
});

const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1, 0);
scene.add(player);

//keys
const keys = {};

document.addEventListener("keydown", function (e) {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function (e) {
  keys[e.key.toLowerCase()] = false;
});

//player mouvement
function movePlayer() {
  const speed = 0.3;

  if (keys["w"]) player.position.z -= speed;
  if (keys["s"]) player.position.z += speed;
  if (keys["a"]) player.position.x -= speed;
  if (keys["d"]) player.position.x += speed;

  player.position.y = 1;
  player.position.x = Math.max(-mapLimit, Math.min(mapLimit, player.position.x));
  player.position.z = Math.max(-mapLimit, Math.min(mapLimit, player.position.z));
}

// load forest model
const loader = new GLTFLoader();

loader.load(
  "./models/forest.glb",
  function (gltf) {
    const forest = gltf.scene;

    forest.scale.set(0.5, 0.5, 0.5);
    forest.position.set(0, 0, 0);

    scene.add(forest);

    const box = new THREE.Box3().setFromObject(forest);
    const center = box.getCenter(new THREE.Vector3());

    controls.target.copy(center);
    camera.lookAt(center);

    console.log("model loaded");
  },
  undefined,
  function (error) {
    console.log("error loading model:", error);
  },
);

function updateCamera() {
  camera.position.x = player.position.x;
  camera.position.y = player.position.y + 10;
  camera.position.z = player.position.z + 20;

  camera.lookAt(player.position);
}
// animation loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();

  movePlayer();

  if (useFollowCamera) {
    updateCamera();
  }

  checkDistance(player, hiddenPlayer);

  renderer.render(scene, camera);
}

animate();

// keep canvas size correct if window changes
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

