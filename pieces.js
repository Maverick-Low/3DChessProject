import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// function setupModel(data) {
//     const model = data.scene.children[0];
//     return model;
// }

// function initialise_pieces(){
//     var blackPawns = new Array(16);
//     var whitePawns = new Array(16);
    
//     for(let i = 0; i < 8; i++) { 
//         blackPawns[i].push({   // Black Pawns
//             name: 'Pawn',
//             value: 1,
//             texture: '',
//             model: '/assets/models/Flamingo.glb',
//             color: 'black',
//         })

//         whitePawns[i].push({   // White Pawns
//             name: 'Pawn',
//             value: 1,
//             texture: '',
//             model: '/assets/models/3D_White_Pawn_008.gltf',
//             color: 'white',
//         })
//     }
// }

// async function fill_board(){
//     // initialise_pieces();
      
//     // // for(let i = 0; i < 8; i++) {
//     // const data = loader.loadAsync(whitePawns.model);
//     // const wPawn = setupModel(data);
//     // wPawn.position.set(0 + i, 0, 1);

//     // const data2 = loader.loadAsync(blackPawns.model);
//     // const bPawn = setupModel(data2);
//     // bPawn.position.set(0 + i, 0, 7);

//     const loader = new GLTFLoader();

//     const [whitePawnData, blackPawnData] = await Promise.all([
//         loader.loadAsync("/assets/models/3D_White_Pawn_008.gltf"),
//         loader.loadAsync("/assets/models/3D_White_Pawn_008.gltf"),
//       ]);

//     const wPawn = setupModel(whitePawnData);
//     const bPawn = setupModel(blackPawnData);

//     return {wPawn, bPawn};
// }

function load_pieces(scene) {
    const loader = new GLTFLoader();
    loader.load('/assets/models/2Dand3DChessSet.glb', function(gltf){
       
        const chessSetMesh = gltf.scene;
        const darkPiece = new THREE.MeshStandardMaterial( { color: 0x44db25 } );
        const lightPiece = new THREE.MeshStandardMaterial( { color: 0xFFFFFF });
        chessSetMesh.material = darkPiece;
        chessSetMesh.scale.set(
            chessSetMesh.scale.x * 0.4, 
            chessSetMesh.scale.y * 0.4,
            chessSetMesh.scale.z * 0.4,
            );
        chessSetMesh.position.set(3.5,0,3.5);
        scene.add(chessSetMesh);
        // const blackPawnMesh = gltf.scene.children.find((child) => child.name === "BlackBishop");
        // scene.add(blackPawnMesh);
        
    })
}

export {load_pieces}