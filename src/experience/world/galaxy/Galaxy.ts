import * as THREE from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import Experience from "../../Experience";
import GUI from "lil-gui";

type HexColor = `#${string}`;

enum StarParticlePattern {
  Disc = 0,
  DiffusePoint = 1,
  LightPoint = 2,
}

class Galaxy {
  private readonly experience: Experience;
  private geometry?: THREE.BufferGeometry;
  private material?: THREE.ShaderMaterial;
  points?: THREE.Points;
  tweaks: GUI;

  starsParticlePattern: StarParticlePattern = StarParticlePattern.Disc;
  starsSize: number = 5;
  starsAmount: number = 100000;

  galaxyRadius: number = 1.5;
  galaxyBranches: number = 5;
  galaxyRandomness: number = 0.3;
  galaxyRandomnessPower: number = 3;
  galaxyInsideColor: HexColor = "#1f33c7";
  galaxyOutsideColor: HexColor = "#da281b";
  galaxySpinSpeed: number = 0.05;

  constructor() {
    this.experience = Experience.getInstance();
    this.tweaks = this.experience.debugGUI.instance.addFolder("Galaxy");

    this.createGalaxy();
    this.setupTweaks();
  }

  private createGalaxy() {
    this.geometry = this.getGeometry();
    this.material = this.getMaterial();
    this.points = new THREE.Points(this.geometry, this.material);
    this.experience.scene.add(this.points);
  }

  update() {
    if (this.material) {
      this.material.uniforms.uTime.value = this.experience.timer.elapsedTime;
    }
  }

  regenerateGalaxy = () => {
    this.dispose(false);
    this.createGalaxy();
  };

  getMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader,
      vertexColors: true,
      fragmentShader,
      uniforms: {
        uStarsSize: {
          value: this.starsSize * this.experience.sizes.pixelRatio,
        },
        uTime: { value: 0 },
        uSpinSpeed: { value: this.galaxySpinSpeed },
        uStarPattern: { value: this.starsParticlePattern },
      },
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
  }

  getGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.starsAmount * 3);
    const colors = new Float32Array(this.starsAmount * 3);
    const scales = new Float32Array(this.starsAmount * 1);
    const randomness = new Float32Array(this.starsAmount * 3);

    const THREEColorInside = new THREE.Color(this.galaxyInsideColor);
    const THREEColorOutside = new THREE.Color(this.galaxyOutsideColor);

    for (let i = 0; i < this.starsAmount; i++) {
      /* STARS POSITIONS */
      const i3 = i * 3;
      const posX = i3;
      const posY = i3 + 1;
      const posZ = i3 + 2;

      const randomRadius = Math.random() * this.galaxyRadius;

      const branchAngle =
        ((i % this.galaxyBranches) / this.galaxyBranches) * Math.PI * 2;

      positions[posX] = Math.cos(branchAngle) * randomRadius;
      positions[posY] = 0;
      positions[posZ] = Math.sin(branchAngle) * randomRadius;

      /* STARS COLORS */
      const posR = i3;
      const posG = i3 + 1;
      const posB = i3 + 2;

      const mixedColor = THREEColorOutside.clone();
      mixedColor.lerp(THREEColorInside, randomRadius / this.galaxyRadius);

      colors[posR] = mixedColor.r;
      colors[posG] = mixedColor.g;
      colors[posB] = mixedColor.b;

      /* STARS SCALES */
      scales[i] = Math.random();

      /* RANDOMNESS */
      const randomX =
        Math.pow(Math.random(), this.galaxyRandomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.galaxyRandomness *
        randomRadius;
      const randomY =
        Math.pow(Math.random(), this.galaxyRandomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.galaxyRandomness *
        (randomRadius / 2);
      const randomZ =
        Math.pow(Math.random(), this.galaxyRandomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        this.galaxyRandomness *
        randomRadius;

      randomness[posX] = randomX;
      randomness[posY] = randomY;
      randomness[posZ] = randomZ;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute(
      "aRandomness",
      new THREE.BufferAttribute(randomness, 3)
    );

    return geometry;
  }

  replayAnimation() {
    this.experience.timer.reset();
  }

  setupTweaks() {
    this.tweaks
      .add(this, "starsParticlePattern")
      .options({
        Disc: StarParticlePattern.Disc,
        DiffusePoint: StarParticlePattern.DiffusePoint,
        LightPoint: StarParticlePattern.LightPoint,
      })
      .name("StarsParticlePattern")
      .onFinishChange(this.regenerateGalaxy);

    this.tweaks
      .add(this, "galaxySpinSpeed")
      .min(0)
      .max(0.5)
      .step(0.001)
      .name("GalaxySpinSpeed")
      .onFinishChange(this.regenerateGalaxy);

    this.tweaks
      .add(this, "starsSize")
      .min(0.001)
      .max(15)
      .step(0.001)
      .name("StarsSize")
      .onFinishChange(this.regenerateGalaxy);
    this.tweaks
      .add(this, "starsAmount")
      .min(1000)
      .max(200000)
      .step(1000)
      .name("StarsAmount")
      .onFinishChange(this.regenerateGalaxy);

    this.tweaks
      .add(this, "galaxyRadius")
      .min(0)
      .max(8)
      .step(0.001)
      .name("GalaxyRadius")
      .onFinishChange(this.regenerateGalaxy);
    this.tweaks
      .add(this, "galaxyBranches")
      .min(1)
      .max(10)
      .step(1)
      .name("GalaxyBranches")
      .onFinishChange(this.regenerateGalaxy);

    this.tweaks
      .add(this, "galaxyRandomness")
      .min(0)
      .max(3)
      .step(0.001)
      .name("GalaxyRandomness")
      .onFinishChange(this.regenerateGalaxy);
    this.tweaks
      .add(this, "galaxyRandomnessPower")
      .min(0)
      .max(9)
      .step(0.01)
      .name("GalaxyRandomnessPower")
      .onFinishChange(this.regenerateGalaxy);
    this.tweaks
      .addColor(this, "galaxyInsideColor")
      .name("GalaxyInsideColor")
      .onFinishChange(this.regenerateGalaxy);
    this.tweaks
      .addColor(this, "galaxyOutsideColor")
      .name("GalaxyOutsideColor")
      .onFinishChange(this.regenerateGalaxy);
    this.tweaks.add(this, "replayAnimation").name("Replay Spin Animation");
  }

  dispose(includeTweaks: boolean = true) {
    if (this.points) {
      this.experience.scene.remove(this.points);
      this.points = undefined;
    }
    if (this.geometry) {
      this.geometry.dispose();
      this.geometry = undefined;
    }
    if (this.material) {
      this.material.dispose();
      this.material = undefined;
    }
    if (includeTweaks) {
      this.tweaks.destroy();
    }
  }
}

export default Galaxy;
