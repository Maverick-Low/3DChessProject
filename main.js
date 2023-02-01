import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Color } from 'three';
import { fill_board } from './pieces';

var scene, camera, renderer, controls, container;
 
function init() {
    // Scene
    container = document.querySelector('#scene-container'); // The container that holds the scene
    scene = new THREE.Scene();
    scene.background = new Color('grey');

    // Camera
    const aspectRatio = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(60, aspectRatio , 0.1, 50);
    camera.position.set(3.5, 6, 10);
    
    // Renderer
    renderer = new THREE.WebGLRenderer(
        {antialias : true}
    );
    container.append(renderer.domElement);
    
    // Create controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(3.5, 0, 3.5); 
    controls.maxPolarAngle = Math.PI/2;
    controls.maxDistance = 20;
    controls.minDistance = 5;
    controls.enablePan = false;
    controls.enableDamping = true;
    
    // Initialise window size
    resize_window(container, camera, renderer);
    
    // Create helpers
    const gridHelper = new THREE.GridHelper(200,50);
    scene.add(gridHelper);

    // Add objects into scene
    create_board();

    window.requestAnimationFrame(animate);
}

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
  controls.update(); // Update controls every 
  renderer.render(scene, camera);
  window.requestAnimationFrame(animate);
}
 
function resize_window(container, camera, renderer) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}
  
// Current Main
window.addEventListener('resize', () => resize_window(container, camera, renderer));
window.onload = init();
// // Adding pawns
// const {bPawn, wPawn} = await fill_board();

// bPawn.scale.set(0.4,0.4,0.4);
// bPawn.position.set(0,0,0);

// wPawn.position.set(1,0,2);
// wPawn.scale.set(0.3,0.3,0.3);
// scene.add(bPawn, wPawn);