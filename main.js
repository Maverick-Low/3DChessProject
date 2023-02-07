import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { Color, Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
var scene, camera, renderer, controls, container, Chess, board, mouse, raycaster, selectedPiece = null, dragControls;
var pieceClones = new Array();
var lengthToPiece;
var fileName = '/assets/models/2Dplus3DChessSet.glb';

async function init() {
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
    
    // Raycasting
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();

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
    fill_board();

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
            tile.name = 'tile';
            board.add(tile);
        }
        
    }
    scene.add(board);
}

function animate() {
    controls.update(); 
    deselect_piece();
    select_piece();
    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
}

function resize_window(container, camera, renderer) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

// --------------------------------------------- Functions for loading pieces onto the board  ----------------------------------------------------- //
function customise_piece(position, piece, currentTile) {
    let material;

    if(piece.name.includes('black')) {
        material = new THREE.MeshStandardMaterial({ color: 0x4e4e4e });;
    }
    else {
        material = new THREE.MeshStandardMaterial({ color: 0xffe9d2 });;
    }
    piece.userData.currentSquare = currentTile;

    piece.children[0].material = material;
    piece.children[1].material = material;
    
    piece.position.set(position.x, position.y, position.z);
    piece.scale.set(0.3, 0.3, 0.3);
    scene.add(piece);
}

async function fill_board() {
    
    const loader = new GLTFLoader();
    const chessMesh = await loader.loadAsync(fileName);
    const mesh = chessMesh.scene;
    let piece;

    for(let i = 0; i < 64; i++){
        const tilePos = find_tile_position(i); // The position of each piece on the board
        switch(Chess.board[i]){

            // Black pieces
            case Chess.isPiece.bR:
                piece = mesh.children.find((child) => child.name === 'blackRook').clone(true);
                pieceClones[i] = piece;
                customise_piece(tilePos, piece, i);
                break;

            case Chess.isPiece.bP:
                piece = mesh.children.find((child) => child.name === 'blackPawn').clone(true);
                customise_piece(tilePos, piece, i);
                break;

            case Chess.isPiece.bN:
                piece = mesh.children.find((child) => child.name === 'blackKnight').clone(true);
                customise_piece(tilePos, piece, i);
                break;  
            
            case Chess.isPiece.bB:
                piece = mesh.children.find((child) => child.name === 'blackBishop').clone(true);
                customise_piece(tilePos, piece, i);
                break;
                
            case Chess.isPiece.bQ:
                piece = mesh.children.find((child) => child.name === 'blackQueen');
                customise_piece(tilePos, piece, i);
                break;

            case Chess.isPiece.bK:
                piece = mesh.children.find((child) => child.name === 'blackKing');
                customise_piece(tilePos, piece, i);
                break;

            // White pieces
            case Chess.isPiece.wP:
                piece = mesh.children.find((child) => child.name === 'whitePawn').clone();
                customise_piece(tilePos, piece, i);
                break;

            case Chess.isPiece.wN:
                piece = mesh.children.find((child) => child.name === 'whiteKnight').clone();
                customise_piece(tilePos, piece, i);
                break;  
            
            case Chess.isPiece.wB:
                piece = mesh.children.find((child) => child.name === 'whiteBishop').clone();
                customise_piece(tilePos, piece, i);
                break;

            case Chess.isPiece.wR:
                piece = mesh.children.find((child) => child.name === 'whiteRook').clone();
                customise_piece(tilePos, piece, i);
                break;
                
            case Chess.isPiece.wQ:
                piece = mesh.children.find((child) => child.name === 'whiteQueen');
                customise_piece(tilePos, piece, i);
                break;

            case Chess.isPiece.wK:
                piece = mesh.children.find((child) => child.name === 'whiteKing');
                customise_piece(tilePos, piece, i);
            break;
        }
    }
    // scene.traverse((mesh) => {
    //     if(mesh.isGroup) {
    //         console.log(mesh);
    //     }
    // })
}

// Function to a position on the board (1-64)
function find_tile_position(tile) {
    const found = board.children.find((child) => child.userData.squareNumber == tile)
    if (found) {
        return found.position;
    }
    return null; 
}

// --------------------------------------------- Functions for selecting pieces ----------------------------------------------------- //
// Function taken from https://threejs.org/docs/#api/en/core/Raycaster
function move_mouse( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / container.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / container.clientHeight ) * 2 + 1;
}

// Hover over pieces highlights them
function select_piece(){
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    for(let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.parent.name.includes('white') || intersects[i].object.parent.name.includes('black')) {
            lengthToPiece = i;
            break;
        }
        else {
            lengthToPiece = 0;
        }
    }
    if( intersects.length != 0) {
        const objectGroup = intersects[lengthToPiece].object.parent;
    
        for (let j = 0; j < objectGroup.children.length; j++) {
            if(!objectGroup.children[j].name.includes('tile')) {
                const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x4e4e4e });
                const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xffe9d2 });
                objectGroup.children[j].material = objectGroup.children[j].name.includes('black') ? darkMaterial: lightMaterial;
                objectGroup.children[j].material.transparent = true;
                objectGroup.children[j].material.opacity = 0.5;
            }
        }
    }
   
}

// Once mouse cursor is no longer hovering on a piece, set it back to its original colours
function deselect_piece() {
    for (let i = 0; i < scene.children.length; i++) {
        const objectGroup = scene.children[i];
        for (let j = 0; j < objectGroup.children.length; j++) {
            if(objectGroup.children[j].material) {
                objectGroup.children[j].material.opacity = objectGroup.userData.currentSquare == selectedPiece ? 0.5 : 1.0;
            }  
        }
    }
}

// Function to: on first click: select a piece | on second click: Move piece to location
function click_mouse(event) {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);

    // Get the selected piece
    if(intersects.length > 0 && !selectedPiece) {
        selectedPiece = intersects[lengthToPiece].object.parent.userData.currentSquare;
        return;
    }

    // Move the piece onto the target location on the board
    if(selectedPiece) {
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(board.children);

        if(intersects.length > 0) {
            const targetSquare = intersects[0].object.userData.squareNumber;
            const selectedObject = scene.children.find((child) => child.userData.currentSquare == selectedPiece);
            const targetPosition = find_tile_position(targetSquare);
            const oldPos = selectedObject.userData.currentSquare;
      
            selectedObject.position.set(targetPosition.x, selectedObject.position.y, targetPosition.z);
            selectedObject.userData.currentSquare = targetSquare;
            selectedPiece = null;

            Chess.update_board(board, oldPos, targetSquare);
        }
    }
}

function print_board(event) {
    var key = event.which || event.keyCode
    if (key === 32) {
        console.log(Chess.board);
    }
}


// Current Main
window.addEventListener('resize', () => resize_window(container, camera, renderer));
window.addEventListener( 'click', click_mouse);
window.addEventListener( 'mousemove', move_mouse, false );
window.addEventListener('keydown', print_board);

window.onload = init();
