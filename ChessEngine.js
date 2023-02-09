
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

    function update_board(board, oldPos, newPos) {
        board = DEFAULT_BOARD;
        const pieceMoved = board[oldPos]; // board[oldPos] = 1-12. E.g. board[0] = 10 = White Rook

        board[oldPos] = 0; // Piece has left this position so it is empty
        board[newPos] = pieceMoved; // Replace value in this position to the pieceMoved. E.g. White rook now in board[newPos]
    }

    function valid_move(board, oldPos, newPos) {
        board = DEFAULT_BOARD;
        const isWhite = (board[oldPos] >= 1 && board[oldPos] <= 6) && (board[newPos] >= 1 && board[newPos] <= 6) ? true: false;
        const isBlack = (board[oldPos] >= 7 && board[oldPos] <= 12) && (board[newPos] >= 7 && board[newPos] <= 12) ? true: false;
        const isSamePiece = isBlack || isWhite ? true: false;

        if(board[newPos] == PIECES.EMPTY || !isSamePiece){
            return true;
        }
        else {
            return false;
        }
    }

    

    /* 
    Possible methods:
    1. 2 Board Arrays (Prev and New), compare array, if different, delete piece ==> 
    2. When moving a piece, check the board number. If it has a piece on it, delete the piece
    */
   /*
    take_piece()
    move_validation() for each peice
   */
    
    return {
        board: DEFAULT_BOARD,
        isPiece: PIECES,
        update_board: update_board,
        valid_move: valid_move,
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

