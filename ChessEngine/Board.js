import { Tile } from "./Tile";
import { Knight, Rook, Bishop, Queen, King, Pawn } from "./Pieces";


export class Board {
    
    constructor() {
        this.board = this.initialise_board();
    }

    initialise_board() {
        var board = new Array(8);

        // Fill board with tiles
        for(let x = 0; x < 8; x++) {
            board[x] = new Array(8);
            for(let y = 0; y < 8; y++) {
                board[x][y] = new Tile(null , {x, y});
            }

        }

        // Black Pieces
        board[0][0].piece = new Rook('black', 0);
        board[0][1].piece = new Knight('black', 1);
        board[0][2].piece = new Bishop('black', 2);
        board[0][3].piece = new Queen('black', 3);
        board[0][4].piece = new King('black', 4);
        board[0][5].piece = new Bishop('black', 5);
        board[0][6].piece = new Knight('black', 6);
        board[0][7].piece = new Rook('black', 7);
        

        // Black Pawns
        for(let y = 0; y < 8; y++) {
            board[1][y].piece = new Pawn('black', y+8);
        }
        
        // White Pieces
        board[7][0].piece = new Rook('white', 24);
        board[7][1].piece = new Knight('white', 25);
        board[7][2].piece = new Bishop('white', 26);
        board[7][3].piece = new Queen('white', 27);
        board[7][4].piece = new King('white', 28);
        board[7][5].piece = new Bishop('white', 29);
        board[7][6].piece = new Knight('white', 30);
        board[7][7].piece = new Rook('white', 31);
        

        // White Pawns
        for(let y = 0; y < 8; y++) {
            board[6][y].piece = new Pawn('white', y+16);
        }
        return board;
    }

    
}
