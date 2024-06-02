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
            addImage_EventListeners(boardPiece, index)

            gameTile.append(boardPiece);
        }
    });
}
function addImage_EventListeners(boardPiece, index){
    boardPiece.addEventListener('click', function() {
        if(isValidChessPlayer(boardPiece.src)){
            movement.setSelectedPawn(boardPiece.src, index);
            movement.moveProcess();
        }
    });
}
// towards the actual game
function createMovement(){
    let selectedTile_Id = "";
    let activeTileArray;
    let confirmingMove = false;
    let opponent = true;

    function setSelectedPawn(boardPiece, boardIndex){
        selectedTile_Id = boardIndex;
        imageSrc = boardPiece;
    }
    function setOpponent(value){
        opponent = !value;
    }
    function getOpponent(){
        return opponent;
    }
    function getselectedId(){
        return selectedTile_Id;
    }
    function moveProcess(){
        if (confirmingMove == false) {
            confirmingMove = true;
            activeTileArray = fetchActiveTiles(selectedTile_Id, opponent);
            insertActiveTiles(activeTileArray);
        } else {
            removeAll_activeTiles();
            confirmingMove = false;
        }
    }
    return {moveProcess, getselectedId, setSelectedPawn, setOpponent, getOpponent}
}
// ActiveTile Functions
function insertActiveTiles(activeTileArray){
    for(let i = 0; i < activeTileArray.length; i++){
        const oneTileUp = document.getElementById(activeTileArray[i]);

        let highLightImg = document.createElement('img');
        highLightImg.src = "pieces/highlight.png";
        highLightImg.classList.add('transparent');
        activeTile_EventListener(highLightImg, activeTileArray[i]);

        oneTileUp.append(highLightImg);
    }
}
function removeAll_activeTiles() {
    const activeTiles = document.querySelectorAll('.transparent');
    activeTiles.forEach(tile => tile.remove());
}
function fetchActiveTiles(selectedTile_Id, opponent){
    const direction = opponent ? 1 : -1;
    return pawnMovement(selectedTile_Id, direction);
}
function activeTile_EventListener(highLightImg, activeTileIndex){
    highLightImg.addEventListener('click', function(){
        movePiece(movement.getselectedId(), activeTileIndex);
        movement.moveProcess();
    });
}
//These functions depend on Active Tiles to move. They move to active Tiles.
function movePiece(selectedTile_Id, selected_ActiveTile_Id) {
    promotion(selectedTile_Id, selected_ActiveTile_Id);
    const [selectedTileImg] = getImageWithId(selectedTile_Id);
    const createdPiece = document.createElement('img');

    createdPiece.src = selectedTileImg.src;
    createdPiece.classList.add('pieces');
    addImage_EventListeners(createdPiece, selected_ActiveTile_Id);
    capturingPiece(selected_ActiveTile_Id)

    document.getElementById(selected_ActiveTile_Id).append(createdPiece);
    selectedTileImg.remove();

    movement.setSelectedPawn(createdPiece.src, selected_ActiveTile_Id);
    movement.setOpponent(movement.getOpponent());
}
function capturingPiece(selected_ActiveTile_Id){
    let activeTileImage = getImageWithId(selected_ActiveTile_Id);
    activeTileImage[0].remove();
}
// Minor functions
function isValidBoundaries(value){
    if (value < 0 || value > 63) {
        return false;
    }
        return true;
}
function isValidSideBoundaries(offsetTile_Id, direction) {
    let offSetTileMod = offsetTile_Id % 8;
    let previousTileMod = (offsetTile_Id - direction) % 8;

    return !(previousTileMod === 0 && offSetTileMod === 7) && !(previousTileMod === 7 && offSetTileMod === 0);
}
function isValidChessPlayer(boardPiece) {
    const opponent = movement.getOpponent();
    return opponent ? boardPiece.includes("w_") : boardPiece.includes("b_");
}
function getImageWithId(tileId){
    let tileElement = document.getElementById(tileId);
    return tileElement.getElementsByTagName('img');
}
// Piece movement
function pawnMovement(selectedTile_Id, direction) {
    let activeTilesArray = [];
    let limit = 1;
    if((selectedTile_Id >= 8 && selectedTile_Id <= 15) || (selectedTile_Id >= 48 && selectedTile_Id <= 55)){
        limit = 2;
    }
    for (let i = 1; i <= limit; i++) {
        let newTile = selectedTile_Id - (8 * i * direction);
        if (!isValidBoundaries(newTile)) break;
        if(getImageWithId(newTile).length != 0) break;
        activeTilesArray.push(newTile);
    }

    [9, 7].forEach(offset => {
        let offsetTile_Id = selectedTile_Id - (offset * direction);
        if (isValidBoundaries(offsetTile_Id) && isValidSideBoundaries(offsetTile_Id, -(offset * direction))) {
            if (getImageWithId(offsetTile_Id).length != 0 && !isValidChessPlayer(getImageWithId(offsetTile_Id)[0].src)){
                activeTilesArray.push(offsetTile_Id);
            }
        }
    });
    return activeTilesArray;
}
function promotion(pawnTile_Id, targetTile_Id){
    const imgSrc = getImageWithId(pawnTile_Id)[0].src;
    let imageColor;
    if((targetTile_Id >= 0 && targetTile_Id <= 7) || (targetTile_Id >= 56 && targetTile_Id <= 63) && imgSrc.includes("Pawn")){
        imgSrc.includes("b") ? imageColor = "b": imageColor = "w";
        const promotionColor = document.getElementsByClassName(imageColor);
        for(let promotionTiles of promotionColor){
            promotionTiles.style.visibility = "visible";
            promotionTiles.onclick = function(){
                const promotionPiece = promotionTiles.getElementsByTagName('img');
                const promotionTile = document.getElementById(targetTile_Id);
                const perviousPiece = promotionTile.getElementsByTagName('img');
                perviousPiece[0].src = promotionPiece[0].src
                for(let promotionTilesHide of promotionColor){
                    promotionTilesHide.style.visibility = "hidden";
                }
            }
        }
    }
}
createBoard();
const movement = createMovement();