import * as THREE from "three";
import Experience from "../Experience";

class Environment {
  private readonly experience: Experience;

  constructor() {
    this.experience = Experience.getInstance();
    this.experience.scene.background = new THREE.Color("#0a0b07");
  }
}

export default Environment;
