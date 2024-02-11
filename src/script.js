import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";

import * as dat from 'dat.gui';
import { gsap } from "gsap";

import soccerPitch from "./img/soccerPitch1.jpg";
import dirt from "./img/dirt.jpg";
import grass from "./img/grass.jpg";

// const fbxTest = require("url:./models/test.fbx");
// const running = require("url:./models/running.fbx");
const runningDiagonal = require("url:./models/diagonal.fbx");
const kick = require("url:./models/kickFowardJog.fbx");

const gui = new dat.GUI();

// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 10;
camera.position.z = 10;
// camera.position.y = 1;
// camera.position.x = 12;
// camera.position.z = -20;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
// const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
// directionalLight.castShadow = true;
// directionalLight.position.y = 2;
scene.add(ambientLight);

const spotLight1 = new THREE.SpotLight(0xffffff, 300);
spotLight1.castShadow = true;
spotLight1.position.set(0, 30, 15);
const spotLightHelper1 = new THREE.SpotLightHelper(spotLight1);
scene.add(spotLight1);

const spotLight2 = new THREE.SpotLight(0xffffff1, 300);
spotLight2.castShadow = true;
spotLight2.penumbra = 0;
spotLight2.position.set(40, 30, 0);
const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
scene.add(spotLight2);

const spotLight3 = new THREE.SpotLight(0xffffff, 300);
spotLight3.castShadow = true;
spotLight3.position.set(-40, 30, 0);
const spotLightHelper3 = new THREE.SpotLightHelper(spotLight3);
scene.add(spotLight3);

const spotLight4 = new THREE.SpotLight(0xffffff, 300);
spotLight4.castShadow = true;
spotLight4.position.set(0, 30, -15);
const spotLightHelper4 = new THREE.SpotLightHelper(spotLight4);
scene.add(spotLight4);

// const spotLight5 = new THREE.SpotLight(0xffffff1, 200);
// spotLight5.castShadow = true;
// spotLight5.position.set(40, 15, -15);
// const spotLightHelper5 = new THREE.SpotLightHelper(spotLight5);
// scene.add(spotLight5, spotLightHelper5);

// const spotLight6 = new THREE.SpotLight(0xffffff, 200);
// spotLight6.castShadow = true;
// spotLight6.position.set(-40, 15, -15);
// const spotLightHelper6 = new THREE.SpotLightHelper(spotLight6);
// scene.add(spotLight6, spotLightHelper6);

// const spotLight7 = new THREE.SpotLight(0xffffff, 100);
// spotLight7.castShadow = true;
// spotLight7.position.set(60, 15, 15);
// const spotLightHelper7 = new THREE.SpotLightHelper(spotLight7);
// scene.add(spotLight7, spotLightHelper7);

// const spotLight8 = new THREE.SpotLight(0xffffff, 100);
// spotLight8.castShadow = true;
// spotLight8.position.set(-60, 15, -15);
// const spotLightHelper8 = new THREE.SpotLightHelper(spotLight8);
// scene.add(spotLight8, spotLightHelper8);

// Texture
const textureLoader = new THREE.TextureLoader();

// Meshes
const cubeGeo = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "orange" });
const cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial);
cubeMesh.castShadow = true;
cubeMesh.receiveShadow = true;
// scene.add(cubeMesh);

const dirtTexture = textureLoader.load(dirt);
// dirtTexture.wrapS = THREE.RepeatWrapping;
// dirtTexture.wrapT = THREE.RepeatWrapping;
// dirtTexture.repeat.set(50, 50);
const pitchMaterials = [
  new THREE.MeshPhysicalMaterial({ color: 0x3a241d, emissive: 0x221411, roughness: 1 }),
  new THREE.MeshStandardMaterial({ map: dirtTexture }),
  new THREE.MeshStandardMaterial({ map: textureLoader.load(soccerPitch) }),
  new THREE.MeshStandardMaterial({ map: textureLoader.load(dirt) }),
  new THREE.MeshStandardMaterial({ map: dirtTexture }),
  new THREE.MeshStandardMaterial({ map: dirtTexture }),
]

const pitchGeo = new THREE.BoxGeometry(66, 0.5, 40, 5, 5);
// const pitchGeo = new THREE.BoxBufferGeometry(36, 0.5, 20, 10, 1, 10);
// const planeMaterial = new THREE.MeshStandardMaterial({ map: textureLoader.load() });
const pitchMesh = new THREE.Mesh(pitchGeo, pitchMaterials);
pitchMesh.receiveShadow = true;
pitchMesh.position.y = -0.23;
pitchMesh.rotation.x = -Math.PI * 2;
scene.add(pitchMesh);

const ballGeo = new THREE.SphereGeometry(0.1, 32, 16);
const ballMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const ballMesh = new THREE.Mesh(ballGeo, ballMaterial);
ballMesh.position.set(13, 0.2, -15);
scene.add(ballMesh);

// Controls
const orbitControls = new OrbitControls(camera, renderer.domElement);

// loaders
let animationMixer1 = null;
let animationMixer2 = null;
const fbxLoader = new FBXLoader();
fbxLoader.load(runningDiagonal, (fbx) => {
  animationMixer1 = new THREE.AnimationMixer(fbx);
  const clipAction = animationMixer1.clipAction(fbx.animations[0]);
  clipAction.setLoop(THREE.LoopOnce);
  clipAction.clampWhenFinished = true;
  clipAction.timeScale = 0.3;
  clipAction.play();
  fbx.rotation.y = Math.PI;
  fbx.scale.set(0.01, 0.01, 0.01);
  fbx.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  })
  scene.add(fbx);
});

fbxLoader.load(kick, (fbx) => {
  animationMixer2 = new THREE.AnimationMixer(fbx);
  const clipAction = animationMixer2.clipAction(fbx.animations[0]);
  clipAction.setLoop(THREE.LoopOnce);
  clipAction.clampWhenFinished = true;
  clipAction.timeScale = 0.2;
  // clipAction.paused = true;
  clipAction.play();
  fbx.position.x = 15;
  fbx.position.z = -15;
  fbx.rotation.y = -Math.PI / 2;
  fbx.scale.set(0.01, 0.01, 0.01);
  fbx.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  })
  scene.add(fbx);
  setTimeout(() => clipAction.paused = true, 1745);
});

// DAT.GUI
// gui.add(spotLight1.position, "x").min(-50).max(50).name("Spot One")
// gui.add(spotLight1.position, "y").min(-50).max(50).name("Spot One")
// gui.add(spotLight1.position, "z").min(-50).max(50).name("Spot One")
// gui.add(spotLight2.position, "x").min(-50).max(50).name("Spot Two")
// gui.add(spotLight2.position, "y").min(-50).max(50).name("Spot Two")
// gui.add(spotLight2.position, "z").min(-50).max(50).name("Spot Two")
// gui.add(spotLight3.position, "x").min(-50).max(50).name("Spot Three")
// gui.add(spotLight3.position, "y").min(-50).max(50).name("Spot Three")
// gui.add(spotLight3.position, "z").min(-50).max(50).name("Spot Three")
// gui.add(spotLight4.position, "x").min(-50).max(50).name("Spot Four")
// gui.add(spotLight4.position, "y").min(-50).max(50).name("Spot Four")
// gui.add(spotLight4.position, "z").min(-50).max(50).name("Spot Four")
// gui.add(spotLight5.position, "x").min(-50).max(50).name("Spot Five")
// gui.add(spotLight5.position, "y").min(-50).max(50).name("Spot Five")
// gui.add(spotLight5.position, "z").min(-50).max(50).name("Spot Five")
// gui.add(spotLight6.position, "x").min(-50).max(50).name("Spot Six")
// gui.add(spotLight6.position, "y").min(-50).max(50).name("Spot Six")
// gui.add(spotLight6.position, "z").min(-50).max(50).name("Spot Six")

gsap.to(camera.position, {
  x: 13,
  y: 1,
  z: -17,
  duration: 5
})

gsap.to(camera.rotation, {
  x: 0,
  y: 3,
  z: 0,
  duration: 5.2
})

// Animation loop
const clock = new THREE.Clock();
let previousTime = 0;
function animate() {
  const elapsedTime = clock.getElapsedTime();
  const frameTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (animationMixer1 && animationMixer2) {
    animationMixer1.update(frameTime);
    animationMixer2.update(frameTime);
  }

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();