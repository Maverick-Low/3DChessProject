
var ChessEngine = function () {

    var PIECES = {
        EMPTY: 0,
        wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6,
        bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12
    }; 

    var DEFAULT_BOARD = [
        10,    8,    9,    11,    12,    9,    8,    10,
        7,    7,    7,    7,    7,    7,    7,    7,
        0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,
        0,    0,    0,    0,    0,    0,    0,    0,
        1,    1,    1,    1,    1,    1,    1,    1,
        4,    2,    3,    5,    6,    3,    2,    4,
    ]

    var FILES_AND_RANKS = [
        'A8', 'B8', 'C8', 'D8', 'E8', 'F8', 'G8', 'H8',
        'A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7',
        'A6', 'B6', 'C6', 'D6', 'E6', 'F6', 'G6', 'H6',
        'A5', 'B5', 'C5', 'D5', 'E5', 'F5', 'G5', 'H5',
        'A4', 'B4', 'C4', 'D4', 'E4', 'F4', 'G4', 'H4',
        'A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3',
        'A2', 'B2', 'C2', 'D2', 'E2', 'F2', 'G2', 'H2',
        'A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1', 'H1',
    ]

    function update_board(board, oldPos, newPos) {
        board = DEFAULT_BOARD;
        const pieceMoved = board[oldPos]; // board[oldPos] = 1-12. E.g. board[0] = 10 = White Rook

        board[oldPos] = 0; // Piece has left this position so it is empty
        board[newPos] = pieceMoved; // Replace value in this position to the pieceMoved. E.g. White rook now in board[newPos]
    }

    function valid_move(board, oldPos, newPos) {
        board = DEFAULT_BOARD;
        const movementArray = generate_moves(oldPos);
        const isWhite = (board[oldPos] >= 1 && board[oldPos] <= 6) && (board[newPos] >= 1 && board[newPos] <= 6) ? true: false;
        const isBlack = (board[oldPos] >= 7 && board[oldPos] <= 12) && (board[newPos] >= 7 && board[newPos] <= 12) ? true: false;
        const isSamePiece = isBlack || isWhite ? true: false;

        if( movementArray[newPos] == 1 && (board[newPos] == PIECES.EMPTY || !isSamePiece)){
            return true;
        }
        else {
            return false;
        }
    }

    function generate_moves(position) {
        const {left, right, up, down} = steps_to_borders(position);
        const movementArray = new Array(64).fill(0);
        for(let i = 0; i < 8; i++) {

            if(i <= left) {
                movementArray[position - i] = 1;
            }

            if(i <= right) {
                movementArray[position + i] = 1;
            }

            if(i <= up) {
                movementArray[position - (i*8)] = 1;
            }

            if(i <= down) {
                movementArray[position + (i*8)] = 1;
            }
        }
        return movementArray;
    }

    function steps_to_borders(piecePosition) {
        const left = piecePosition % 8;
        const right = 7 - left;
        const up = Math.floor(piecePosition / 8);
        const down = 7 - up;
        return {left, right, up, down};
    }
  
    return {
        board: DEFAULT_BOARD,
        isPiece: PIECES,
        update_board: update_board,
        valid_move: valid_move,
        steps_to_borders: steps_to_borders,
        generate_moves: generate_moves,
    }
}

if (typeof exports !== 'undefined') {
    exports.ChessEngine = ChessEngine
  }
  
if (typeof define !== 'undefined') {
    define(function () {
        return ChessEngine
    })
}

