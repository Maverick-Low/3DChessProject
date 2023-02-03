import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

function load_pieces(scene, fileName, pieceName) {
    const loader = new GLTFLoader();
    // ChessInstance = new ChessEngine();
    loader.load(fileName, function(gltf){
        
        const pieceMesh = gltf.scene.children.find((child) => child.name === pieceName);
        const darkPiece = new THREE.MeshStandardMaterial( { color: 0x44db25 } );

        pieceMesh.material = darkPiece;
        pieceMesh.scale.set(
            pieceMesh.scale.x * 0.4, 
            pieceMesh.scale.y * 0.4,
            pieceMesh.scale.z * 0.4,
        );
        scene.add(pieceMesh);
        // const chessSetMesh = gltf.scene;
        // const darkPiece = new THREE.MeshStandardMaterial( { color: 0x44db25 } );
        // const lightPiece = new THREE.MeshStandardMaterial( { color: 0xFFFFFF });
        // chessSetMesh.material = darkPiece;
        // chessSetMesh.scale.set(
        //     chessSetMesh.scale.x * 0.4, 
        //     chessSetMesh.scale.y * 0.4,
        //     chessSetMesh.scale.z * 0.4,
        //     );
        // chessSetMesh.position.set(3.5,0,3.5);
        // scene.add(chessSetMesh);
        // // const blackPawnMesh = gltf.scene.children.find((child) => child.name === "BlackBishop");
        // // scene.add(blackPawnMesh);

        // const blackPawnMesh = gltf.scene.children.find((child) => child.name === "BlackBishop");
        // const darkPiece = new THREE.MeshStandardMaterial( { color: 0x44db25 } );
        // blackPawnMesh.material = darkPiece;
        // blackPawnMesh.scale.set(
        //     blackPawnMesh.scale.x * 0.4, 
        //     blackPawnMesh.scale.y * 0.4,
        //     blackPawnMesh.scale.z * 0.4,
        // );
        // scene.add(blackPawnMesh);
        
    })
}

function fill_board(ChessInstance, scene, fileName) {
    let pieceName;

    for(let i = 0; i < 64; i++){
        switch(ChessInstance.board[i]){

            // Black pieces
            case ChessInstance.isPiece.bP:
                pieceName = 'blackPawn';
                load_pieces(scene, fileName, pieceName);
                break;

            case ChessInstance.isPiece.bN:
                pieceName = 'blackKnight';
                load_pieces(scene, fileName, pieceName);
                break;

            case ChessInstance.isPiece.bB:
                pieceName = 'blackBishop';
                load_pieces(scene, fileName, pieceName);
                break;

            case ChessInstance.isPiece.bR:
                pieceName = 'blackRook';
                load_pieces(scene, fileName, pieceName);
                break;
            
            case ChessInstance.isPiece.bQ:
                pieceName = 'blackQueen';
                load_pieces(scene, fileName, pieceName);
                break;
            
            case ChessInstance.isPiece.bK:
                pieceName = 'blackKing';
                load_pieces(scene, fileName, pieceName);
                break;
            
            // White pieces
            case ChessInstance.isPiece.wP:
                pieceName = 'whitePawn';
                load_pieces(scene, fileName, pieceName);
                break;

            case ChessInstance.isPiece.wN:
                pieceName = 'whiteKnight';
                load_pieces(scene, fileName, pieceName);
                break;

            case ChessInstance.isPiece.wB:
                pieceName = 'whiteBishop';
                load_pieces(scene, fileName, pieceName);
                break;

            case ChessInstance.isPiece.wR:
                pieceName = 'whiteRook';
                load_pieces(scene, fileName, pieceName);
                break;
            
            case ChessInstance.isPiece.wQ:
                pieceName = 'whiteQueen';
                load_pieces(scene, fileName, pieceName);
                break;
            
            case ChessInstance.isPiece.wK:
                pieceName = 'whiteKing';
                load_pieces(scene, fileName, pieceName);
                break;
        }
    }
}

export {fill_board}