class Piece {

    constructor(color, id) {
        this.color = color;
        this.id = id;
        this.killed = false;
    }
}

export class Rook extends Piece{

    constructor(color, id, killed) {
        super(color, id, killed);
    }

    can_move(startPos, endPos) {

        const sameRow = endPos.position.x == startPos.position.x? true : false;
        const sameCol = endPos.position.y == startPos.position.y? true : false;
        return (sameCol || sameRow);
    }

}

export class Knight extends Piece{

    constructor(color, id, killed) {
        super(color, id, killed);
    }

    can_move(startPos, endPos) {

        const x = Math.abs(startPos.position.x - endPos.position.x);
        const y = Math.abs(startPos.position.y - endPos.position.y);

        return x * y == 2;
    }

   


}

export class Bishop extends Piece{

    constructor(color, id, killed) {
        super(color, id, killed);
    }

    can_move(startPos, endPos) {
        const x = Math.abs(endPos.position.x - startPos.position.x);
        const y = Math.abs(endPos.position.y - startPos.position.y);

        return x == y;
       
    }

}

export class Queen extends Piece{

    constructor(color, id, killed) {
        super(color, id, killed);
    }

    can_move(startPos, endPos) {

        const x = Math.abs(endPos.position.x - startPos.position.x);
        const y = Math.abs(endPos.position.y - startPos.position.y);

        const sameRow = endPos.position.x == startPos.position.x? true : false;
        const sameCol = endPos.position.y == startPos.position.y? true : false;
        return (sameCol || sameRow || x == y);
    }

}

export class King extends Piece{

    constructor(color, id, killed) {
        super(color, id, killed);
    }

    can_move(startPos, endPos) {

        const x = Math.abs(endPos.position.x - startPos.position.x);
        const y = Math.abs(endPos.position.y - startPos.position.y);

        const sameRow = endPos.position.x == startPos.position.x? true : false;
        const sameCol = endPos.position.y == startPos.position.y? true : false;
        return (sameCol && (x == 1) || sameRow && (y == 1) || (x == 1) && (y == 1));
    }

}

export class Pawn extends Piece{

    constructor(color, id, killed, atStart) {
        super(color, id, killed, atStart);
    }

    can_move(startPos, endPos) {
        // Conditions both colours can use
        const sameCol = endPos.position.y == startPos.position.y? true : false;
        const canTake = (endPos.piece && endPos.piece.color != startPos.piece.color)? true : false;

        // Movements both colours can use
        const moveLeft = startPos.position.y - endPos.position.y;
        const moveRight = endPos.position.y - startPos.position.y;

        switch(this.color){
            case 'black':
                const moveDown = endPos.position.x - startPos.position.x;
              
                const moveDownOne = moveDown == 1? true : false; 
                const moveDownTwo = moveDown <= 2 && moveDown > 0? true : false;
                
                const moveDownLeft = (moveLeft == 1 && moveDown == 1)? true : false
                const moveDownRight = (moveRight == 1 && moveDown == 1)? true : false

                // Conditions for white
                const atBlackStartRow = startPos.position.x == 1? true: false;

                if(atBlackStartRow && !endPos.piece) {
                    return (sameCol && moveDownTwo);
                }

                if(canTake) {
                    return (moveDownLeft || moveDownRight)
                }
                
                return (sameCol && moveDownOne);


            case 'white':
                 // Movement for white
                const moveUp = startPos.position.x - endPos.position.x;

                const moveUpOne = moveUp == 1? true : false; 
                const moveUpTwo = moveUp <= 2 && moveUp > 0? true : false;
                
                const moveUpLeft = (moveLeft == 1 && moveUp == 1)? true : false
                const moveUpRight = (moveRight == 1 && moveUp == 1)? true : false

                // Conditions for white
                const atWhiteStartRow = startPos.position.x == 6? true: false;

                if(atWhiteStartRow && !endPos.piece) {
                    return (sameCol && moveUpTwo);
                }

                if(canTake) {
                    return (moveUpLeft || moveUpRight)
                }
                
                return (sameCol && moveUpOne);
        }

       
        
    }

}