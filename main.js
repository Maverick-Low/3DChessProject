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

// Create light source
const pointLight = new THREE.PointLight(0xffffff);
const ambientLight = new THREE.AmbientLight(0xffffff);
pointLight.position.set(10,10,5);
scene.add(pointLight, ambientLight);

// Create helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const gridHelper = new THREE.GridHelper(200,50);
scene.add(lightHelper, gridHelper);

// Create controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(3.5, 0, 3.5); 
// controls.maxPolarAngle = Math.PI/3;
controls.maxDistance = 20;
controls.minDistance = 5;


function create_board() {
  var tile = new Array(8);
  var tileGeometry = new THREE.PlaneGeometry(1, 1);
  var lightTile = new THREE.MeshBasicMaterial({color: 0xe3d8bd});
  var darkTile = new THREE.MeshBasicMaterial({color: 0x77593e});
  var board = new THREE.Group();
  for(let x = 0; x < 8; x++) {
    tile[x] = new Array(8);
    for(let z = 0; z < 8; z++) {
      if (z % 2 == false) {
        tile[x][z] = new THREE.Mesh(tileGeometry, x % 2 == false? lightTile: darkTile);
      }
      else {
        tile[x][z] = new THREE.Mesh(tileGeometry, x % 2 == false? darkTile: lightTile);
      }
      tile[x][z].position.set(x, 0, z);
      tile[x][z].rotation.x = -90*(Math.PI/180);
      board.add(tile[x][z]);
    }
  }
  scene.add(board);
}

function animate() {
  requestAnimationFrame(animate);
  
  // Resizer.onResize();
  renderer.render(scene, camera);

  // Update controls every frame
  controls.update();
}


// Current Main
create_board();
const resizer = new Responsive(container, camera, renderer);
animate();

