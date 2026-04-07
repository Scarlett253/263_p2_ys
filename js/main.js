import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/loaders/GLTFLoader.js';

/** Modules */
//scene
let scene = new THREE.Scene();

//camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

//renderer
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//fog
scene.fog = new THREE.Fog(0x000000, 5, 40);

//light
let light = new THREE.PointLight(0x00ffff, 2);
light.position.set(0, 10, 0);
scene.add(light);

//player
let playerGeo = new THREE.SphereGeometry(0.5);
let playerMat = new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff });

let player = new THREE.Mesh(playerGeo, playerMat);
player.position.set(0, 1, 0);
scene.add(player);

// load forest
let loader = new GLTFLoader();

loader.load('models/forest.glb', function (gltf) {
    let forest = gltf.scene;
    forest.scale.set(2, 2, 2);
    scene.add(forest);
});

//controls
let keys = {};

document.addEventListener("keydown", function (e) {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function (e) {
    keys[e.key.toLowerCase()] = false;
});

//movement
function movePlayer() {
    let speed = 0.1;

    if (keys["w"]) player.position.z -= speed;
    if (keys["s"]) player.position.z += speed;
    if (keys["a"]) player.position.x -= speed;
    if (keys["d"]) player.position.x += speed;
}

//camera follow 