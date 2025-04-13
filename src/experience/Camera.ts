import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class Camera {
  private readonly experience: Experience;
  instance: THREE.PerspectiveCamera;
  controls: OrbitControls;

  constructor() {
    this.experience = Experience.getInstance();
    const { width, height } = this.experience.sizes;

    this.instance = new THREE.PerspectiveCamera(45, width / height, 0.001, 100);
    this.instance.position.set(1.15, 1.15, 1.15);
    this.experience.scene.add(this.instance);

    /* ORBIT CONTROLS */
    this.controls = new OrbitControls(
      this.instance,
      this.experience.canvas.domElement
    );
    this.controls.enableDamping = true;
    this.controls.maxTargetRadius = 2;
  }

  update() {
    this.controls.update();
  }

  resize() {
    const { width, height } = this.experience.sizes;
    this.instance.aspect = width / height;
    this.instance.updateProjectionMatrix();
  }

  dispose() {
    this.controls.dispose();
    this.experience.scene.remove(this.instance);
  }
}

export default Camera;
