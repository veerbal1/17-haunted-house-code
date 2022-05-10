import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'lil-gui';
import audioFile from '../static/audio/mixkit-cinematic-horror-trailer-long-sweep-561.wav';
import wolfsAudioFile from '../static/audio/wolfs.wav';
import wolfs2AudioFile from '../static/audio/wolf2.wav';

import { gsap } from 'gsap';

console.log(gsap);

// Audio
var audio = new Audio(audioFile);
var wolfAudio = new Audio(wolfsAudioFile);
var wolf2Audio = new Audio(wolfs2AudioFile);

let startBtn;
let preloader;
// dom element
window.onload = () => {
  preloader = document.getElementById('preloader');
  startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', () => {
    audio.play();
    animateCamera();
    preloader.classList.add('hide');
  });
};

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
gui.hide();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Fog
 */
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load(
  require('../static/textures/door/color.jpg')
);
const doorAlphaTexture = textureLoader.load(
  require('../static/textures/door/alpha.jpg')
);
const doorAmbientOcclusionTexture = textureLoader.load(
  require('../static/textures/door/ambientOcclusion.jpg')
);
const doorHeightTexture = textureLoader.load(
  require('../static/textures/door/height.jpg')
);
const doorNormalTexture = textureLoader.load(
  require('../static/textures/door/normal.jpg')
);
const doorMetalnessTexture = textureLoader.load(
  require('../static/textures/door/metalness.jpg')
);
const doorRoughnessTexture = textureLoader.load(
  require('../static/textures/door/roughness.jpg')
);

const bricksColorTexture = textureLoader.load(
  require('../static/textures/bricks/color.jpg')
);
const bricksAmbientOcclusionTexture = textureLoader.load(
  require('../static/textures/bricks/ambientOcclusion.jpg')
);
const bricksNormalTexture = textureLoader.load('../static/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load(
  require('../static/textures/bricks/roughness.jpg')
);

const grassColorTexture = textureLoader.load(
  require('../static/textures/grass/color.jpg')
);
const grassAmbientOcclusionTexture = textureLoader.load(
  require('../static/textures/grass/ambientOcclusion.jpg')
);
const grassNormalTexture = textureLoader.load(
  require('../static/textures/grass/normal.jpg')
);
const grassRoughnessTexture = textureLoader.load(
  require('../static/textures/grass/roughness.jpg')
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// walls
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = 1.25;
walls.castShadow = true;
house.add(walls);

const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
);
roof.castShadow = true;
roof.rotateY(Math.PI / 4);
roof.position.y = 2.5 + 0.5;
house.add(roof);

// door
const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);

door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
// door.rotateY(-Math.PI / 2);
door.position.y = 1;
door.position.z = 2 + 0.01;
house.add(door);

// Bush geometry
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0x89c854,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);
bush1.castShadow = true;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);
bush1.castShadow = true;
house.add(bush1, bush2);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2; // Random angle
  const radius = 3 + Math.random() * 6; // Random radius
  const x = Math.cos(angle) * radius; // Get the x position using cosinus
  const z = Math.sin(angle) * radius; // Get the z position using sinus

  // Create the mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.castShadow = true;

  // Position
  grave.position.set(x, 0.3, z);

  // Rotation
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;

  // Add to the graves container
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
moonLight.castShadow = true;
scene.add(moonLight);

// door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.set(0, 2.2, 2.7);
doorLight.castShadow = true;
scene.add(doorLight);

// Ghost
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
ghost1.castShadow = true;
scene.add(ghost1);

const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
ghost2.castShadow = true;
scene.add(ghost2);

const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
ghost3.castShadow = true;
scene.add(ghost3);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 8;
camera.position.y = 8;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.position0.set(4, 2, 5);
// controls.maxPolarAngle = Math.PI * 0.5 - 0.1;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');
renderer.shadowMap.enabled = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  // Render
  renderer.render(scene, camera);
  // console.log(controls.getPosition());

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

const animateCamera = () => {
  // animate camera using gsap
  gsap
    .to(camera.position, {
      duration: 4,
      x: 4,
      y: 4,
      z: 3,
      ease: 'power3.out',
    })
    .then(() => {
      wolfAudio.play();
      console.log((Math.random() * 0.3).toFixed(1));
      setInterval(() => {
        let randomVal = (Math.random() * 0.3).toFixed(1);
        console.log(randomVal);
        if (randomVal === '0.2') {
          wolfAudio.play();
        } else if (randomVal === '0.1') {
          wolf2Audio.play();
        }
      }, 8000);
    });
};
