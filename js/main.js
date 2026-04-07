import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);
=======
//library ref
import * as THREE from 'three';
/** Modules */
//scene
let scene = new THREE.Scene();
>>>>>>> Stashed changes

// camera
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

// temporary player
const playerGeometry = new THREE.SphereGeometry(0.5);
const playerMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  emissive: 0x00ffff,
});

const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 1, 0);
scene.add(player);

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

// animation loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();

// keep canvas size correct if window changes
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
