

export class Move {

    constructor(player, startPos, endPos) {
        this.player = player;
        this.startPos = startPos;
        this.endPos = endPos;
        this.pieceMoved = startPos.piece;
    }
}