import './style.css'
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Game } from './ChessEngine/Game';
import { Move } from './ChessEngine/Move';
import { Rook, Knight, Bishop, Queen, King, Pawn } from './ChessEngine/Pieces';

var scene, camera, renderer, controls, container, mouse, raycaster;
var board, game;
var lengthToPiece, blackTaken = 0, whiteTaken = 0, selected = null, whitesTurn = true;
var fileName = '/assets/models/ChessSet-Normal-1.glb';
var lightTile = new THREE.MeshBasicMaterial({color: 0xe3d8bd});
var darkTile = new THREE.MeshBasicMaterial({color: 0x77593e});
var loader, chessMesh;

async function init() {
    // Scene
    game = new Game();

    container = document.querySelector('#scene-container'); // The container that holds the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color('grey');

    // Camera
    const aspectRatio = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(60, aspectRatio , 0.1, 100);
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
    // const gridHelper = new THREE.GridHelper(200,50);
    // scene.add(gridHelper);

    // Add lights
    const light = new THREE.PointLight( 0xffffff, 2, 200 );
    light.position.set(3.5, 80, 3.5);
    scene.add(light);
    // const light = new THREE.AmbientLight( 0x404040 ); // soft white light
    // scene.add( light );

    // Add objects into scene
    const loader = new GLTFLoader();
    const room = await loader.loadAsync('/assets/models/room.glb');
    room.scene.position.set(3.5, 0, 3.5);
    scene.add(room.scene);
    create_board();
    fill_board();

    window.requestAnimationFrame(animate);

    // scene.traverse((mesh) => {
    //     if(!mesh.isGroup && !mesh.name === 'tile') {
    //         console.log(mesh);
    //     }
    // })
}
 
function create_board() {
    const tileGeometry = new THREE.PlaneGeometry(1, 1);
    let tile;
    board = new THREE.Group();

    for(let x = 0; x < 8; x++) {
        for(let z = 0; z < 8; z++) {
        
            if (z % 2 == false) {
                tile = new THREE.Mesh(tileGeometry, x % 2 == false? lightTile: darkTile);
            }
            else {
                tile = new THREE.Mesh(tileGeometry, x % 2 == false? darkTile: lightTile);
            }
            tile.userData.squareNumber = {x: x, z: z};
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
    highlight_kings_tile();
}

function resize_window(container, camera, renderer) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
}

// --------------------------------------------- Functions for loading pieces onto the board  ----------------------------------------------------- //
function customise_piece(pos, piece, currentTile) {
    let material;

    if(piece.name.includes('black')) {
        material = new THREE.MeshStandardMaterial({ color: 0x4e4e4e });
    }
    else {
        material = new THREE.MeshStandardMaterial({ color: 0xffe9d2 });
    }
    piece.userData.currentSquare = {x: currentTile.x, z: currentTile.z};
    piece.userData.posX = currentTile.x
    piece.userData.posZ = currentTile.z
    piece.userData.taken = false;

    piece.material = material;
    piece.position.set(pos.x, pos.y, pos.z);
    scene.add(piece);
}

async function fill_board() {
    
    loader = new GLTFLoader();
    chessMesh = await loader.loadAsync(fileName);
    const mesh = chessMesh.scene;
    let piece, pieceName;

    for(let x = 0; x < 8; x++) {
        for(let z = 0; z < 8; z++) {
            const tilePos = find_tile_position({x,z});
            
            if(game.board[x][z].piece instanceof Rook) {
                pieceName = x === 0? 'blackRook' : 'whiteRook'
                piece = mesh.children.find((child) => child.name === pieceName).clone(true);
                customise_piece(tilePos, piece, {x,z});
            }

            else if(game.board[x][z].piece instanceof Bishop) {
                pieceName = x === 0? 'blackBishop' : 'whiteBishop'
                piece = mesh.children.find((child) => child.name === pieceName).clone(true);
                customise_piece(tilePos, piece, {x,z});
            }

            else if(game.board[x][z].piece instanceof Knight) {
                pieceName = x === 0? 'blackKnight' : 'whiteKnight'
                piece = mesh.children.find((child) => child.name === pieceName).clone(true);
                customise_piece(tilePos, piece, {x,z});
            }

            else if(game.board[x][z].piece instanceof King) {
                pieceName = x === 0? 'blackKing' : 'whiteKing'
                piece = mesh.children.find((child) => child.name === pieceName).clone(true);
                customise_piece(tilePos, piece, {x,z});
            }

            else if(game.board[x][z].piece instanceof Queen) {
                pieceName = x === 0? 'blackQueen' : 'whiteQueen'
                piece = mesh.children.find((child) => child.name === pieceName).clone(true);
                customise_piece(tilePos, piece, {x,z});
            }

            else if(game.board[x][z].piece instanceof Pawn) {
                pieceName = x === 1? 'blackPawn' : 'whitePawn'
                piece = mesh.children.find((child) => child.name === pieceName).clone(true);
                customise_piece(tilePos, piece, {x,z});
            }

           
        }
    }
}

function find_tile_position(tile) {;
    const found = board.children.find((child) =>(child.userData.squareNumber.x === tile.x) && ((child.userData.squareNumber.z === tile.z)))
    if (found) {
        return found.position;
    }
   
    return null; 
}
// --------------------------------------------- Functions for highlighting objects ----------------------------------------------------- //

// Hovering over pieces highlights them
function highlight_piece(){ 
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    let isWhite, isBlack;

    // Highlight the first object that is a chess piece
    if(!selected) {
        for(let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.name.includes('white') || intersects[i].object.name.includes('black')) {
                isWhite = intersects[lengthToPiece].object.name.includes('white');
                isBlack = intersects[lengthToPiece].object.name.includes('black');
                lengthToPiece = i;
                break;
            }
            else {
                lengthToPiece = 0;
            }
        }

        
        if( intersects.length > 0 && (isBlack || isWhite)) {
            const object = intersects[lengthToPiece].object;
            if(isWhite) {
                const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xffe9d2 });
                object.material = lightMaterial;
                object.material.transparent = true;
                object.material.opacity = 0.5;  
            }
            else if(isBlack){
                const darkMaterial = new THREE.MeshStandardMaterial({ color: 0x4e4e4e });
                object.material =  darkMaterial;
                object.material.transparent = true;
                object.material.opacity = 0.5;
            }
            
        }
    }

}

// Once mouse cursor is no longer hovering on a piece, set it back to its original colours
function reset_piece_materials() {
    for (let i = 0; i < scene.children.length; i++) {
        const object = scene.children[i];
        if(object.material) {
            object.material.opacity = object.userData.currentSquare === selected ? 0.5 : 1.0;
            if (object.userData.taken === true) {
                object.material.opacity = 1;
            }
        }
    }
}

// Highlight tiles that are a valid move
function highlight_tiles(tile) {
    const greenHighlight = new THREE.MeshBasicMaterial({color: 0x5fd64e});
    const redHighlight = new THREE.MeshBasicMaterial({color: 0xf72626});

    for(let x = 0; x < 8; x++) {
        for(let z = 0; z < 8; z++) {
           
            const newPos =  game.retrieve_tile_from_position(x,z);
            const tile3D = board.children.find((child) => (child.userData.squareNumber.x === x) && (child.userData.squareNumber.z === z));
            const move = new Move(game.currentTurn, tile, newPos);
            
            if(game.is_legal_move(move)) {
                const highlight = newPos.piece? redHighlight: greenHighlight;
                tile3D.material = highlight;
                tile3D.material.transparent = true;
                tile3D.material.opacity = 0.5;
            }
        }
    }

}

// Set tiles back to original material
function reset_tile_materials() {
    for(let x = 0; x < 8; x++) {
        for(let z = 0; z < 8; z++) {
            const tile = board.children.find((child) => (child.userData.squareNumber.x === x) && (child.userData.squareNumber.z === z));
            if (z % 2 == false) {
                tile.material = x % 2 == false? lightTile: darkTile;
            }
            else {
                tile.material = x % 2 == false? darkTile: lightTile;
            }
        }
    }
}

// Highlight the tile the king is on if the king is checked
function highlight_kings_tile(){
    const redHighlight = new THREE.MeshBasicMaterial({color: 0xf72626});
    const kings = game.get_king_positions();
    const whiteKingIsChecked = game.king_is_checked(kings[0]);
    const blackKingIsChecked = game.king_is_checked(kings[1]);
    const kingInCheck = whiteKingIsChecked? kings[0] : kings[1];
    const tile3D = board.children.find((child) => (child.userData.squareNumber.x === kingInCheck.position.x) && (child.userData.squareNumber.z === kingInCheck.position.y));

    if(whiteKingIsChecked || blackKingIsChecked) {
        tile3D.material = redHighlight;
        tile3D.material.transparent = true;
        tile3D.opacity = 0.5;
    }
 
}

// --------------------------------------------- Functions for selecting pieces ----------------------------------------------------- //
// Function taken from https://threejs.org/docs/#api/en/core/Raycaster
function move_mouse( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / container.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / container.clientHeight ) * 2 + 1;
}

// Function to: on first click: select a piece | on second click: Move piece to location
function move_piece() {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    // Get the selected piece
    if(!selected && intersects.length > 0) {
        whitesTurn = game.currentTurn === game.players[0];
        
        selected = intersects[lengthToPiece].object.userData.currentSquare;
        
        let selectedPiece = scene.children.find((child) => child.userData.currentSquare === selected);

        // Alternates moves
        if ((whitesTurn && !selectedPiece.name.includes('white')) ||  (!whitesTurn && !selectedPiece.name.includes('black')) ){
            selected = null;
            selectedPiece = null;
        }

        if(selected) {
            const piece = game.retrieve_tile_from_position(selected.x, selected.z);
            highlight_tiles(piece);
        }
    
        return;
    }

    // Move the piece onto the target location on the board
    if(selected && intersects.length > 0) {
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(board.children);

        // Move in 3D
        const selectedPiece = scene.children.find((child) => child.userData.currentSquare === selected);
        const oldPos = selectedPiece.userData.currentSquare; 
        const newPos = intersects[0].object.userData.squareNumber; 
        const targetPosition = find_tile_position(newPos);
        const pieceAtTarget = scene.children.find((child) => (child.userData.posX === newPos.x) && (child.userData.posZ === newPos.z));
        
        // Move in 2D
        const startPos = game.board[oldPos.x][oldPos.z];
        const endPos = game.board[newPos.x][newPos.z];
        const move = new Move(game.currentTurn, startPos, endPos);
        const legalMove = game.is_legal_move(move);

        if(legalMove) {
            if(pieceAtTarget && pieceAtTarget.name.includes('black')) {
                pieceAtTarget.position.set(-2,0,blackTaken);
                pieceAtTarget.rotation.y = Math.PI/2;
                blackTaken++;
                pieceAtTarget.userData.currentSquare = null;
                pieceAtTarget.userData.posX = null;
                pieceAtTarget.userData.posZ = null;
                pieceAtTarget.userData.taken = true;
            }
    
            else if(pieceAtTarget && pieceAtTarget.name.includes('white')) {
                pieceAtTarget.position.set(9,0,whiteTaken);
                pieceAtTarget.rotation.y = Math.PI/-2;
                whiteTaken++;
                pieceAtTarget.userData.currentSquare = null;
                pieceAtTarget.userData.posX = null;
                pieceAtTarget.userData.posZ = null;
                pieceAtTarget.userData.taken = true;
            }

            // Updating piece position in 3D and 2D
            selectedPiece.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
            selectedPiece.userData.currentSquare = newPos;
            selectedPiece.userData.posX = newPos.x;
            selectedPiece.userData.posZ = newPos.z;

            game.move_piece(move);
            game.currentTurn = game.currentTurn === game.players[0]? game.players[1] : game.players[0];


            if(game.pawn_promotion(move)) {
                const pieceName = selectedPiece.name.includes('white')? 'whiteQueen' : 'blackQueen';
                const pos = selectedPiece.position;
                const piece = chessMesh.scene.children.find((child) => child.name === pieceName).clone(true);
                scene.remove(selectedPiece);
                customise_piece(pos, piece, {x: pos.z, z: pos.x});
            }
           
            reset_tile_materials();
            selected = null;
            
        }
        
        game.is_king_checkmated();
    }
}

function deselect_piece() {
    selected = null;
    reset_tile_materials();
}

function print_board(event) {
    var key = event.which || event.keyCode
    if (key === 32) {
        console.log(game.board);
    }
}

function test(event) {
    var key = event.which || event.keyCode
    if(key === 80) {
        // console.log(game.board[7][4]);
        // const move = new Move(null, game.board[2][0], game.board[1][0]);
        // game.king_is_checked(game.board[7][4]);
    }
}



// Current Main
window.addEventListener('resize', () => resize_window(container, camera, renderer));
window.addEventListener( 'click', move_piece);
window.addEventListener( 'contextmenu', deselect_piece);
window.addEventListener( 'mousemove', move_mouse, false );
window.addEventListener('keydown', print_board);
window.addEventListener('keydown', test);

window.onload = init();
