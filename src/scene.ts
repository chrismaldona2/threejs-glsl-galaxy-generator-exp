import { OrbitControls, Timer } from "three/examples/jsm/Addons.js";
import { toggleFullscreen } from "./fullscreen";
import "./style.css";
import * as THREE from "three";
import GUI from "lil-gui";

/* SETUP */
const gui = new GUI({ title: "Galaxy", width: 400 });
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const canvas = document.getElementById("canvas")!;

/* SCENE */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0b07);

/* CAMERA */
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.01,
  1000
);
camera.position.set(1.25, 1, 1.25);
scene.add(camera);

/* RENDERER */
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

/* ORBIT CONTROLS */
const orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.05;

/* TEXTURE LOADER */
const textureLoader = new THREE.TextureLoader();
const starTexture1 = textureLoader.load("./particles/1.png");
const starTexture2 = textureLoader.load("./particles/2.png");
const starTexture3 = textureLoader.load("./particles/3.png");
const starTexture4 = textureLoader.load("./particles/4.png");
const starTexture5 = textureLoader.load("./particles/5.png");

/* SCENE OBJECTS */
/* GALAXY */
let galaxy: THREE.Points;
let starsGeometry: THREE.BufferGeometry;
let starsMaterial: THREE.Material;

const params = {
  stars: {
    size: 0.001,
    amount: 100000,
    enableTexture: false,
    currentTexture: starTexture1,
  },
  shape: {
    radius: 0.35,
    branches: 6,
    spin: -4.5,
    randomness: 0.75,
    randomnessPower: 3,
    insideColor: 0x1f33c7,
    outsideColor: 0xda281b,
    starsConcentration: 2,
  },
};

const generateGalaxy = () => {
  /* STARS */
  /* STARS DISPOSING */
  if (galaxy !== null) {
    starsGeometry?.dispose();
    starsMaterial?.dispose();
    scene.remove(galaxy);
  }

  /* STARS GEOMETRY */
  starsGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.stars.amount * 3);
  const colors = new Float32Array(params.stars.amount * 3);

  for (let i = 0; i < params.stars.amount * 3; i++) {
    /* STARS POSITIONS */
    const {
      branches,
      randomness,
      randomnessPower,
      radius,
      spin,
      insideColor,
      outsideColor,
      starsConcentration,
    } = params.shape;

    const ThreeColorInside = new THREE.Color(insideColor);
    const ThreeColorOutside = new THREE.Color(outsideColor);

    const i3 = i * 3;

    const posX = i3;
    const posY = i3 + 1;
    const posZ = i3 + 2;

    const randomRadius = Math.pow(Math.random(), starsConcentration) * radius;

    const spinAngle = randomRadius * spin;
    const angle = ((i % branches) / branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      randomRadius;
    const randomY =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      (randomRadius / 2);
    const randomZ =
      Math.pow(Math.random(), randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      randomness *
      randomRadius;

    positions[posX] = Math.cos(angle + spinAngle) * randomRadius + randomX;
    positions[posY] = randomY;
    positions[posZ] = Math.sin(angle + spinAngle) * randomRadius + randomZ;

    /* STARS COLORS */
    const posR = i3;
    const posG = i3 + 1;
    const posB = i3 + 2;

    const mixedColor = ThreeColorInside.clone();
    mixedColor.lerp(ThreeColorOutside, randomRadius / radius);

    colors[posR] = mixedColor.r;
    colors[posG] = mixedColor.g;
    colors[posB] = mixedColor.b;
  }

  starsGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );

  starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  /* STARS MATERIAL */

  if (params.stars.enableTexture) {
    starsMaterial = new THREE.PointsMaterial({
      size: params.stars.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      alphaMap: params.stars.currentTexture,
      transparent: true,
    });
  } else {
    starsMaterial = new THREE.PointsMaterial({
      size: params.stars.size,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
    });
  }

  /* STARS PARTICLES */
  galaxy = new THREE.Points(starsGeometry, starsMaterial);

  scene.add(galaxy);
};
generateGalaxy();

/* STARS TWEAKS */
const starsTweaks = gui.addFolder("Stars");
starsTweaks
  .add(params.stars, "size")
  .min(0.0001)
  .max(0.01)
  .step(0.0001)
  .name("Size")
  .onFinishChange(generateGalaxy);
starsTweaks
  .add(params.stars, "amount")
  .min(1000)
  .max(200000)
  .step(1000)
  .name("Amount")
  .onFinishChange(generateGalaxy);
starsTweaks
  .add(params.stars, "enableTexture")
  .name("Enable texture")
  .onFinishChange(generateGalaxy);

starsTweaks
  .add(params.stars, "currentTexture", {
    1: starTexture1,
    2: starTexture2,
    3: starTexture3,
    4: starTexture4,
    5: starTexture5,
  })
  .name("Texture")
  .onFinishChange(generateGalaxy);

/* GALAXY SHAPE TWEAK */
const shapeTweaks = gui.addFolder("Shape");
shapeTweaks
  .add(params.shape, "radius")
  .min(0)
  .max(7)
  .step(0.001)
  .name("Radius")
  .onFinishChange(generateGalaxy);
shapeTweaks
  .add(params.shape, "branches")
  .min(1)
  .max(10)
  .step(1)
  .name("Branches")
  .onFinishChange(generateGalaxy);
shapeTweaks
  .add(params.shape, "spin")
  .min(-25)
  .max(25)
  .step(0.001)
  .name("Spin")
  .onFinishChange(generateGalaxy);
shapeTweaks
  .add(params.shape, "randomness")
  .min(0)
  .max(3)
  .step(0.001)
  .name("Randomness")
  .onFinishChange(generateGalaxy);
shapeTweaks
  .add(params.shape, "randomnessPower")
  .min(0)
  .max(9)
  .step(0.001)
  .name("Randomness power")
  .onFinishChange(generateGalaxy);
shapeTweaks
  .add(params.shape, "starsConcentration")
  .min(0)
  .max(9)
  .step(0.001)
  .name("Stars concentration")
  .onFinishChange(generateGalaxy);
shapeTweaks
  .addColor(params.shape, "insideColor")
  .name("Inside color")
  .onFinishChange(generateGalaxy);
shapeTweaks
  .addColor(params.shape, "outsideColor")
  .name("Outside color")
  .onFinishChange(generateGalaxy);

/* RENDERING */
const timer = new Timer();
const animate = () => {
  window.requestAnimationFrame(animate);
  timer.update();

  const elapsedTime = timer.getElapsed();
  galaxy.rotation.y = elapsedTime * 0.0015;

  orbitControls.update();
  renderer.render(scene, camera);
};
animate();

/* EVENT LISTENERS */
renderer.domElement.addEventListener("dblclick", () =>
  toggleFullscreen(renderer.domElement)
);
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  if (camera instanceof THREE.PerspectiveCamera) {
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  }
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
});
window.addEventListener("keydown", (event) => {
  switch (event.key.toLowerCase()) {
    case "f":
      toggleFullscreen(renderer.domElement);
      break;
    case "h":
      gui.show(gui._hidden);
      break;
  }
});
