import Piece from "./Piece";

export default class Board {

    constructor() {
        this.pieceSet = this.initialise_pieces();
        this.BOARD = this.initialise_board();
        this.pieceMoved = null;
        this.rowsAndCols = this.FILES_AND_RANKS;
    }

    FILES_AND_RANKS = [
        'A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8',
        'A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7',
        'A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6',
        'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5',
        'A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4',
        'A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3',
        'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2',
        'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1',
    ]


    initialise_pieces() {
        var pieces = new Array(32);
       
        pieces[0] = new Piece('black', 'Rook', 1, 'bR'); 
        pieces[1] = new Piece ('black', 'Knight', 2, 'bN');
        pieces[2] = new Piece('black', 'Bishop', 3, 'bB'); 
        pieces[3] = new Piece('black', 'Queen', 4, 'bQ'); 
        pieces[4] = new Piece('black', 'King', 5, 'bK'); 
        pieces[5] = new Piece('black', 'Bishop', 6, 'bB'); 
        pieces[6] = new Piece ('black', 'Knight', 7, 'bN');
        pieces[7] = new Piece('black', 'Rook', 8, 'bR');
        
        // Indexes 8 - 15 (8 Black Pawns)
        for(let i = 8; i < 16; i ++) {
            pieces[i] = new Piece('black', 'Pawn', i+1, 'bP'); 
        }

        // Indexes 16 - 23 (8 White Pawns)
        for(let i = 16; i < 24; i ++) {
            pieces[i] = new Piece('white', 'Pawn', i+1, 'wP'); 
        }

        pieces[24] = new Piece('white', 'Rook', 25, 'wR'); 
        pieces[25] = new Piece ('white', 'Knight', 26, 'wN');
        pieces[26] = new Piece('white', 'Bishop', 27, 'wB'); 
        pieces[27] = new Piece('white', 'Queen', 28, 'wQ'); 
        pieces[28] = new Piece('white', 'King', 29, 'wK'); 
        pieces[29] = new Piece('white', 'Bishop', 30, 'wB'); 
        pieces[30] = new Piece ('white', 'Knight', 31, 'wN');
        pieces[31] = new Piece('white', 'Rook', 32, 'wR');
        
        
        return pieces;
    }

    initialise_board() {
        const board = new Array(64).fill(0);
        for(let i = 0; i < 16; i ++) {
            board[i] = this.pieceSet[i]
        }

        for(let i = 48; i < 64; i++) {
            board[i] = this.pieceSet[i-32]
        }

        return board;
    }

     // BOARD = [
    //     10,   8,    9,    11,   12,   9,    8,    10,
    //     7,    7,    7,    7,    7,    7,    7,    7,
    //     0,    0,    0,    0,    0,    0,    0,    0,
    //     0,    0,    0,    0,    0,    0,    0,    0,
    //     0,    0,    0,    0,    0,    0,    0,    0,
    //     0,    0,    0,    0,    0,    0,    0,    0,
    //     1,    1,    1,    1,    1,    1,    1,    1,
    //     4,    2,    3,    5,    6,    3,    2,    4
    // ]

     // BOARD = [
    //     1,    2,    3,    4,    5,    6,    7,    8,
    //     9,    10,   11,   12,   13,   14,   15,   16,
    //     0,    0,    0,    0,    0,    0,    0,    0,
    //     0,    0,    0,    0,    0,    0,    0,    0,
    //     0,    0,    0,    0,    0,    0,    0,    0,
    //     0,    0,    0,    0,    0,    0,    0,    0,
    //     17,   18,   19,   20,   21,   22,   23,   24,
    //     25,   26,   27,   28,   29,   30,   31,   32,
    // ]

    // BOARD = [
    //     'bR',   'bN',   'bB',   'bQ',   'bK',   'bB',   'bN',   'bR',
    //     'bP',   'bP',   'bP',   'bP',   'bP',   'bP',   'bP',   'bP',  
    //      0,      0,      0,      0,      0,      0,      0,      0,
    //      0,      0,      0,      0,      0,      0,      0,      0,
    //      0,      0,      0,      0,      0,      0,      0,      0,
    //      0,      0,      0,      0,      0,      0,      0,      0,
    //     'wP',   'wP',   'wP',   'wP',   'wP',   'wP',   'wP',   'wP',  
    //     'wR',   'wN',   'wB',   'wQ',   'wK',   'ww',   'wN',   'wR',
    // ]
}