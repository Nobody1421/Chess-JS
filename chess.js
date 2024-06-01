const gameBoard = document.getElementById("board");

let startingPieces = 
[
    "RookImg.png", "KnightImg.png", "Bishop.png", "QueenImg.png", "KingImg.png", "Bishop.png", "KnightImg.png", "RookImg.png",
    "PawnImg.png", "PawnImg.png", "PawnImg.png", "PawnImg.png", "PawnImg.png", "PawnImg.png", "PawnImg.png", "PawnImg.png",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    "black_PawnImg.png", "black_PawnImg.png", "black_PawnImg.png", "black_PawnImg.png", "black_PawnImg.png", "black_PawnImg.png", "black_PawnImg.png", "black_PawnImg.png",
    "black_RookImg.png", "black_KnightImg.png", "black_BishopImg.png", "black_QueenImg.png", "black_KingImg.png", "black_BishopImg.png", "black_KnightImg.png", "black_RookImg.png",
];

function createBoard(){
    startingPieces.forEach((piece, index) => {
        const square = document.createElement('div');
        square.classList.add('square');
        gameBoard.append(square);

        const is_Even_Row = (Math.ceil((index + 1) / 8) % 2) === 0;
        const is_Odd_Square = index % 2 === 1;
        
        if(is_Even_Row){
            square.classList.add(is_Odd_Square ? 'white' : 'green');
        }else{
            square.classList.add(is_Odd_Square ? 'green' : 'white');
        }
        if(piece != " "){
            const boardPiece = document.createElement('img');
            const pieceSrc = "pieces/" + piece;
            boardPiece.src = pieceSrc;
            boardPiece.classList.add('pieces');
            
            square.append(boardPiece);
        }
    });
}
createBoard();