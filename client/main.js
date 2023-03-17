import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';                 
import { Rook, Knight, King, Pawn, Queen, Bishop } from './ChessEngine/Pieces.js';
import { Game } from './ChessEngine/Game.js';
import { Move } from './ChessEngine/Move.js';


var scene, camera, renderer, controls, container, mouse, raycaster, renderer2D;
var board, game;
var lengthToPiece, blackTaken = 0, whiteTaken = 0, selected = null, whitesTurn = true;
var fileName = 'client/assets/ChessSet-Normal-1.glb';
var lightTile = new THREE.MeshBasicMaterial({color: 0xe3d8bd});
var darkTile = new THREE.MeshBasicMaterial({color: 0x77593e});
var loader, chessMesh;
var socket = io();


async function init() {
    // Scene
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

    // Initialise window size
    resize_window(container, camera, renderer);

    // Create controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(3.5, 0, 3.5); 
    controls.maxPolarAngle = Math.PI/2;
    controls.maxDistance = 20;
    controls.minDistance = 5;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.enabled = false;

    // Add lights
    const light = new THREE.PointLight( 0xffffff, 2, 200 );
    light.position.set(3.5, 80, 3.5);
    scene.add(light);

    // Add objects into scene
    const loader = new GLTFLoader();
    const room = await loader.loadAsync('client/assets/room.glb');
    room.scene.position.set(3.5, 0, 3.5);
    scene.add(room.scene);
    
    window.addEventListener('resize', () => resize_window(container, camera, renderer));
    window.requestAnimationFrame(initial_animate);
}

function init_game() {
    console.log('game Started');
    game = new Game();

    // Raycasting
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();

    // Enable controls
    controls.enabled = true;

    create_board();
    fill_board();
    window.requestAnimationFrame(animate);

    // Add event listeners
    window.addEventListener( 'click', select_piece);
    window.addEventListener( 'contextmenu', deselect_piece);
    window.addEventListener( 'mousemove', move_mouse, false );
    window.addEventListener('keydown', print_board);
    window.addEventListener('keydown', test);

    // Hide lobby menu after 'Start Game' is clicked
    const x = document.getElementById("menu");
    if (x.style.display === "none") {
        x.style.display = "block";
    } 
    else {
        x.style.display = "none";
    }
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

function initial_animate() {
    controls.update();
    renderer.render(scene, camera);
    window.requestAnimationFrame(initial_animate);
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
                isWhite = intersects[lengthToPiece]? intersects[lengthToPiece].object.name.includes('white'): false;
                isBlack = intersects[lengthToPiece]? intersects[lengthToPiece].object.name.includes('black'): false;
                lengthToPiece = i;
                break;
            }
            else {
                lengthToPiece = 0;
            }
        }
        
        if(intersects.length > 0 && (isBlack || isWhite)) {
            const object = intersects[lengthToPiece].object;
            if(isWhite && game.currentTurn.isWhite) {
                const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xffe9d2 });
                object.material = lightMaterial;
                object.material.transparent = true;
                object.material.opacity = 0.5;  
            }
            else if(isBlack && !game.currentTurn.isWhite){
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
    const kingInCheck = game.currentTurn === game.players[0]? kings[0] : kings[1];
    const kingIsChecked = game.king_is_checked();
    const tile3D = board.children.find((child) => (child.userData.squareNumber.x === kingInCheck.position.x) && (child.userData.squareNumber.z === kingInCheck.position.y));

    if(kingIsChecked) {
        tile3D.material = redHighlight;
        tile3D.material.transparent = true;
        tile3D.opacity = 0.5;
    }
 
}

// --------------------------------------------- Functions for moving pieces ----------------------------------------------------- //
// Function taken from https://threejs.org/docs/#api/en/core/Raycaster
function move_mouse( event ) {
    // calculate mouse position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = ( event.clientX / container.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / container.clientHeight ) * 2 + 1;
}

// Function to: on first click: select a piece | on second click: Move piece to location
function select_piece() {
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

    // If selected, player can move the piece
    if(selected && intersects.length > 0) {
        raycaster.setFromCamera(mouse, camera);
        intersects = raycaster.intersectObjects(board.children);

        // Move in 3D
        const selectedPiece = scene.children.find((child) => child.userData.currentSquare === selected);
        const oldPos = selectedPiece.userData.currentSquare; 
        const newPos = intersects[0].object.userData.squareNumber; 
        
        // Move in 2D
        const startPos = game.board[oldPos.x][oldPos.z];
        const endPos = game.board[newPos.x][newPos.z];
        const move = new Move(game.currentTurn, startPos, endPos);
        const legalMove = game.is_legal_move(move);

        if(legalMove) {
            // Send move to server
            socket.emit('move', {move: move}); 
            move_piece3D(selectedPiece, move);
            selected = null;    
        }
        
        // game.king_is_checkmated();
    }
}

function deselect_piece() {
    selected = null;
    reset_tile_materials();
}

// Move the pieces
function move_piece3D(piece3D, move) {
    const endPos = move.endPos.position;

    take_piece(move.endPos);
    piece3D.position.set(endPos.y, 0, endPos.x);
    piece3D.userData.currentSquare = {x: endPos.x, z: endPos.y};
    piece3D.userData.posX = endPos.x;
    piece3D.userData.posZ = endPos.y;
    castle_king(move);

    if(move.startPos.piece instanceof(King) || move.startPos.piece instanceof(Rook)) {
        move.startPos.piece.canCastle = false;
    }

    // Move piece in 2D
    game.update_pieceSet(move);
    game.move_piece(move);
    promote_pawn(move, piece3D);
    game.currentTurn = game.currentTurn === game.players[0]? game.players[1] : game.players[0];
    reset_tile_materials();
}

// Checks if piece is at a given tile
function take_piece(tile) {
    const piece3D = scene.children.find((child) => (child.userData.posX === tile.position.x) && (child.userData.posZ === tile.position.y));

    if(tile.piece && tile.piece.color === 'black') {
        piece3D.position.set(-2,0,blackTaken);
        piece3D.rotation.y = Math.PI/2;
        blackTaken++;
        piece3D.userData.currentSquare = null;
        piece3D.userData.posX = null;
        piece3D.userData.posZ = null;
        piece3D.userData.taken = true;
    }

    else if(tile.piece && tile.piece.color === 'white') {
        piece3D.position.set(9,0,whiteTaken);
        piece3D.rotation.y = Math.PI/-2;
        whiteTaken++;
        piece3D.userData.currentSquare = null;
        piece3D.userData.posX = null;
        piece3D.userData.posZ = null;
        piece3D.userData.taken = true;
    }
}

// --------------------------------------------- Functions for special rules ----------------------------------------------------- //

function castle_king(move) {
    if(game.can_castle(move)) {
        // Get the corresponding rook 
        const rookTile = game.get_rook(move);
        const rookCoOrds = {x: rookTile.position.y, z: rookTile.position.x};
        const rookPos = find_tile_position(rookCoOrds);
        const rook3D = scene.children.find((child) => (child.userData.posX === rookPos.x) && (child.userData.posZ === rookPos.z));
       
        // Set the corresponding castle position for the rook
        const isRookWhite = rookTile.piece.color === 'white';
        const posX = isRookWhite? 7 : 0;
        const rook3DNewPos = rookTile === game.board[posX][7]? {x: posX, z: 5} : {x: posX, z: 3};
        const tile = board.children.find((child) => (child.userData.squareNumber.x === rook3DNewPos.x) && (child.userData.squareNumber.z === rook3DNewPos.z));
        const newPos = tile.userData.squareNumber;
        const targetPosition = find_tile_position(newPos);

        // Move rook in 3D
        rook3D.position.set(targetPosition.x, targetPosition.y, targetPosition.z);
        rook3D.userData.currentSquare = newPos;
        rook3D.userData.posX = newPos.x;
        rook3D.userData.posZ = newPos.z;

        // Move rook in 2D
        const rookEndPos = move.endPos === game.board[posX][6]? game.board[posX][5] : game.board[posX][3];
        const castleRook = new Move(game.currentTurn, rookTile, rookEndPos);
        game.update_pieceSet(castleRook);
        game.move_piece(castleRook);
    }
}

function promote_pawn(move, selectedPiece) {
    if(game.pawn_promotion(move)) {
        const pieceName = selectedPiece.name.includes('white')? 'whiteQueen' : 'blackQueen';
        const pos = selectedPiece.position;
        const piece = chessMesh.scene.children.find((child) => child.name === pieceName).clone(true);
        scene.remove(selectedPiece);
        customise_piece(pos, piece, {x: pos.z, z: pos.x});
    }
}

// --------------------------------------------- Functions for printing ----------------------------------------------------- //

function print_board(event) {
    var key = event.which || event.keyCode
    if (key === 32) {
        console.log('black:', game.blackPieceSet);
        console.log('white:', game.whitePieceSet);
    }
}

function test(event) {
    var key = event.which || event.keyCode
    if(key === 80) {
       console.log(game.board); 
    }
}


// --------------------------------------------- Functions for handing lobbies ----------------------------------------------------- //

function create_room(){
    const roomID = Math.floor((Math.random() * 100) + 1);
    socket.emit('createRoom', roomID);
    socket.emit('updateRoomList', roomID);
}

function display_lobbies() {
    const lobbies = document.getElementById("lobby list");
    if (lobbies.style.display === "none") {
        lobbies.style.display = "block";
    } 
    else {
        lobbies.style.display = "none";
    }
    
}

function add_lobby(lobby) {
    const lobbyList = document.getElementById('lobby list');

    const newLobbyItem = document.createElement('div');
    newLobbyItem.classList.add('lobby-item');
    newLobbyItem.setAttribute('id', 'lobby' + lobby);

    const roomNumberSpan = document.createElement('span');
    roomNumberSpan.classList.add('room-number');
    roomNumberSpan.textContent = lobby;

    const roomPlayersSpan = document.createElement('span');
    roomPlayersSpan.classList.add('room-players');
    roomPlayersSpan.textContent = '0/2';

    const roomNameSpan = document.createElement('span');
    roomNameSpan.classList.add('room-name');
    roomNameSpan.textContent = 'New Room';

    newLobbyItem.appendChild(roomNumberSpan);
    newLobbyItem.appendChild(roomPlayersSpan);
    newLobbyItem.appendChild(roomNameSpan);

    lobbyList.appendChild(newLobbyItem);
}


// Current Main
window.onload = init();

// HTML elements
const startGame = document.getElementById("startGame");
startGame.addEventListener('click', init_game);
const createRoom = document.getElementById("createRoom");
createRoom.addEventListener('click', create_room);
const viewLobbies = document.getElementById("viewLobbies");
viewLobbies.addEventListener('click', display_lobbies);

// Display all available lobbies to the client
socket.once('lobby', function(lobbies) {
    console.log('lobbies received:', lobbies);
    for(let lobby in lobbies) {
        add_lobby(lobbies[lobby]);
    }
})

// If new rooms is created, refresh all rooms of clients
socket.on('refreshRooms', function(newRoom) {
    add_lobby(newRoom);
});

// Server sends a move that is played in game
socket.on('receivedMove', function(data) {
    const startPos = {x: data.move.startPos.position.x, y: data.move.startPos.position.y}; 
    const endPos = {x: data.move.endPos.position.x, y: data.move.endPos.position.y}; 
    const piece3D = scene.children.find((child) => (child.userData.posX === startPos.x) && (child.userData.posZ === startPos.y));
    const move = new Move(game.currentTurn, game.board[startPos.x][startPos.y], game.board[endPos.x][endPos.y]);
    move_piece3D(piece3D, move);
});
