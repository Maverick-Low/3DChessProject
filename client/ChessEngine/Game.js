import { Board } from "./Board.js";
import { Rook, King, Pawn, Queen, Bishop } from './Pieces.js';
import { Move } from "./Move.js";

export class Game {

    constructor(players = []) {
        this.players = players;
        this.board = this.create_board();
        this.status = this.gameStatus.active;
        this.movesList = new Array();
        this.currentTurn = players[0].isWhite? players[0] : players[1];
        this.whitePieceSet = this.create_pieceSet('white');
        this.blackPieceSet = this.create_pieceSet('black');
    }

    gameStatus = {
        active: 0,
        blackWon: 1,
        whiteWon: 2,
        forfeit: 3,
        stalemate: 4,
    }

    // --------------------------------------------- Functions for initialising game  ----------------------------------------------------- //

    // create_two_players() {
    //     const players = new Array(2);
    //     players[0] = new Player(true);
    //     players[1] = new Player(false);
    //     return players;
    // }

    create_board() {
        const board = new Board();
        return board.initialise_board();
    }

    create_pieceSet(color) {
        const pieceSet = new Array();

        for(let x = 0; x < 8; x++) {
            for(let z = 0; z < 8; z++) {
                const currentTile = this.board[x][z];
                if(currentTile.piece) {
                    if(currentTile.piece.color === color) {
                        pieceSet.push(currentTile);
                    }
                }
                if(pieceSet.length === 16) {
                    break;
                }
            }
        }
        return pieceSet;
    }

    // --------------------------------------------- Functions for updating the game  ----------------------------------------------------- //

    move_piece(move) {
        const piece = move.pieceMoved;
        move.startPos.piece = null;
        move.endPos.piece = piece;
    }

    update_pieceSet(move) {
        const pieceSet = move.startPos.piece.color === 'white'? this.whitePieceSet : this.blackPieceSet;
        const oldTile = pieceSet.find(Tile => Tile.piece === move.startPos.piece);
        const index = pieceSet.indexOf(oldTile);
        let newTile = null;
    
        
        for(let i = 0 ; i < 8; i++) {
            newTile = this.board[i].find(Tile => Tile.position === move.endPos.position);
            if(newTile) {
                break;
            }
        }

        // If piece is taken, remove it from the correct pieceset
        if(move.endPos.piece) {
            const set = move.endPos.piece.color === 'white'? this.whitePieceSet: this.blackPieceSet;
            const pieceTaken = set.find(Tile => Tile.piece === move.endPos.piece);
            const setIndex = set.indexOf(pieceTaken);
            set.splice(setIndex, 1);
        }

        // Update pieceset when piece has move
        pieceSet[index] = newTile;
    }

    // --------------------------------------------- Functions for movement validation  ----------------------------------------------------- //

    is_blocked(move) {
        const startX = move.startPos.position.x;
        const startY = move.startPos.position.y;
        const endX = move.endPos.position.x;
        const endY = move.endPos.position.y;

        const totalStepsVertical = Math.abs(startX - endX);
        const totalStepsHorizontal = Math.abs(startY - endY);
        const totalStepsDiagonal = Math.min(totalStepsHorizontal, totalStepsVertical);

        let isBlocked = false, nextTile;

        if(move.startPos.piece instanceof(Rook) || move.startPos.piece instanceof(Pawn)) {
            
            // Check for blocks above or below
            for(let i = 1; i < totalStepsVertical; i++) {
                nextTile = startX > endX? this.board[startX - i][startY] : this.board[startX + i][startY];
                isBlocked = nextTile.piece? true: false;
                if(isBlocked) {return true};
            }

            // Check for blocks to the side
            for(let i = 1; i < totalStepsHorizontal; i++) {
                nextTile = startY > endY? this.board[startX][startY - i] : this.board[startX][startY + i];
                isBlocked = nextTile.piece? true: false;
                if(isBlocked) {return true};
            }

        }
        
        else if (move.startPos.piece instanceof(Bishop)) {
            // Check all diagonal directions
            for(let i = 1; i < totalStepsDiagonal; i++) {
                if (startY > endY) {
                    nextTile = startX > endX? this.board[startX - i][startY - i] : this.board[startX + i][startY - i];
                }

                else if (startY < endY){
                    nextTile = startX > endX? this.board[startX - i][startY + i] : this.board[startX + i][startY + i];
                }

                isBlocked = nextTile.piece? true: false;
                if(isBlocked) {return true};
            }
    
        }

        else if (move.startPos.piece instanceof(Queen)) {

            const checkDiagonals = Math.abs(startX - endX) == Math.abs(startY - endY)? true: false;

            if(checkDiagonals) {
                for(let i = 1; i < totalStepsDiagonal; i++) {
                    if (startY > endY) {
                        nextTile = startX > endX? this.board[startX - i][startY - i] : this.board[startX + i][startY - i];
                    }
    
                    else if (startY < endY){
                        nextTile = startX > endX? this.board[startX - i][startY + i] : this.board[startX + i][startY + i];
                    }

                    if(nextTile) {
                        isBlocked = nextTile.piece? true: false;
                        if(isBlocked) {return true};
                    }
                    
                }
            }

            else {
                // Check for blocks above or below
                for(let i = 1; i < totalStepsVertical; i++) {
                    nextTile = startX > endX? this.board[startX - i][startY] : this.board[startX + i][startY];
                    isBlocked = nextTile.piece? true: false;
                    if(isBlocked) {return true};
                }

                // Check for blocks to the side
                for(let i = 1; i < totalStepsHorizontal; i++) {
                    nextTile = startY > endY? this.board[startX][startY - i] : this.board[startX][startY + i];
                    isBlocked = nextTile.piece? true: false;
                    if(isBlocked) {return true};
                }
            }
            
            
        }
        return false;
    }

    valid_move(move) {
        const canMove = move.startPos.piece.can_move(move.startPos, move.endPos);
        const isEmpty = !move.endPos.piece;
        const correctTurn = move.player === this.currentTurn;

        let isSameColor = false;
        let isBlocked = this.is_blocked(move);
        
        if(!isEmpty) {
            isSameColor = move.startPos.piece.color === move.endPos.piece.color;
        }
        
        const canKingCastle = this.can_king_castle(move);

       return (isEmpty || isSameColor == false) && (canMove || canKingCastle) && !isBlocked && correctTurn;
    }
    
    is_legal_move(move){

        const pieceAtEnd = move.endPos.piece;
        const pieceAtStart = move.startPos.piece;
        const validMove = this.valid_move(move);

        let kingPos = this.get_king_positions();
        let whiteKing = kingPos[0], blackKing = kingPos[1];        
        let king = pieceAtStart.color === 'white'? whiteKing : blackKing;
        let willKingBeChecked = false, canStopCheck, willNotLeadToCheck;

        const kingColour = king.piece.color;
        const isKingChecked = this.king_is_checked(king);
        const color = kingColour === 'white'? 'white' : 'black';

        if(validMove) {
            this.move_piece(move);

            if(pieceAtStart instanceof(King)) {
                kingPos = this.get_king_positions();
                whiteKing = kingPos[0];
                blackKing = kingPos[1]; 
                king = pieceAtStart.color === 'white'? whiteKing : blackKing;
            }
        
            willKingBeChecked = this.king_is_checked(king);
            move.startPos.piece = pieceAtStart;
            move.endPos.piece = pieceAtEnd;

            canStopCheck = isKingChecked && !willKingBeChecked && pieceAtStart.color === color;
            willNotLeadToCheck = !isKingChecked && !(willKingBeChecked && pieceAtStart.color === color);
            
            if(canStopCheck || willNotLeadToCheck) {
                return true;
            }
            
            return false;
        }
        
    }

    // --------------------------------------------- Functions for special movement rules ----------------------------------------------------- //

    pawn_promotion(move) {
        const piece = move.pieceMoved;
        if(piece instanceof(Pawn)) {
            if (piece.color == 'white' && move.endPos.position.x == 0) {
                move.endPos.piece = new Queen('white', piece.id);
                return true;
            }

            else if (piece.color == 'black' && move.endPos.position.x == 7) {
                move.endPos.piece = new Queen('black', piece.id);
                return true;
            }
        }
        return false;
    }

    // Deals with actual castling
    can_castle(move) {
        if (move.startPos.piece instanceof(King)) {
    
            const king = move.startPos.piece;
            const rookTile = this.get_rook(move);

            const kingIsWhite = king.color === 'white';
            const kingNewPosRHS = kingIsWhite? this.board[7][6] : this.board[0][6];
            const kingNewPosLHS = kingIsWhite? this.board[7][2] : this.board[0][2];
            const kingStartPos = kingIsWhite? this.board[7][4] : this.board[0][4];
            
            const kingEndPos = move.endPos.position.y === 6? kingNewPosRHS : kingNewPosLHS;
            const movedFromStart = (move.startPos === kingStartPos) && (move.endPos === kingEndPos);

            return rookTile && rookTile.piece && king.canCastle && rookTile.piece.canCastle && movedFromStart;
            
        }

    }

    // Checks to see if the king has the option of moving to the castling squares
    can_king_castle(move) {
        if(move.startPos.piece instanceof(King)) {
            const pieceIsWhite = move.startPos.piece.color === 'white';
            const rhsID = pieceIsWhite? 31 : 7;
            const lshID = pieceIsWhite? 24 : 0;
            const pieceSet = pieceIsWhite? this.whitePieceSet : this.blackPieceSet;

            const rookRHS = pieceSet.find(Tile => (Tile.piece.id === rhsID));
            const rookLHS = pieceSet.find(Tile => (Tile.piece.id === lshID));
            const canRookRHSCastle = rookRHS? rookRHS.piece.canCastle : false;
            const canRookLHSCastle = rookLHS? rookLHS.piece.canCastle : false;

            if(move.startPos.piece.canCastle)  {
                const sameRow = move.endPos.position.x === move.startPos.position.x;

                if(canRookRHSCastle && canRookLHSCastle) {
                    const y = Math.abs(move.endPos.position.y - move.startPos.position.y);
                    const canMoveTwo = sameRow && (y == 2);
                    return canMoveTwo;
                }

                if(canRookRHSCastle) {
                    const y = move.endPos.position.y - move.startPos.position.y;
                    const canMoveTwoRight = sameRow && (y == 2);
                    return canMoveTwoRight;
                }

                else if(canRookLHSCastle) {
                    const y = move.startPos.position.y - move.endPos.position.y;
                    const canMoveTwoLeft = sameRow && (y == 2);
                    return canMoveTwoLeft;
                }
            }
        }
        
    }

    // --------------------------------------------- Functions for checking / checkmating  ----------------------------------------------------- //

    king_is_checked() {
        let isBlocked = true;
        let canMove = false;
        let move;
        const kings = this.get_king_positions();
        
        const whitePlayer = this.players[0].isWhite? this.players[0] : this.players[1];
        const kingTile = this.currentTurn === whitePlayer? kings[0] : kings[1];
        const pieceSet = this.currentTurn === whitePlayer? this.blackPieceSet : this.whitePieceSet;

        for(let x = 0; x < pieceSet.length; x++) {
            const currentTile = pieceSet[x];
            const kingIsWhite = kingTile.piece.color == 'white';
            const pieceIsWhite = currentTile.piece.color == 'white';

            move = new Move(null, currentTile, kingTile);
            isBlocked = this.is_blocked(move);
            canMove = currentTile.piece? currentTile.piece.can_move(currentTile, kingTile) : false;

            if(kingIsWhite && canMove && !isBlocked && !pieceIsWhite) {
                return true;
            }

            else if(!kingIsWhite && canMove && !isBlocked && pieceIsWhite) {
                return true;
            }
        }
    }

    king_is_checkmated() {

        const kings = this.get_king_positions();
        const whitePlayer = this.players[0].isWhite? this.players[0] : this.players[1];
        const king = this.currentTurn === whitePlayer? kings[0] : kings[1];

        // 1. Is the king in check?
        const isKingChecked = this.king_is_checked(king); 

        // Iterate only around the king
        const startX = king.position.x - 1 > 0? king.position.x - 1 : 0;
        const endX = king.position.x + 1 < 7?  king.position.x + 1 : 7;
        const startY = king.position.y - 1 > 0? king.position.y - 1 : 0;
        const endY = king.position.y + 1 < 7?  king.position.y + 1 : 7;

        // 2. Check if the king has any legal moves
        let canKingMove = false;
        for(let x = startX; x <= endX; x++) {
            for(let y = startY; y <= endY; y++) {
                const newPos =  this.retrieve_tile_from_position(x,y);
                const move = new Move(null, king, newPos);
                if(this.is_legal_move(move)) {
                    canKingMove = true;
                    break;
                }
            }
        }
        
        // 3. Can any other pieces move?
        let canPieceMove = false;
        const pieceSet = this.currentTurn === whitePlayer? this.whitePieceSet : this.blackPieceSet;
        for(let i = 0; i < pieceSet.length; i++) {  
            for(let x = 0; x < 8; x++) {
                for(let y = 0; y < 8; y++) {
                    const newPos1 =  this.retrieve_tile_from_position(x,y);
                    const move = new Move(this.currentTurn, pieceSet[i], newPos1);
                    if(pieceSet[i].piece && this.is_legal_move(move)) {
                        canPieceMove = true;
                        break;
                    }
                }
            }
        }
        
        return !canKingMove && isKingChecked && !canPieceMove;

    }

    // --------------------------------------------- Functions for retrieving positions or pieces ----------------------------------------------------- //

    get_king_positions() {
        const kingPos = new Array(2);
        for(let x = 0; x < 8; x++) {
            for(let z = 0; z < 8; z++) {
                if(this.board[x][z].piece instanceof(King) )  {
                    if(this.board[x][z].piece.color == 'white') {
                        kingPos[0] = this.board[x][z];
                    }   
                    
                    else if (this.board[x][z].piece.color == 'black') {
                        kingPos[1] = this.board[x][z];
                    }
                }
            }
        }
        return kingPos;
    }

    retrieve_tile_from_position(posX, posY) {
        for(let i = 0; i < 8; i++) {
            const found = this.board[i].find(Tile => (Tile.position.x === posX) && (Tile.position.y === posY));
            if(found) {
                return found;
            }
        }
        
        return null;
    }

    get_rook(move) {
        let rook;
        if (move.startPos.piece instanceof(King)) {
            switch(move.endPos) {
                case this.board[7][6]: // White kingside
                    rook = this.whitePieceSet.find(Tile => Tile.piece.id === 31); 
                    break; 
                case this.board[7][2]:  // White queenside
                    rook = this.whitePieceSet.find(Tile => Tile.piece.id === 24); 
                    break; 
                case this.board[0][6]: // Black kingside
                    rook = this.blackPieceSet.find(Tile => Tile.piece.id === 7); 
                    break;
                case this.board[0][2]:  // Black queenside
                    rook = this.blackPieceSet.find(Tile => Tile.piece.id === 0); 
                    break;
            }   
        }
        return rook;
    }
}
