import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

// Initialising screen and scene
const aspectRatio = window.innerWidth/window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspectRatio , 0.1, 1000);
const renderer = new THREE.WebGLRenderer(
  {canvas: document.querySelector('#bg'),}
);
// const background = new THREE.TextureLoader().load('textures/rubber-fig-gray-room.jpg');
// scene.background = background;
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
renderer.render(scene, camera);

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
      tile.position.set(x-3.5, 0, z-3.5);
      board.add(tile);
    }
  }
  return board;
}

function animate() {
  requestAnimationFrame(animate);
  
  renderer.render(scene, camera)

  // Update controls every frame
  controls.update();
}

animate();

