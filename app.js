const chalk = require('chalk');
const readline = require('readline');
const keypress = require('keypress');
const { read } = require('fs');
const { exit } = require('process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const N = 22; // x
const M = 22; // y

const fieldColor = chalk.bgBlack;
const snakeColor = chalk.bgRgb(29, 92, 23);
const wallColor = chalk.bgWhite;
const appleColor = chalk.bgRed;
const scoreColor = chalk.yellow;

let field = [];

// Заполнения двомерного массива, для определения стен и свободного пространства
for (let i = 0; i < M; i++) {
    field.push([]);
    for (let j = 0; j < N; j++) {
        if (i === 0 || i === M - 1 || j === 0 || j === N - 1) {
            field[i].push(-1);
        } else {
            field[i].push(0);
        }
    }
}

// Объект для определения направления игрока
let playerMove = {
    up: false,
    down: false,
    left: false,
    right: false,
    allMoves: [],
    set(up, down, left, right) {
        this.up = up;
        this.down = down;
        this.left = left;
        this.right = right;
        this.allMoves = [up, down, left, right];
    }
}

let applePos = {
    xPos: 0,
    yPos: 0,
    xIndex: 0,
    yIndex: 0,
    setPos(x, y) {
        this.xPos = x;
        this.yPos = y;
    },
    setIndex(x, y) {
        this.xIndex = x;
        this.yIndex = y;
    }
}

let appleHave = false;
let appleCount = 0;

let snakeBlocks = [];

class SnakeBlock {
    constructor(xIndex, yIndex) {
        this.xIndex = xIndex;
        this.yIndex = yIndex;
        this.deltaX = 0;
        this.deltaY = 0;
        this.xPos = this.xIndex * 2;
        this.yPos = this.yIndex;
    }
    setDelta(deltaX, deltaY) {
        this.deltaX = deltaX;
        this.deltaY = deltaY;
    }
    setPos(x, y) {
        this.xPos = x;
        this.yPos = y;
    }
    setIndex(x, y) {
        this.xIndex = x;
        this.yIndex = y;
        this.setPos(x * 2, y);
    }
}

keypress(process.stdin);
process.stdin.on('keypress', function (ch, key) {

    if (key && key.ctrl && key.name == 'c') {

        process.stdin.pause();

    } else if (key && key.name == 'w') {

        playerMove.set(true, false, false, false);

    } else if (key && key.name == 's') {

        playerMove.set(false, true, false, false);

    } else if (key && key.name == 'a') {

        playerMove.set(false, false, true, false);

    } else if (key && key.name == 'd') {

        playerMove.set(false, false, false, true);
    }
});
process.stdin.setRawMode(true);
process.stdin.resume();

snakeBlocks.push(new SnakeBlock(N / 2, M / 2));

console.clear();

// Отрисовка игрового поля
for (let i = 0; i < M; i++) {
    readline.cursorTo(rl, 0, i);
    for (let j = 0; j < N; j++) {
        if (field[i][j] === -1) {
            process.stdout.write(wallColor('  '));
        } else {
            process.stdout.write(fieldColor('  '));
        }
    }
}


let mainLoop = setInterval(() => {
    
    let deltaX = 0;
    let deltaY = 0;

    if (playerMove.up && (field[snakeBlocks[0].yIndex - 1][snakeBlocks[0].xIndex] == 0 || field[snakeBlocks[0].yIndex - 1][snakeBlocks[0].xIndex] == 2)) {

        deltaY = -1;

    } else if (playerMove.down && (field[snakeBlocks[0].yIndex + 1][snakeBlocks[0].xIndex] == 0 || field[snakeBlocks[0].yIndex + 1][snakeBlocks[0].xIndex] == 2)) {

        deltaY = 1;

    } else if (playerMove.left && (field[snakeBlocks[0].yIndex][snakeBlocks[0].xIndex - 1] == 0 || field[snakeBlocks[0].yIndex][snakeBlocks[0].xIndex - 1] == 2)) {

        deltaX =  -1;

    } else if (playerMove.right && (field[snakeBlocks[0].yIndex][snakeBlocks[0].xIndex + 1] == 0 || field[snakeBlocks[0].yIndex][snakeBlocks[0].xIndex + 1] == 2)) {

        deltaX = 1;
    }

    snakeBlocks[0].setDelta(deltaX, deltaY);

    if (field[snakeBlocks[0].yIndex + snakeBlocks[0].deltaY][snakeBlocks[0].xIndex + snakeBlocks[0].deltaX] === 2) {
        appleHave = false;
        field[snakeBlocks[0].yIndex][snakeBlocks[0].xIndex] = 0;

        snakeBlocks.push(new SnakeBlock(snakeBlocks[snakeBlocks.length - 1].xIndex, snakeBlocks[snakeBlocks.length - 1].yIndex));
        appleCount++;
    } else if (field[snakeBlocks[0].yIndex + snakeBlocks[0].deltaY][snakeBlocks[0].xIndex + snakeBlocks[0].deltaX] !== 0) {
        if (snakeBlocks.length !== 1) {
            clearInterval(mainLoop);
            gameOver();
        }
    }

    if (!appleHave) {
        while (true) {
            applePos.setIndex(getRandomInt(1, M), getRandomInt(1, N));
            if (field[applePos.yIndex][applePos.xIndex] === 0) {
                break;
            }
        }
        field[applePos.yIndex][applePos.xIndex] = 2;
        applePos.setPos(applePos.xIndex * 2, applePos.yIndex);
        appleHave = true;
        
        // Вывод количества набранных очок
        readline.cursorTo(rl, (N + 1)* 2, 1);
        process.stdout.write(scoreColor(`Score: ${appleCount}`));
            
        // Яблочко (отрисовка)
        readline.cursorTo(rl, applePos.xPos, applePos.yPos);
        process.stdout.write(appleColor('  '));
    }


    // Передвижение змейки + отрисовка
    for(let i = snakeBlocks.length - 1; i >= 0; i--){
        if (i === snakeBlocks.length - 1){
            readline.cursorTo(rl, snakeBlocks[i].xPos, snakeBlocks[i].yPos);
            process.stdout.write(fieldColor('  '));
            field[snakeBlocks[i].yIndex][snakeBlocks[i].xIndex] = 0;
        }

        snakeBlocks[i].setIndex(snakeBlocks[i].xIndex + snakeBlocks[i].deltaX, snakeBlocks[i].yIndex + snakeBlocks[i].deltaY);
        if (i !== 0 ){
            snakeBlocks[i].setDelta(snakeBlocks[i - 1].deltaX, snakeBlocks[i -1].deltaY);
        } else {
            readline.cursorTo(rl, snakeBlocks[i].xPos, snakeBlocks[i].yPos);
            process.stdout.write(snakeColor('  '));
            field[snakeBlocks[i].yIndex][snakeBlocks[i].xIndex] = 1;
        }
        
    }

    // Перевод курсора с игрового поля
    readline.cursorTo(rl, 0, M + 1);
    process.stdout.write(chalk.black('              '));
    readline.cursorTo(rl, 0, M + 1);

}, 200);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // Максимум не включается, минимум включается
}

function gameOver(){
    readline.cursorTo(rl, 0, M + 1);
    console.log(chalk.redBright('Game Over'));
    console.log(`Score: ${appleCount}`);
    exit();
}
