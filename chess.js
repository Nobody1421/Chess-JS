const gameBoard = document.getElementById("board");

let startingPieces = 
[
    "b_RookImg.png", "b_KnightImg.png", "b_BishopImg.png", "b_QueenImg.png", "b_KingImg.png", "b_BishopImg.png", "b_KnightImg.png", "b_RookImg.png",
    "b_PawnImg.png", "b_PawnImg.png", "b_PawnImg.png", "b_PawnImg.png", "b_PawnImg.png", "b_PawnImg.png", "b_PawnImg.png", "b_PawnImg.png",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    " ", " ", " ", " ", " ", " ", " ", " ",
    "w_PawnImg.png", "w_PawnImg.png", "w_PawnImg.png", "w_PawnImg.png", "w_PawnImg.png", "w_PawnImg.png", "w_PawnImg.png", "w_PawnImg.png",
    "w_RookImg.png", "w_KnightImg.png", "w_BishopImg.png", "w_QueenImg.png", "w_KingImg.png", "w_BishopImg.png", "w_KnightImg.png", "w_RookImg.png",
];
function createBoard(){
    startingPieces.forEach((piece, index) => {
        const gameTile = document.createElement('div');
        gameTile.classList.add('tiles');
        gameTile.setAttribute('id', index);
        gameBoard.append(gameTile);

        const is_Even_Row = (Math.ceil((index + 1) / 8) % 2) === 0;
        const is_Odd_Tile = index % 2 === 1;
        
        if(is_Even_Row){
            gameTile.classList.add(is_Odd_Tile ? 'white' : 'green');
        }else{
            gameTile.classList.add(is_Odd_Tile ? 'green' : 'white');
        }
        if(piece != " "){
            const boardPiece = document.createElement('img');
            boardPiece.src = "pieces/" + piece;
            boardPiece.classList.add('pieces');
            gameTile.append(boardPiece);
        }
    });
}
// towards the actual game
function createMovement(){
    let imageSrc = "";
    let selectedTile_Id = "";
    let selectedSquare = false;
    let activeTileArray;
    let activeTileId = "";

    function setSelectedPawn(boardPiece, boardIndex){
        selectedTile_Id = boardIndex;
        imageSrc = boardPiece;
    }
    function setActiveTileId(activeTileIndex){
        activeTileId = activeTileIndex;
    }
    function moveProcess(){
        if(selectedSquare == false){
            
            selectedSquare = true;

            activeTileArray = getActiveTiles(selectedTile_Id);
            addActiveTiles(activeTileArray);
        }else{
            movePawn(selectedTile_Id);
            removeAll_activeTiles();
            selectedSquare = false;
        }
    }
    function addActiveTiles(activeTileArray){
        for(let i = 0; i < activeTileArray.length; i++){
            const oneTileUp = document.getElementById(activeTileArray[i]);

            const highLightImg = document.createElement('img');
            highLightImg.src = "pieces/highlight.png";
            highLightImg.classList.add('transparent');
            activeTile_EventListener(highLightImg, activeTileArray[i]);

            oneTileUp.append(highLightImg);
        }
    }
    return {moveProcess, setActiveTileId, setSelectedPawn}
}
function getActiveTiles(selectedTile_Id){
    let activeTileArray = [selectedTile_Id - 8, selectedTile_Id - 16];
    return activeTileArray;
}

function movePawn(){

}
function removeAll_activeTiles(){
    const activeTiles = document.getElementsByClassName('transparent');
    let activeTilesLength = activeTiles.length;
    for(let i = 0; i < activeTilesLength; i++){
        activeTiles[0].remove();
    }
}
function activeTile_EventListener(highLightImg, activeTileIndex){
    highLightImg.addEventListener('click', function(){
        movement.setActiveTileId(activeTileIndex);
        movement.moveProcess();
    });
}
function Image_EventListeners(){
    const boardSquares = document.getElementsByClassName('tiles');
    for(let i = 0; i < boardSquares.length; i++){
        const occupiedPiece = boardSquares[i].getElementsByTagName('img');
        if(occupiedPiece.length == 1){
            occupiedPiece[0].addEventListener('click', function() {
                movement.setSelectedPawn(occupiedPiece[0].src, boardSquares[i].id);
                movement.moveProcess();
            });
        }
    }
}

function movePiece(){

}
createBoard();
const movement = createMovement();
Image_EventListeners();