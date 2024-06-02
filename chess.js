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
    const gameBoard = document.getElementById("board");
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
            addImage_EventListeners(boardPiece, index);

            gameTile.append(boardPiece);
        }
    });
}
function addImage_EventListeners(pieceImage, TileId){
    pieceImage.addEventListener('click', function() {
        movement.setCurrentTileId(TileId);
        movement.moveProcess();
    });
}
// towards the actual game
function createMovement(){
    let currentTileId = "";
    let targetTileArray;
    let confirmingMove = false;
    let opponent = true;

    function setCurrentTileId(boardIndex){
        currentTileId = boardIndex;
    }
    function setOpponent(value){
        opponent = !value;
    }
    function getOpponent(){
        return opponent;
    }
    function getCurrentTileId(){
        return currentTileId;
    }
    function moveProcess(){
        if (confirmingMove == false) {
            confirmingMove = true;
            targetTileArray = fetchTargetTiles(currentTileId, opponent);
            insertTargetTiles(targetTileArray);
        } else {
            clearTargetTiles();
            confirmingMove = false;
        }
    }
    return {moveProcess, getCurrentTileId, setCurrentTileId, setOpponent, getOpponent}
}
// ActiveTile Functions
function insertTargetTiles(targetTilesArray){
    for(let i = 0; i < targetTilesArray.length; i++){
        const nextTileId = document.getElementById(targetTilesArray[i]);

        let focusImage = document.createElement('img');
        focusImage.src = "pieces/highlight.png";
        focusImage.classList.add('transparent');
        addTargetTile_EventListener(focusImage, targetTilesArray[i]);

        nextTileId.append(focusImage);
    }
}
function clearTargetTiles() {
    const targetTilesArray = document.querySelectorAll('.transparent');
    targetTilesArray.forEach(tile => tile.remove());
}
function fetchTargetTiles(currentTileId, opponent){
    const direction = opponent ? 1 : -1;
    return pawnMovement(currentTileId, direction);
}
function addTargetTile_EventListener(focusImage, targetTileId){
    focusImage.addEventListener('click', function(){
        movePiece(movement.getCurrentTileId(), targetTileId);
        movement.moveProcess();
    });
}
//These functions depend on target Tiles to move. They move to target Tiles.
function movePiece(currentTileId, targetTileId) {
    promotion(currentTileId, targetTileId);
    const [currentTileImage] = getImageWithId(currentTileId);
    const newPiece = document.createElement('img');

    newPiece.src = currentTileImage.src;
    newPiece.classList.add('pieces');
    addImage_EventListeners(newPiece, targetTileId);
    capturingPiece(targetTileId)

    document.getElementById(targetTileId).append(newPiece);
    currentTileImage.remove();

    movement.setCurrentTileId(targetTileId);
    movement.setOpponent(movement.getOpponent());
}
function capturingPiece(targetTileId){
    let targetTileImage = getImageWithId(targetTileId);
    targetTileImage[0].remove();
}
// Minor functions
function isValidBoundaries(value){
    if (value < 0 || value > 63) {
        return false;
    }
        return true;
}
function isValidSideBoundaries(newTileId, moveDirection) {
    let newTileMod = newTileId % 8;
    let previousTileMod = (newTileId - moveDirection) % 8;

    return !(previousTileMod === 0 && newTileMod === 7) && !(previousTileMod === 7 && newTileMod === 0);
}
function isValidChessPlayer(playerPiece) {
    const opponent = movement.getOpponent();
    return opponent ? playerPiece.includes("w_") : playerPiece.includes("b_");
}
function getImageWithId(tileId){
    let tileElement = document.getElementById(tileId);
    return tileElement.getElementsByTagName('img');
}
// Piece movement
function pawnMovement(currentTileId, direction) {
    let targetTilesArray = [];
    let limit = 1;
    if((currentTileId >= 8 && currentTileId <= 15) || (currentTileId >= 48 && currentTileId <= 55)){
        limit = 2;
    }
    for (let i = 1; i <= limit; i++) {
        let nextTileId = currentTileId - (8 * i * direction);
        if (!isValidBoundaries(nextTileId)) break;
        if(getImageWithId(nextTileId).length != 0) break;
        targetTilesArray.push(nextTileId);
    }

    [9, 7].forEach(offset => {
        let offsetTileId = currentTileId - (offset * direction);
        if (isValidBoundaries(offsetTileId) && isValidSideBoundaries(offsetTileId, -(offset * direction))) {
            if (getImageWithId(offsetTileId).length != 0 && !isValidChessPlayer(getImageWithId(offsetTileId)[0].src)){
                targetTilesArray.push(offsetTileId);
            }
        }
    });
    return targetTilesArray;
}
// Promotion Function
function promotion(pawnTile_Id, targetTile_Id){
    const imgSrc = getImageWithId(pawnTile_Id)[0].src;
    if(imgSrc.includes("Pawn") && ((targetTile_Id >= 0 && targetTile_Id <= 7) || (targetTile_Id >= 56 && targetTile_Id <= 63))){
        const imageColor = imgSrc.includes("b") ? "b" : "w";
        const promotionTiles = document.getElementsByClassName(imageColor);
        Array.from(promotionTiles).forEach(tile => {
            tile.style.visibility = "visible";
            tile.onclick = () => {
                document.getElementById(targetTile_Id).getElementsByTagName('img')[0].src = tile.getElementsByTagName('img')[0].src;
                Array.from(promotionTiles).forEach(t => t.style.visibility = "hidden");
            };
        });
    }
}
createBoard();
const movement = createMovement();