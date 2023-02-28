import Board from "./ChessEngine/Board";

export default class ChessEngine {
    
    constructor() {
        this.BOARD = this.create_board();
        this.kingSelected = false;
        this.pieceMoved = null;
    }

    create_board() {
        const board = new Board();
        return board.BOARD;
    }

    isPiece = {
        EMPTY: 0,
        wP: 'wP', wN: 'wN', wB: 'wB', wR: 'wR', wQ: 'wQ', wK: 'wK',
        bP: 'bP', bN: 'bN', bB: 'bB', bR: 'bR', bQ: 'bQ', bK: 'bK'
    };

    update_board(oldPos, newPos) {
        this.pieceMoved = this.BOARD[oldPos]; // this.BOARD[oldPos] = 1-12. E.g. this.BOARD[0] = 10 = White Rook
        this.BOARD[oldPos] = 0; // Piece has left this position so it is empty
        this.BOARD[newPos] = this.pieceMoved; // Replace value in this position to the pieceMoved. E.g. White rook now in this.BOARD[newPos]
    }

    // --------------------------------------------------------------------------------- Checks --------------------------------------------------------------------------------- // 

    // Checks if move is in the movement array 
    valid_move(oldPos, newPos) {
        const movementArray = this.generate_moves(oldPos);

        if( movementArray[newPos] == 1){
            return true;
        }
        else {
            return false;
        }
    }

    // Returns true when the specified position has a piece on it
    check_piece_collision(position) {
        let collision = false;
        if(this.BOARD[position] != this.isPiece.EMPTY) {
            collision = true;
        }
        return collision;
    }

    // Returns true when the specified position has a king on it
    check_king_collision(position) {
        let collision = false;
        if(this.BOARD[position].symbol == this.isPiece.bK || this.BOARD[position].symbol == this.isPiece.wK)  {
            collision = true;
        }
        return collision;
    }

    // Returns true when piece at oldPos and piece at newPos are of the same colour
    check_same_piece(oldPos, newPos) {
        const pieceAtOldPos = this.BOARD[oldPos];

        if(this.BOARD[newPos]) {
            const pieceAtNewPos = this.BOARD[newPos];
            const isWhite = (pieceAtOldPos.color == 'white' && pieceAtNewPos.color =='white')? true : false;
            const isBlack = (pieceAtOldPos.color == 'black' && pieceAtNewPos.color =='black')? true : false;
            const isSamePiece = isBlack || isWhite ? true: false;

            return isSamePiece;
        }
        
    }

    // --------------------------------------------------------------------------------- Piece Movement --------------------------------------------------------------------------------- // 

    // Returns a list that contains the number of steps to the edge in every direction
    steps_to_borders(piecePosition) {
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

    // Specifies the direction and length each piece can move
    generate_directions(position) {
        const moves = this.steps_to_borders(position);
        const piece = this.BOARD[position].symbol;
     
        switch(piece) {
            case this.isPiece.wP:
                const atWhiteStartRow = (position > 47 && position < 56)? true : false;
                const wCanTakePieceLeft = this.BOARD[position-9] >= 7? true: false;
                const wCanTakePieceRight = this.BOARD[position-7] >= 7? true: false;
                const wIsPieceBlocking = this.BOARD[position - 8] != this.isPiece.EMPTY? true: false;
                const wIsPieceBlockingStart = this.BOARD[position - 16] != this.isPiece.EMPTY? true: false;
                const whitePawnMoves = {
                    left: 0,
                    right: 0,
                    up: (!wIsPieceBlockingStart && atWhiteStartRow && !this.kingSelected)? 2:1 && (!wIsPieceBlocking && !this.kingSelected)? 1:0,
                    down: 0,
                    upLeft: (wCanTakePieceLeft || this.kingSelected) && moves.upLeft != 0? 1:0,
                    upRight: (wCanTakePieceRight || this.kingSelected) && moves.upRight != 0? 1:0,
                    downLeft: 0,
                    downRight: 0,
                }
                return whitePawnMoves;

            case this.isPiece.bP:
                const atBlackStartRow = (position > 7 && position < 16)? true : false;
                const bCanTakePieceLeft = (this.BOARD[position+7] > 0 && this.BOARD[position+7] < 7)? true: false;
                const bCanTakePieceRight = (this.BOARD[position+9] > 0 && this.BOARD[position+9] < 7)? true: false;
                const bIsPieceBlocking = this.BOARD[position + 8] != this.isPiece.EMPTY? true: false;
                const bIsPieceBlockingStart = this.BOARD[position + 16] != this.isPiece.EMPTY? true: false;
                const blackPawnMoves = {
                    left: 0,
                    right: 0,
                    up: 0,
                    down: (!bIsPieceBlockingStart && atBlackStartRow && !this.kingSelected)? 2:1 && (!bIsPieceBlocking && !this.kingSelected)? 1:0,
                    upLeft: 0,
                    upRight: 0,
                    downLeft: (bCanTakePieceLeft || this.kingSelected) && moves.downLeft != 0? 1:0,
                    downRight: (bCanTakePieceRight || this.kingSelected) && moves.downRight != 0? 1:0,
                }
                return blackPawnMoves;

            case this.isPiece.wB:
            case this.isPiece.bB:
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

            case this.isPiece.wR:
            case this.isPiece.bR:   
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
            
            case this.isPiece.wK:
            case this.isPiece.bK:   
                const kingMoves = {
                    left: moves.left == 0? 0:1,
                    right: moves.right == 0? 0:1,
                    up: moves.up == 0? 0:1,
                    down: moves.down == 0? 0:1,
                    upLeft: moves.upLeft == 0? 0:1,
                    upRight: moves.upRight == 0? 0:1,
                    downLeft: moves.downLeft == 0? 0:1,
                    downRight: moves.downRight == 0? 0:1,
                }
                return kingMoves;
            default:
                return moves;
        }
       

       
    }

    // Function for generating the moves for the knight - unique movement so cannot be done the same as other pieces
    generate_knight_moves(position, movementArray) {
        const moves = this.steps_to_borders(position);

        const isSamePiece = {
            topLeft: false,
            topRight: false,
            bottomLeft: false,
            bottomRight: false,
        }

        for(let i = 1; i <= 2; i++) {
            const leftSide = position - i;
            const rightSide = position + i;

            if(i == 1) {
                isSamePiece.topLeft = this.check_same_piece(position, leftSide - 16);
                isSamePiece.topRight = this.check_same_piece(position, rightSide - 16);
                isSamePiece.bottomLeft = this.check_same_piece(position, leftSide + 16);
                isSamePiece.bottomRight = this.check_same_piece(position, rightSide + 16);
                
                if(i <= moves.left) {
                    movementArray[leftSide - 16] = !isSamePiece.topLeft? 1 : 2;   
                    movementArray[leftSide + 16] = !isSamePiece.bottomLeft? 1 : 2;
                }
                if(i <= moves.right) {
                    movementArray[rightSide - 16] = !isSamePiece.topRight? 1 : 2;   
                    movementArray[rightSide + 16] = !isSamePiece.bottomRight? 1 : 2;
                }
            } 

            else if (i == 2) {
                isSamePiece.topLeft = this.check_same_piece(position, leftSide - 8);
                isSamePiece.topRight = this.check_same_piece(position, rightSide - 8);
                isSamePiece.bottomLeft = this.check_same_piece(position, leftSide + 8);
                isSamePiece.bottomRight = this.check_same_piece(position, rightSide + 8);
                if(i <= moves.left) {
                    movementArray[leftSide - 8] = !isSamePiece.topLeft? 1 : 2;  
                    movementArray[leftSide + 8] = !isSamePiece.bottomLeft? 1 : 2;
                }
                if(i <= moves.right) {
                    movementArray[rightSide - 8] = !isSamePiece.topRight? 1 : 2;   
                    movementArray[rightSide + 8] = !isSamePiece.bottomRight? 1 : 2;
                }  
            }
        }
    }

    // Function for generating the available moves in a specific direction - uses the check functions above
    generate_sliding_moves(direction, position, movementArray, displacement) {
        let collisions = false;
        let isSamePiece = false;
        let kingCollision = false;
        
        for(let i = 1; i <= direction; i++) {
            if(!isSamePiece) {
                isSamePiece = this.check_same_piece(position, position + (i * displacement));
            }

            if(i <= direction) { 
                if(!collisions) {
                    movementArray[position + (i* displacement)] =  !isSamePiece? 1:2;
                    collisions = this.check_piece_collision(position + (i * displacement));
                }

                kingCollision = this.check_king_collision(position + (i * displacement));
                if(kingCollision) {
                    movementArray[position + ((i+1)* displacement)] = 3;
                }
            }
        }
    }

    // Function for generating all available moves in all directions
    generate_all_sliding_moves(position, movementArray){
        const moves = this.generate_directions(position);

        this.generate_sliding_moves(moves.left, position, movementArray, -1);
        this.generate_sliding_moves(moves.right, position, movementArray, +1);
        this.generate_sliding_moves(moves.up, position, movementArray, -8);
        this.generate_sliding_moves(moves.down, position, movementArray, +8);
        this.generate_sliding_moves(moves.upLeft, position, movementArray, -9);
        this.generate_sliding_moves(moves.upRight, position, movementArray, -7);
        this.generate_sliding_moves(moves.downLeft, position, movementArray, +7);
        this.generate_sliding_moves(moves.downRight, position, movementArray, +9);
    }

    // Combines all the movement functions to choose piece movement based on the piece at the given position
    generate_moves(position) {
        const movementArray = new Array(64).fill(0);
        const {whiteKingPos, blackKingPos} = this.get_king_position();
        
        // if(this.isKingInCheck(whiteKingPos) || this.isKingInCheck(blackKingPos)) {
        //     if(this.BOARD[position] == this.isPiece.wN || this.BOARD[position] == this.isPiece.bN ) {
        //         this.generate_knight_moves(position, movementArray);   
        //     }

        //     else if(this.BOARD[position] == this.isPiece.wK || this.BOARD[position] == this.isPiece.bK ) {
        //         this.generate_king_moves(position, movementArray);   
        //     }

        //     else {
        //         this.generate_checked_moves(position, movementArray);
        //     }
        // }

        console.log(this.BOARD[position].symbol);
        if(this.BOARD[position].symbol == this.isPiece.wN || this.BOARD[position].symbol == this.isPiece.bN ) {
            this.generate_knight_moves(position, movementArray); 
        }

        else if(this.BOARD[position].symbol == this.isPiece.wK || this.BOARD[position].symbol == this.isPiece.bK ) {
            this.generate_king_moves(position, movementArray);   
        }

        else {
            this.generate_all_sliding_moves(position, movementArray);
        }
        
        return movementArray;
    }

    // --------------------------------------------------------------------------------- King Movement --------------------------------------------------------------------------------- // 

    // Function for generating king's moves
    generate_king_moves(position, movementArray) {
        this.kingSelected = true;
        const king = this.BOARD[position];
        const illegalMovesArray = new Array(64).fill(0);

        // King's pseudolegal moves (with no checks for checking)
        this.generate_all_sliding_moves(position, movementArray);

        // Creates an array of positions that are illegal for the king to move to
        for(let i = 0; i < 64; i++) {
            const pieceIsWhite = (this.BOARD[i].color == 'white')? true : false;
            const pieceIsBlack = (this.BOARD[i].color == 'black')? true : false; 

            if(king.symbol == this.isPiece.wK && pieceIsBlack) {
                if(this.BOARD[i].symbol == this.isPiece.bN) {
                    this.generate_knight_moves(i, illegalMovesArray);
                }
                else {
                    this.generate_all_sliding_moves(i, illegalMovesArray);
                }
            }

            else if(king.symbol == this.isPiece.bK && pieceIsWhite) {
                if(this.BOARD[i].symbol == this.isPiece.wN) {
                    this.generate_knight_moves(i, illegalMovesArray);
                }
                else {
                    this.generate_all_sliding_moves(i, illegalMovesArray);
                }
            } 
        }

        // Compares king's movement array with the array of illegal positions - movement array only left with legal moves
        for(let i = 0; i < 64; i++) {   
            if(movementArray[i] == illegalMovesArray[i] || illegalMovesArray[i] >= 2){
                movementArray[i] = 0;
            }
        }

        this.kingSelected = false;
    }

    // Generates legal moves when king is checked
    generate_checked_moves(position, movementArray) {
        const legalMovesInCheck = new Array(64).fill(0);
        const {pos1, pos2} = get_pieceJustMoved_position();

        if(this.BOARD[position] == this.isPiece.wN) {
            generate_knight_moves(position, legalMovesInCheck)
        }
        else {
            generate_all_sliding_moves(pos1, legalMovesInCheck);
            if(pos2) {
                generate_all_sliding_moves(pos2, legalMovesInCheck);
            }
        }
        
    
        generate_all_sliding_moves(position, movementArray);
        for(let i = 0; i < 64; i++) {
            if(movementArray[i] == 1 && legalMovesInCheck[i] != 1) {
                movementArray[i] = 0;
            }
        }
    }

    // Returns true if black or white king are in check
    isKingInCheck(position) {
        this.kingSelected = true;
        const king = this.BOARD[position];
        const illegalMovesArray = new Array(64).fill(0);
        
        if(king) {
            for(let i = 0; i < 64; i++) {
            
                const pieceIsWhite = (this.BOARD[i].color == 'white')? true : false;
                const pieceIsBlack = (this.BOARD[i].color == 'black')? true : false; 
    
                if(king.symbol == this.isPiece.wK && pieceIsBlack) {
                    if(this.BOARD[i].symbol == this.isPiece.bN) {
                        this.generate_knight_moves(i, illegalMovesArray);
                    }
                    else {
                        this.generate_all_sliding_moves(i, illegalMovesArray);
                    }
                }
    
                else if(king.symbol == this.isPiece.bK && pieceIsWhite) {
                    if(this.BOARD[i].symbol == this.isPiece.wN) {
                        this.generate_knight_moves(i, illegalMovesArray);
                    }
                    else {
                        this.generate_all_sliding_moves(i, illegalMovesArray);
                    }
                } 
            }
            this.kingSelected = false;
              
            if(illegalMovesArray[position] == 1){
                return true;
            }
            else {
                return false;
            }
        }
       

    }

    // Returns the position of both kings
    get_king_position() {
        let whiteKingPos, blackKingPos;
        for(let i = 0; i < 64; i++){
            if(this.BOARD[i].symbol == this.isPiece.wK) {
                whiteKingPos = i;
            }

            if(this.BOARD[i].symbol == this.isPiece.bK) {
                blackKingPos = i;
            }
        }
        return {whiteKingPos, blackKingPos}
    }

    get_pieceJustMoved_position() {
        console.log(pieceMoved);
        let pos1 = null, pos2 = null;
        for(let i = 0; i < 64; i++){
            if(this.BOARD[i] == pieceMoved) {
                if(!pos1) {pos1 = i;}
                else {pos2 = i};
            }
        }
        console.log('pos1:', pos1);
        console.log('pos2:', pos2);
        return {pos1, pos2};
    }

}


