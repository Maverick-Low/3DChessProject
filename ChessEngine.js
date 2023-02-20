
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

    // Checks if move is in the movement array and that the new position is either empty or an enemy's piece
    function valid_move(oldPos, newPos) {
        const movementArray = generate_all_moves(oldPos);
        const isSamePiece = check_same_piece(oldPos, newPos);

        if( movementArray[newPos] == 1 && (BOARD[newPos] == PIECES.EMPTY || !isSamePiece)){
            return true;
        }
        else {
            return false;
        }
    }

    // Returns a list that contains the number of steps to the edge in every direction
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

    // Returns true when the specified position has a piece on it
    function check_piece_collision(position) {
        let collision = false;
        if(BOARD[position] != PIECES.EMPTY) {
            collision = true;
        }
        return collision;
    }

    // Returns true when piece at oldPos and piece at newPos are of the same colour
    function check_same_piece(oldPos, newPos) {
        const isWhite = (BOARD[oldPos] >= 1 && BOARD[oldPos] <= 6) && (BOARD[newPos] >= 1 && BOARD[newPos] <= 6) ? true: false;
        const isBlack = (BOARD[oldPos] >= 7 && BOARD[oldPos] <= 12) && (BOARD[newPos] >= 7 && BOARD[newPos] <= 12) ? true: false;
        const isSamePiece = isBlack || isWhite ? true: false;
        return isSamePiece;
    }

    // Specifies the direction and length each piece can move
    function check_piece_type(position) {
        const moves = steps_to_borders(position);
        const piece = BOARD[position];
     
        switch(piece) {
            case PIECES.wP:
                const atWhiteStartRow = (position > 47 && position < 56)? true : false;
                const wCanTakePieceLeft = BOARD[position-9] >= 7? true: false;
                const wCanTakePieceRight = BOARD[position-7] >= 7? true: false;
                const wIsPieceBlocking = BOARD[position - 8] != PIECES.EMPTY? true: false;
                whitePawnMoves = {
                    left: 0,
                    right: 0,
                    up: atWhiteStartRow? 2:1 && !wIsPieceBlocking? 1:0,
                    down: 0,
                    upLeft: wCanTakePieceLeft? 1:0,
                    upRight: wCanTakePieceRight? 1:0,
                    downLeft: 0,
                    downRight: 0,
                }
                return whitePawnMoves;

            case PIECES.bP:
                const atBlackStartRow = (position > 8 && position < 16)? true : false;
                const bCanTakePieceLeft = (BOARD[position+7] > 0 && BOARD[position+7] < 7)? true: false;
                const bCanTakePieceRight = (BOARD[position+7] > 0 && BOARD[position+9] < 7)? true: false;
                const bIsPieceBlocking = BOARD[position + 8] != PIECES.EMPTY? true: false;
                const blackPawnMoves = {
                    left: 0,
                    right: 0,
                    up: 0,
                    down: atBlackStartRow? 2:1 && !bIsPieceBlocking? 1:0,
                    upLeft: 0,
                    upRight: 0,
                    downLeft: bCanTakePieceLeft? 1:0,
                    downRight: bCanTakePieceRight? 1:0,
                }
                return blackPawnMoves;

            case PIECES.wB:
            case PIECES.bB:
                const bishopMoves = {
                    left: 0,
                    right: 0,
                    up: 0,
                    down: 0,
                    upLeft: moves.upLeft,
                    upRight: moves.upRight,
                    downLeft: moves.downLeft,
                    downRight: moves.downRight,
                }
                return bishopMoves;

            case PIECES.wR:
            case PIECES.bR:   
                const rookMoves = {
                    left: moves.left,
                    right: moves.right,
                    up: moves.up,
                    down: moves.down,
                    upLeft: 0,
                    upRight: 0,
                    downLeft: 0,
                    downRight: 0,
                }
                return rookMoves;
            
            case PIECES.wK:
            case PIECES.bK:   
                const kingMoves = {
                    left: 1,
                    right: 1,
                    up: 1,
                    down: 1,
                    upLeft: 1,
                    upRight: 1,
                    downLeft: 1,
                    downRight: 1,
                }
                return kingMoves;
            default:
                return moves;
        }
       

       
    }

    // Function for generating the moves for the knight - unique movement so cannot be done the same as other pieces
    function generate_knight_moves(position, movementArray) {
        const moves = steps_to_borders(position);

        const isSamePiece = {
            topLeft: true,
            topRight: true,
            bottomLeft: true,
            bottomRight: true,
        }

        for(let i = 1; i <= 2; i++) {
            const leftSide = position - i;
            const rightSide = position + i;

            if(i == 1) {
                isSamePiece.topLeft = check_same_piece(position, leftSide - 16);
                isSamePiece.topRight = check_same_piece(position, rightSide - 16);
                isSamePiece.bottomLeft = check_same_piece(position, leftSide + 16);
                isSamePiece.bottomRight = check_same_piece(position, rightSide + 16);

                if(i <= moves.left) {
                    movementArray[leftSide - 16] = i <= moves.up && !isSamePiece.topLeft? 1 : 0;   
                    movementArray[leftSide + 16] = i <= moves.down && !isSamePiece.bottomLeft? 1 : 0;
                }
                if(i <= moves.right) {
                    movementArray[rightSide - 16] = i <= moves.up && !isSamePiece.topRight? 1 : 0;   
                    movementArray[rightSide + 16] = i <= moves.down && !isSamePiece.bottomRight? 1 : 0;
                }
            } 

            else if (i == 2) {
                isSamePiece.topLeft = check_same_piece(position, leftSide - 8);
                isSamePiece.topRight = check_same_piece(position, rightSide - 8);
                isSamePiece.bottomLeft = check_same_piece(position, leftSide + 8);
                isSamePiece.bottomRight = check_same_piece(position, rightSide + 8);

                if(i <= moves.left) {
                    movementArray[leftSide - 8] = i <= moves.up && !isSamePiece.topLeft? 1 : 0;   
                    movementArray[leftSide + 8] = i <= moves.down && !isSamePiece.bottomLeft? 1 : 0;
                }
                if(i <= moves.right) {
                    movementArray[rightSide - 8] = i <= moves.up && !isSamePiece.topRight? 1 : 0;   
                    movementArray[rightSide + 8] = i <= moves.down && !isSamePiece.bottomRight? 1 : 0 ;
                }  
            }
        }
    }

    // Function for generating the available moves in a specific direction - uses the check functions above
    function generate_sliding_moves(direction, position, movementArray, displacement) {
        let collisions = false;
        let isSamePiece = false;
        
        for(let i = 1; i <= direction; i++) {
            if(!isSamePiece) {
                isSamePiece = check_same_piece(position, position + (i * displacement));
            }

            if(i <= direction && !collisions && !isSamePiece) {     
                movementArray[position + (i* displacement)] = 1;
                collisions = check_piece_collision(position + (i * displacement));
            }
        }
    }

    // Combines all the movement functions to choose piece movement based on the piece at the given position
    function generate_all_moves(position) {
        const moves = check_piece_type(position);
        const movementArray = new Array(64).fill(0);


        // Knight has unique movement so requires separate function
        if(BOARD[position] == PIECES.wN || BOARD[position] == PIECES.bN ) {
            generate_knight_moves(position, movementArray);    
        }

        else {
            generate_sliding_moves(moves.left, position, movementArray, -1);
            generate_sliding_moves(moves.right, position, movementArray, +1);
            generate_sliding_moves(moves.up, position, movementArray, -8);
            generate_sliding_moves(moves.down, position, movementArray, +8);
            generate_sliding_moves(moves.upLeft, position, movementArray, -9);
            generate_sliding_moves(moves.upRight, position, movementArray, -7);
            generate_sliding_moves(moves.downLeft, position, movementArray, +7);
            generate_sliding_moves(moves.downRight, position, movementArray, +9);
        }

        return movementArray;
    }

    
  
    return {
        board: BOARD,
        isPiece: PIECES,
        update_board: update_board,
        valid_move: valid_move,
        generate_moves: generate_all_moves,
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

