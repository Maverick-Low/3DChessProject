import { Board } from "./Board";
import { Player } from "./Player";
import { Rook, Queen, Bishop, Pawn, King} from "./Pieces";
import { Move } from "./Move";

export class Game {

    constructor() {
        this.players = this.create_two_players();
        this.board = this.create_board();
        this.status = this.gameStatus.active;
        this.movesList = new Array();
        this.currentTurn = this.players[0];
    }

    gameStatus = {
        active: 0,
        blackWon: 1,
        whiteWon: 2,
        forfeit: 3,
        stalemate: 4,
    }

    create_two_players() {
        const players = new Array(2);
        players[0] = new Player(true);
        players[1] = new Player(false);
        return players;
    }

    create_board() {
        const board = new Board();
        return board.initialise_board();
    }

    move_piece(move) {
        const piece = move.pieceMoved;
        move.startPos.piece = null;
        move.endPos.piece = piece;
    }

    valid_move(move) {
        const canMove = move.startPos.piece.can_move(move.startPos, move.endPos);
        const isEmpty = !move.endPos.piece;

        let isSameColor = false;
        let isBlocked = this.is_blocked(move);

        if(!isEmpty) {
            isSameColor = move.startPos.piece.color == move.endPos.piece.color? true: false;
        }


        if((isEmpty || isSameColor == false) && canMove && !isBlocked) {
            return true;
        }

        return false;
    }

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

    // Returns true if black or white king are in check - Function assumes argument passed is the tile containing one of the 2 Kings
    king_is_checked(kingTile) {

        let isBlocked = true;
        let canMove = false;

        for(let x = 0; x < 8; x++) {
            for(let z = 0; z < 8; z++) {
                const currentTile = this.board[x][z];
                const move = new Move(null, currentTile, kingTile);
                isBlocked = this.is_blocked(move);

                if(currentTile.piece) {
                    const kingIsWhite = kingTile.piece.color == 'white'? true : false;
                    const pieceIsWhite = currentTile.piece.color == 'white'? true : false;
                    canMove = currentTile.piece.can_move(currentTile, kingTile);

                    if(kingIsWhite && canMove && !isBlocked && !pieceIsWhite) {
                        return true;
                    }

                    else if(!kingIsWhite && canMove && !isBlocked && pieceIsWhite) {
                        return true;
                    }
                }    
            }
        }
        return false;
    }
    
    get_king_position() {
        for(let x = 0; x < 8; x++) {
            for(let z = 0; z < 8; z++) {
                if(this.board[x][z].piece instanceof(King) )  {
                    if(this.board[x][z].piece.color == 'white') {
                        return this.board[x][z];
                    }      
                }
            }
        }
    }

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
        
            const color = kingColour === 'white'? 'white' : 'black';
            canStopCheck = isKingChecked && !willKingBeChecked && pieceAtStart.color === color;
            willNotLeadToCheck = !isKingChecked && !(willKingBeChecked && pieceAtStart.color === color);
            
            if(canStopCheck || willNotLeadToCheck) {
                return true;
            }
            
            return false;
        }
        
    }
}
