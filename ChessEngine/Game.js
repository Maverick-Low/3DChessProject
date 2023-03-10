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


        // if (move.startPos.piece instanceof(King)) {
        //     // RHS castling for white
        //     const king = move.startPos.piece;
        //     const rook = this.board[7][7].piece? this.board[7][7].piece : null;
            
        //     if(king.canCastle && rook.canCastle) {
        //         const castleRook = new Move(this.currentTurn, this.board[7][7], this.board[7][5]);
        //         this.move_piece(castleRook);
        //         console.log('castled');
        //     }
        // }
        
        // Update piecesets 
        // const index = pieceSet.indexOf(oldTile);
        // console.log('newTile', newTile.piece);
        // console.log('index', index);
        
        // if(move.endPos.piece instanceof(King)) {
        //     // const king = move.endPos.piece;
        //     // const atStartPos = move.endPos.position.x === 7 && move.endPos.position.y === 6;
        //     // let rookAtStartPos = false;
        //     // let rook;
        //     // if(this.board[7][7].piece) {
        //     //     rookAtStartPos = this.board[7][7].piece && this.board[7][7].piece instanceof(Rook);
        //     //     rook = this.board[7][7].piece
        //     // }
            
        //     // if(atStartPos && king.canCastle === true && rookAtStartPos === true && rook.canCastle === true) {
        //     //     console.log('castled');
        //     // }
        //     // move.endPos.piece.canCastle = false;

        //     // RHS castling for white
        //     const king = move.endPos.piece;
        //     const rook = this.board[7][7].piece? this.board[7][7].piece : null;
            
        //     if(king.canCastle && rook.canCastle) {
        //         const castleRook = new Move(this.currentTurn, this.board[7][7], this.board[7][5]);
        //         this.move_piece(castleRook);
        //         console.log('castled');
        //     }
        // }
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
        

        const rook = this.whitePieceSet.find(Tile => (Tile.piece.id === 31));
        const canRookCastle = rook.piece.canCastle;
    
        if(move.startPos.piece instanceof(King) && move.startPos.piece.canCastle && canRookCastle)  {
            const sameRow = move.endPos.position.x === move.startPos.position.x;
            const y = Math.abs(move.endPos.position.y - move.startPos.position.y);
            const canMoveTwo = sameRow && (y == 2);
            return (isEmpty || isSameColor == false) && (canMove || canMoveTwo) && !isBlocked && correctTurn;
        }


       return (isEmpty || isSameColor == false) && canMove && !isBlocked && correctTurn;
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

    can_castle(move) {
        if (move.startPos.piece instanceof(King)) {
    
            // Castling for white king
            const king = move.startPos.piece;
            const rookTile = this.get_rook(move);

            const newKingPosRHS = this.board[7][6];
            const newKingPosLHS = this.board[7][2];
            const kingEndPos = move.endPos === this.board[7][6]? newKingPosRHS : newKingPosLHS;

            const movedFromStart = (move.startPos === this.board[7][4]) && (move.endPos === kingEndPos);

            return rookTile.piece && king.canCastle && rookTile.piece.canCastle && movedFromStart;
            
        }

    }

    // --------------------------------------------- Functions for checking / checkmating  ----------------------------------------------------- //

    king_is_checked() {
        let isBlocked = true;
        let canMove = false;
        const kings = this.get_king_positions();
        const kingTile = this.currentTurn === this.players[0]? kings[0] : kings[1];

        for(let x = 0; x < 8; x++) {
            for(let z = 0; z < 8; z++) {
                const currentTile = this.board[x][z];
                const move = new Move(null, currentTile, kingTile);
                isBlocked = this.is_blocked(move);

                if(currentTile.piece) {
                    const kingIsWhite = kingTile.piece.color == 'white';
                    const pieceIsWhite = currentTile.piece.color == 'white';
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

    king_is_checkmated() {

        let canKingMove = false;
        const kings = this.get_king_positions();
        const king = this.currentTurn === this.players[0]? kings[0] : kings[1];
        const isKingChecked = this.king_is_checked(king); // 1. Is the king in check

        // Iterate only around the king
        const startX = king.position.x - 1 > 0? king.position.x - 1 : 0;
        const endX = king.position.x + 1 < 7?  king.position.x + 1 : 7;
        const startY = king.position.y - 1 > 0? king.position.y - 1 : 0;
        const endY = king.position.y + 1 < 7?  king.position.y + 1 : 7;

        // 2. Check if the king has any legal moves
        for(let x = startX; x <= endX; x++) {
            for(let y = startY; y <= endY; y++) {
                const newPos =  this.retrieve_tile_from_position(x,y);
                const move = new Move(this.currentTurn, king, newPos);
                if(this.is_legal_move(move)) {
                    canKingMove = true;
                    break;
                }
            }
        }
        
        // 3. Can any other pieces move
        let canPieceMove = false;
        const pieceSet = this.currentTurn === this.players[0]? this.whitePieceSet : this.blackPieceSet;
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
                case this.board[7][6]: // White Rook RHS
                        rook = this.whitePieceSet.find(Tile => Tile.piece.id === 31); 
                        break; 
                case this.board[7][2]:  // White Rook LHS
                        rook = this.whitePieceSet.find(Tile => Tile.piece.id === 24); 
                        break; 
            }   
        }
        return rook;
    }
}
