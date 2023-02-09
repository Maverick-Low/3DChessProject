import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
var scene, camera, renderer, controls, container, Chess, board, mouse, raycaster, selected = null;
var lengthToPiece, blackTaken = 0, whiteTaken = 0;
var fileName = '/assets/models/2Dplus3DChessSet.glb';

async function init() {
    // Scene
    Chess = new ChessEngine();

    container = document.querySelector('#scene-container'); // The container that holds the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color('grey');

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
    let squareNumber = 1;
    board = new THREE.Group();

    for(let x = 0; x < 8; x++) {
        for(let z = 0; z < 8; z++) {
        
            if (z % 2 == false) {
                tile = new THREE.Mesh(tileGeometry, x % 2 == false? lightTile: darkTile);
            }
            else {
                tile = new THREE.Mesh(tileGeometry, x % 2 == false? darkTile: lightTile);
            }
            tile.userData.squareNumber = squareNumber; // Each tile on the board has a square numer ranging from 0-63
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
    reset_piece_materials();
    highlight_piece();
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
        material = new THREE.MeshStandardMaterial({ color: 0x4e4e4e });
    }
    else {
        material = new THREE.MeshStandardMaterial({ color: 0xffe9d2 });
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

    for(let i = 1; i < 65; i++){
        const tilePos = find_tile_position(i); // The position of each piece on the board
        switch(Chess.board[i-1]){

            // Black pieces
            case Chess.isPiece.bR:
                piece = mesh.children.find((child) => child.name === 'blackRook').clone(true);
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
function highlight_piece(){
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    // Highlight the first object that is a chess piece
    for(let i = 0; i < intersects.length; i++) {
        if (intersects[i].object.parent.name.includes('white') || intersects[i].object.parent.name.includes('black')) {
            lengthToPiece = i;
            break;
        }
        else {
            lengthToPiece = 0;
        }
    }


    if( intersects.length > 0) {
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
function reset_piece_materials() {
    for (let i = 0; i < scene.children.length; i++) {
        const objectGroup = scene.children[i];
        for (let j = 0; j < objectGroup.children.length; j++) {
            if(objectGroup.children[j].material) {
                objectGroup.children[j].material.opacity = objectGroup.userData.currentSquare == selected ? 0.5 : 1.0;
            }  
        }
    }
}

// Function to: on first click: select a piece | on second click: Move piece to location
function move_piece(event) {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);

    // Get the selected piece
    if(intersects.length > 0 && !selected) {
        selected = intersects[lengthToPiece].object.parent.userData.currentSquare;
        return;
    }

    // Move the piece onto the target location on the board
    if(selected) {
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(board.children);

        if(intersects.length > 0) {
            const selectedPiece = scene.children.find((child) => child.userData.currentSquare == selected);
            const oldArrayPos = selectedPiece.userData.currentSquare; 
            const newArrayPos = intersects[0].object.userData.squareNumber; 
            const targetPosition = find_tile_position(newArrayPos);
            const pieceAtTarget = Chess.board[newArrayPos] = Chess.isPiece.EMPTY ? null : scene.children.find((child) => child.userData.currentSquare == newArrayPos);
            const validMove = Chess.valid_move(board, oldArrayPos-1, newArrayPos-1)

            if(validMove) {
                if (pieceAtTarget) {
                    if(pieceAtTarget.name.includes('black')) {
                        pieceAtTarget.position.set(-2,0,blackTaken);
                        pieceAtTarget.rotation.y = Math.PI/2;
                        blackTaken++;
                    }

                    if(pieceAtTarget.name.includes('white')) {
                        pieceAtTarget.position.set(10,0,whiteTaken);
                        pieceAtTarget.rotation.y = Math.PI/-2;
                        whiteTaken++;
                    }
                    pieceAtTarget.userData.currentSquare = null;
                }
                selectedPiece.position.set(targetPosition.x, selectedPiece.position.y, targetPosition.z);
                selectedPiece.userData.currentSquare = newArrayPos;
                Chess.update_board(board, oldArrayPos-1, newArrayPos-1);
            }

            selected = null;

            // console.log('tileHasPiece:', tileHasPiece);
            // console.log('selectedPiece:', selectedPiece.name);
            // console.log('pieceAtTarget:', pieceAtTarget.name);
            console.log('pos0: ', Chess.board[0]);
            console.log('oldArrayPos: ', oldArrayPos);
            console.log('newArrayPos: ', newArrayPos);
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
window.addEventListener( 'click', move_piece);
window.addEventListener( 'mousemove', move_mouse, false );
window.addEventListener('keydown', print_board);

window.onload = init();
