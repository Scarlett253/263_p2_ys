import * as THREE from "three";

export let hiddenPlayer;

export function createHiddenPlayer(scene) {
  const geometry = new THREE.SphereGeometry(0.6);

  const material = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0x00ffff,
    emissiveIntensity: 0,
    transparent: true,
    opacity: 0.1,
  });

  hiddenPlayer = new THREE.Mesh(geometry, material);
  hiddenPlayer.position.set(10, 1, 10);

  scene.add(hiddenPlayer);
}
