import * as THREE from "three";
import Sizes from "./utils/Sizes";
import Canvas from "./Canvas";
import Camera from "./Camera";
import Timer from "./utils/Timer";
import Renderer from "./Renderer";
import World from "./world/World";
import FullscreenHandler from "./utils/FullscreenHandler";
import DebugGUI from "./utils/Debug";

class Experience {
  private static instance: Experience;
  debugGUI!: DebugGUI;
  canvas!: Canvas;
  fullscreenHandler!: FullscreenHandler;
  sizes!: Sizes;
  timer!: Timer;
  scene!: THREE.Scene;
  camera!: Camera;
  renderer!: Renderer;
  world!: World;

  constructor() {
    /* SINGLETON */
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;

    /* ↓ JUST FOR DEVTOOLS DEBUG PURPOSES */
    // @ts-ignore
    window.experience = this;

    /* SETUP */
    this.debugGUI = new DebugGUI();
    this.canvas = new Canvas();
    this.fullscreenHandler = new FullscreenHandler();
    this.sizes = new Sizes();
    this.timer = new Timer();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.world = new World();

    this.sizes.on("resize", () => this.resize());
    this.timer.on("tick", () => this.update());
  }

  update() {
    this.world.update();
    this.camera.update();
    this.renderer.update();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  destroy() {
    this.debugGUI.destroy();
    this.fullscreenHandler.dispose();
    this.sizes.dispose();
    this.camera.dispose();
    this.canvas.destroy();
    this.renderer.dispose();
    this.world.dispose();
  }

  static getInstance() {
    if (!Experience.instance) {
      throw new Error();
    }
    return Experience.instance;
  }
}

export default Experience;
