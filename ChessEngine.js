
var ChessEngine = function () {

    var PIECES = {
        EMPTY: 0,
        wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6,
        bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12
    }; 

    var DEFAULT_BOARD = [
        'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR',
        'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
         0,    0,    0,    0,    0,    0,    0,    0,
         0,    0,    0,    0,    0,    0,    0,    0,
         0,    0,    0,    0,    0,    0,    0,    0,
         0,    0,    0,    0,    0,    0,    0,    0,
         0,    0,    0,    0,    0,    0,    0,    0,
        'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
        'wR', 'wN', 'ww', 'wQ', 'wK', 'ww', 'wN', 'wR',
    ];

    var position;

    function get_piece(square) {
        var piece = DEFAULT_BOARD[square];
        console.log(piece);
        return piece;
    }
    
    return {
        board: DEFAULT_BOARD,
        pieces: PIECES,
        get_piece: get_piece,
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

