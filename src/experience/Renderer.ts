import * as THREE from "three";
import Experience from "./Experience";

class Renderer {
  private readonly experience: Experience;
  instance: THREE.WebGLRenderer;

  constructor() {
    this.experience = Experience.getInstance();

    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.experience.canvas.domElement,
    });

    const { width, height, pixelRatio } = this.experience.sizes;
    this.instance.setSize(width, height);
    this.instance.setPixelRatio(pixelRatio);

    this.update();
  }

  update() {
    this.instance.render(
      this.experience.scene,
      this.experience.camera.instance
    );
  }

  resize() {
    const { width, height, pixelRatio } = this.experience.sizes;
    this.instance.setSize(width, height);
    this.instance.setPixelRatio(pixelRatio);
  }

  dispose() {
    this.instance.dispose();
  }
}

export default Renderer;
