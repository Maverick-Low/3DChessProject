
var ChessEngine = function () {

    var PIECES = {
        EMPTY: 0,
        wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6,
        bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12
    }; 

    // var DEFAULT_BOARD = [
    //     'bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR',
    //     'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP',
    //      0,    0,    0,    0,    0,    0,    0,    0,
    //      0,    0,    0,    0,    0,    0,    0,    0,
    //      0,    0,    0,    0,    0,    0,    0,    0,
    //      0,    0,    0,    0,    0,    0,    0,    0,
    //     'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP',
    //     'wR', 'wN', 'ww', 'wQ', 'wK', 'ww', 'wN', 'wR',
    // ];

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

    function get_piece(square) { // Finds the piece at the given square
        var piece = DEFAULT_BOARD[square];
        console.log(piece);
        return piece;
    }
    
    return {
        board: DEFAULT_BOARD,
        isPiece: PIECES,
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

