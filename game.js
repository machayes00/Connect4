let canvas;
let context;
let boardWidth = 7;
let boardHeight = 6;
let model = {
    board: new Array(boardHeight),
    next: '⚪️',
    winner: 0,
}

function initBoard() {
    for (let i = 0; i < boardHeight; i++) {
        model.board[i] = new Array(boardWidth);
    }
    for (let i = 0; i < boardHeight; i++) {
        for (let j = 0; j < boardWidth; j++) {
            model.board[i][j] = ' ';
        }
    }
}

document.addEventListener("click", e => {
    console.log(e.x, e.y);
})

function tick() {
    window.requestAnimationFrame(splat);
}

function splat() {
    context.clearRect(0,0,canvas.width,canvas.height);
 // Adapted from https://www.html5canvastutorials.com/tutorials/html5-canvas-lines/
    context.strokeStyle = "bd007c";
    context.lineWidth = 4;
    for(let i = 0; i <= boardWidth; i++) {
        context.beginPath();
        context.moveTo((i * 500)/boardWidth + 441, 0);
        context.lineTo((i * 500)/boardWidth + 441, canvas.height);
        context.stroke();
    }
    for(let i = 0; i <= boardHeight; i++) {
        context.beginPath();
        context.moveTo(441, (i * canvas.height)/boardHeight);
        context.lineTo(941, (i * canvas.height)/boardHeight);
        context.stroke();
    }
    //fills board with array
    context.font = "40pt Calibri";
    for(let i = 0; i < boardHeight; i++) {
        for(let j = 0; j < boardWidth; j++) {
            let piece = model.board[i][j];
            context.fillText(piece, j * (500/boardWidth) + 450, (canvas.height- 22) - (i * (canvas.height/boardHeight)))
        }
    }
    if(model.winner == 0 && drawCheck() == false) {
        tick();
    } else {
        splatVictoryScreen();
    }
}

function splatVictoryScreen() {
    context.fillStyle = "black";
    context.fillRect(175, 310, 140, 50);
    context.font = "30pt Arial";
    context.fillStyle = "white";
    context.fillText("RESET", 177, 350);
}

function roundXs(x) {
    return Math.floor((x-450)/(500/boardWidth));
}

function roundYs(y) {
    return Math.floor(((y-10)/(canvas.height/boardHeight)));
}

function lowestEmpty(j) {
    let lowest = 0;
    for(let i = 0; i < boardHeight; i++) {
        if(model.board[i][j] == '⚪️' || model.board[i][j] == '⚫️') {
            lowest++;
        } else {
            break;
        }
    }
    if(lowest == 6) {
        return 5;
    }
    return lowest;
}

function victoryCheckHelper(i, j, deltaI, deltaJ, connect) {
    if(connect == 4) {
        return connect;
    }
    if (j < boardWidth && j >= 0 && i < boardHeight && i >= 0) {
        if(model.board[i][j] == model.next){
            return victoryCheckHelper(i+deltaI, j+deltaJ, deltaI, deltaJ, connect+1);
        } else {
            return connect; //return the value if it stops, so we can add it up later
        }
    } else {
        return connect; //return the value since we don't want to exclude anything "connected" to the edge of the board
    }
}

function victoryCheck(y, x) {
    let right = victoryCheckHelper(y, x, 0, 1, 0);
    let left = victoryCheckHelper(y, x, 0, -1, 0);
    let up = victoryCheckHelper(y, x, 1, 0, 0);
    let down = victoryCheckHelper(y, x, -1, 0, 0);
    let upRight = victoryCheckHelper(y, x, 1, 1, 0);
    let downLeft = victoryCheckHelper(y, x, -1, -1, 0);
    let upLeft = victoryCheckHelper(y, x, 1, -1, 0);
    let downRight = victoryCheckHelper(y, x, -1, 1, 0);
    if(right + left-1 >= 4 || up + down-1 >= 4 || upRight + downLeft-1 >= 4 || upLeft + downRight-1 >= 4) { return true;}
    //note: must subtract 1 from these additions since the placed piece is counted once in EACH variable
}

function drawCheck() {
    for (let j = 0; j < boardWidth; j++) {
        if(model.board[boardHeight-1][j] == ' ') {
            return false;
        } else if(model.board[boardHeight-1][boardWidth-1] != ' ' && j == (boardWidth - 1)) {
            return true;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.querySelector("#myCanvas");
    context = canvas.getContext("2d");
    console.log(context);
    initBoard();
    splat();
})

document.addEventListener("click", e => {
    j = roundXs(e.x);
    i = roundYs(e.y);
    if(i < 0 || i > 5) {return;}
    if(j < 0 || j > 6) {return;}
    if(model.board[lowestEmpty(j)][j] == '⚪️' || model.board[lowestEmpty(j)][j] == '⚫️') {return;}
    if(model.next == '⚪️') {
        model.board[lowestEmpty(j)][j] = '⚪️';
        if(victoryCheck(lowestEmpty(j)-1, j)) {
            model.winner = 1;
        }
        model.next = '⚫️';
    } else {
        model.board[lowestEmpty(j)][j] = '⚫️';
        if(victoryCheck(lowestEmpty(j)-1, j)) {
            model.winner = 1;
        }
        model.next = '⚪️';
    }
})

document.addEventListener("click", e => {
    if((model.winner == 1 || drawCheck()) && e.x >= 175 && e.x <= 175+140 && e.y >= 310 && e.y <= 360) {
        for (let i = 0; i < boardHeight; i++) {
            for (let j = 0; j < boardWidth; j++) {
                model.board[i][j] = ' ';
            }
        }
        model.winner = 0;
        splat();     
    }
})
