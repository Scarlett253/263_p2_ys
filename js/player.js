import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export let hiddenPlayer;

export function createHiddenPlayer(scene) {
  const loader = new GLTFLoader();

  loader.load(
    "./models/ghost_of_tsushiito.glb",
    (gltf) => {
      hiddenPlayer = gltf.scene;

      // make it visible enough first so we know it loaded
      hiddenPlayer.scale.set(0.6, 0.6, 0.6);
      hiddenPlayer.position.set(5, 2, 5);

      hiddenPlayer.traverse((child) => {
        if (child.isMesh) {
          child.material.transparent = true;
          child.material.opacity = 0.6;

          child.material.emissive = new THREE.Color(0x88ccff);
          child.material.emissiveIntensity = 1.5;
        }
      });

      scene.add(hiddenPlayer);
      console.log("hidden presence loaded");
    },
    undefined,
    (error) => {
      console.log("error loading hidden player:", error);
    },
  );
}
