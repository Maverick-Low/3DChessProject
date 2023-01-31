import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Color } from 'three';
import {Responsive} from './Responsive.js';

// Scene
const container = document.querySelector('#scene-container'); // The container that holds the scene
const scene = new THREE.Scene();
scene.background = new Color('grey');
// const background = new THREE.TextureLoader().load('textures/rubber-fig-gray-room.jpg');
// scene.background = background;

// Camera
const aspectRatio = container.clientWidth / container.clientHeight;
const camera = new THREE.PerspectiveCamera(60, aspectRatio , 0.1, 1000);
camera.position.set(3.5, 6, 10);

// Renderer
const renderer = new THREE.WebGLRenderer(
  {antialias : true}
);
container.append(renderer.domElement);


// Creating an object
const geometry = new THREE.BoxGeometry(0.1, 100, 0.1)
const material = new THREE.MeshStandardMaterial({color: 0xFF6347, wireframe: true});
const origin = new THREE.Mesh(geometry, material);
scene.add(origin);

// Chess board properties
const tileGeometry = new THREE.BoxGeometry(1, 0.1, 1);
const lightTile = new THREE.MeshBasicMaterial({color: 0xe3d8bd});
const darkTile = new THREE.MeshBasicMaterial({color: 0x77593e});
scene.add(create_board());

// Create light source
const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(10,10,5);
scene.add(pointLight, ambientLight);

// Create helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper)

// Create controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(3.5, 0, 3.5); 
controls.maxPolarAngle = Math.PI/3;
controls.maxDistance = 20;
controls.minDistance = 5;


function create_board() {
  const board = new THREE.Group();
  for(let x = 0; x < 8; x++) {
    for(let z = 0; z < 8; z++) {
      if (z % 2 == false) {
        var tile;
        tile = new THREE.Mesh(tileGeometry, x % 2 == false? lightTile: darkTile);
      }
      else {
        tile = new THREE.Mesh(tileGeometry, x % 2 == false? darkTile: lightTile);
      }
      tile.position.set(x, 0, z);
      board.add(tile);
    }
  }
  return board;
}

function animate() {
  requestAnimationFrame(animate);
  
  // Resizer.onResize();
  renderer.render(scene, camera);

  // Update controls every frame
  controls.update();
}


// Current Main
const resizer = new Responsive(container, camera, renderer);
animate();

