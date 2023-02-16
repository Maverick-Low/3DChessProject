
var ChessEngine = function () {

    var PIECES = {
        EMPTY: 0,
        wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6,
        bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12
    }; 

    var BOARD = [
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
    

    function update_board(oldPos, newPos) {
        const pieceMoved = BOARD[oldPos]; // BOARD[oldPos] = 1-12. E.g. BOARD[0] = 10 = White Rook

        BOARD[oldPos] = 0; // Piece has left this position so it is empty
        BOARD[newPos] = pieceMoved; // Replace value in this position to the pieceMoved. E.g. White rook now in BOARD[newPos]
    }

    function valid_move(oldPos, newPos) {
        const movementArray = generate_moves(oldPos);
        const isWhite = (BOARD[oldPos] >= 1 && BOARD[oldPos] <= 6) && (BOARD[newPos] >= 1 && BOARD[newPos] <= 6) ? true: false;
        const isBlack = (BOARD[oldPos] >= 7 && BOARD[oldPos] <= 12) && (BOARD[newPos] >= 7 && BOARD[newPos] <= 12) ? true: false;
        const isSamePiece = isBlack || isWhite ? true: false;

        if( movementArray[newPos] == 1 && (BOARD[newPos] == PIECES.EMPTY || !isSamePiece)){
            return true;
        }
        else {
            return false;
        }
    }

    function check_piece_collision(position) {
        let collision = false;
        if(BOARD[position] != PIECES.EMPTY) {
            collision = true;
        }
        return collision;
    }

    function check_same_piece(oldPos, newPos) {
        const isWhite = (BOARD[oldPos] >= 1 && BOARD[oldPos] <= 6) && (BOARD[newPos] >= 1 && BOARD[newPos] <= 6) ? true: false;
        const isBlack = (BOARD[oldPos] >= 7 && BOARD[oldPos] <= 12) && (BOARD[newPos] >= 7 && BOARD[newPos] <= 12) ? true: false;
        const isSamePiece = isBlack || isWhite ? true: false;
        return isSamePiece;
    }

    function generate_moves(position) {
        const moves = steps_to_borders(position);
        const movementArray = new Array(64).fill(0);

        const collisions = {
            left: false,
            right: false,
            up: false,
            down: false,
            upLeft: false,
            upRight: false,
            downLeft: false,
            downRight: false,
        }

        const isSamePiece = {
            left: false,
            right: false,
            up: false,
            down: false,
            upLeft: false,
            upRight: false,
            downLeft: false,
            downRight: false,
        }

        for(let i = 1; i < 8; i++) {
            isSamePiece.left = check_same_piece(position, position-i);
            isSamePiece.right = check_same_piece(position, position+i)
            isSamePiece.up = check_same_piece(position, position - (i*8));
            isSamePiece.down = check_same_piece(position, position + (i*8));
            isSamePiece.upLeft = check_same_piece(position, position - (i*9));
            isSamePiece.upRight = check_same_piece(position, position - (i*7));
            isSamePiece.downLeft = check_same_piece(position, position + (i*7));
            isSamePiece.downRight = check_same_piece(position, position + (i*9));

            if(i <= moves.left && !collisions.left && !isSamePiece.left) {     
                collisions.left = check_piece_collision(position - i);
                movementArray[position - i] = 1;
            }

            if(i <= moves.right && !collisions.right && !isSamePiece.right) {
                movementArray[position + i] = 1;
                collisions.right = check_piece_collision(position + i);
            }

            if(i <= moves.up && !collisions.up && !isSamePiece.up ) {
                movementArray[position - (i*8)] = 1;
                collisions.up = check_piece_collision(position - (i*8));
                isSamePiece.up = check_same_piece(position,position - (i*8));
            }

            if(i <= moves.down && !collisions.down && !isSamePiece.down) {
                movementArray[position + (i*8)] = 1;
                collisions.down = check_piece_collision(position + (i*8));
            }

            if(i <= moves.upLeft && !collisions.upLeft && !isSamePiece.upLeft) {
                movementArray[position - (i*9)] = 1;
                collisions.upLeft = check_piece_collision(position - (i*9));
            }

            if(i <= moves.upRight && !collisions.upRight && !isSamePiece.upRight ) {
                movementArray[position - (i*7)] = 1;
                collisions.upRight = check_piece_collision(position - (i*7));
            }

            if(i <= moves.downLeft && !collisions.downLeft && !isSamePiece.downLeft) {
                movementArray[position + (i*7)] = 1;
                collisions.downLeft = check_piece_collision(position + (i*7));
            }

            if(i <= moves.downRight && !collisions.downRight && !isSamePiece.downRight) {
                movementArray[position + (i*9)] = 1;
                collisions.downRight = check_piece_collision(position + (i*9));                
            }
        }

        return movementArray;
    }

    function steps_to_borders(piecePosition) {
        const left = piecePosition % 8;
        const right = 7 - left;
        const up = Math.floor(piecePosition / 8);
        const down = 7 - up;
        const upLeft = Math.min(up, left);
        const upRight = Math.min(up, right);
        const downLeft = Math.min(down, left);
        const downRight = Math.min(down, right);
        
        const moves = {
            left: left,
            right: right,
            up: up,
            down: down,
            upLeft: upLeft,
            upRight: upRight,
            downLeft: downLeft,
            downRight: downRight,
        }
        
        return moves;
    }
  
    return {
        board: BOARD,
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

