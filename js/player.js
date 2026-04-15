export let hiddenPlayer;

export function createHiddenPlayer(scene) {
    const geometry = new THREE.SphereGeometry(0.6);

    const material = new THREE.MeshStandardMaterial({

    })

    /** Players effects */
    //glow
    const hiddenMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0,
        transparent: true,
        opacity: 0.1,
    });