import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Color } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

var scene, camera, renderer, controls, container, Chess, board;
var fileName = '/assets/models/2Dplus3DChessSet.glb';

function init() {
    // Scene
    Chess = new ChessEngine();

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

    // Add lights
    const light = new THREE.PointLight( 0xffffff, 2, 200 );
    light.position.set(3.5, 10, 3.5);
    scene.add(light);

    // Add objects into scene
    create_board();

    const loader = new GLTFLoader();
    loader.load(fileName, function ( gltf ) {
        const mesh = gltf.scene;
        fill_board(mesh);
    });

    window.requestAnimationFrame(animate);
}

function create_board() {
    const tileGeometry = new THREE.PlaneGeometry(1, 1);
    const lightTile = new THREE.MeshBasicMaterial({color: 0xe3d8bd});
    const darkTile = new THREE.MeshBasicMaterial({color: 0x77593e});
    let tile;
    let squareNumber = 0;
    board = new THREE.Group();

    for(let x = 0; x < 8; x++) {
        for(let z = 0; z < 8; z++) {
        
            if (z % 2 == false) {
                tile = new THREE.Mesh(tileGeometry, x % 2 == false? lightTile: darkTile);
            }
            else {
                tile = new THREE.Mesh(tileGeometry, x % 2 == false? darkTile: lightTile);
            }
            tile.userData.squareNumber = squareNumber; // Each tile on the board has a square numer ranging from 1-64
            squareNumber++;
            tile.position.set(z, 0, x);
            tile.rotation.x = -90*(Math.PI/180);
            board.add(tile);
        }
        
    }
    scene.add(board);
}

function animate() {
    controls.update(); 
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

function resize_window(container, camera, renderer) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

function fill_board(mesh) {
    
    let piece;
    for(let i = 0; i < 64; i++){
        const tilePos = find_tile_position(i); // The position of each piece on the board
        switch(Chess.board[i]){

            // Black pieces
            case Chess.isPiece.bR:
                piece = mesh.children.find((child) => child.name === 'blackRook').clone();
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
                break;

            case Chess.isPiece.bP:
                piece = mesh.children.find((child) => child.name === 'blackPawn').clone();
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
                break;

            case Chess.isPiece.bN:
                piece = mesh.children.find((child) => child.name === 'blackKnight').clone();
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
                break;  
            
            case Chess.isPiece.bB:
                piece = mesh.children.find((child) => child.name === 'blackBishop').clone();
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);

                break;
                
            case Chess.isPiece.bQ:
                piece = mesh.children.find((child) => child.name === 'blackQueen');
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
                break;

            case Chess.isPiece.bK:
                piece = mesh.children.find((child) => child.name === 'blackKing');
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
            break;

            // White pieces
            case Chess.isPiece.wP:
                piece = mesh.children.find((child) => child.name === 'whitePawn').clone();
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
                break;

            case Chess.isPiece.wN:
                piece = mesh.children.find((child) => child.name === 'whiteKnight').clone();
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
                break;  
            
            case Chess.isPiece.wB:
                piece = mesh.children.find((child) => child.name === 'whiteBishop').clone();
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
                break;

            case Chess.isPiece.wR:
                piece = mesh.children.find((child) => child.name === 'whiteRook').clone();
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
                break;
                
            case Chess.isPiece.wQ:
                piece = mesh.children.find((child) => child.name === 'whiteQueen');
                piece.position.set(tilePos.x, tilePos.y, tilePos.z);
                piece.scale.set(0.3, 0.3, 0.3);
                scene.add(piece);
                break;

            case Chess.isPiece.wK:
            piece = mesh.children.find((child) => child.name === 'whiteKing');
            piece.position.set(tilePos.x, tilePos.y, tilePos.z);
            piece.scale.set(0.3, 0.3, 0.3);
            scene.add(piece);
            break;
        }
    }
}

function find_tile_position(tile) {
    const found = board.children.find((child) => child.userData.squareNumber == tile)
    if (found) {
        return found.position;
    }
    return null; 
}
// Current Main
window.addEventListener('resize', () => resize_window(container, camera, renderer));
window.onload = init();
