"use strict";

let animationId;

//board
let board;
const boardWidth = 500;
const boardHeight = 500; // don't set size in html/css
let ctx;

// player // always declare config variables of the obj outside so its easy to change them and remove magic no's
const playerWidth = 80;
const playerHeight = 10;
const playerdx = 20;

let player = {
  width: playerWidth, // size of the object
  height: playerHeight,
  x: boardWidth / 2 - playerWidth / 2, // x and y kaha pe banana hai??
  y: boardHeight - playerHeight - 5,
  dx: playerdx, // for changing position
};

// ball
const ballWidth = 10;
const ballHeight = 10;
const balldx = 4;
const balldy = 3;

let ball = {
  height: ballHeight,
  width: ballWidth,
  x: boardWidth / 2,
  y: boardHeight / 2,
  dx: balldx,
  dy: balldy,
};

// block
let blockArray = [];
const blockheight = 6;
const blockwidth = 55;
const blockx = 25;
const blocky = 45;
let blockRows = 3;
const blockCols = 7;
const blockMaxRows = 10;
let blockCount = 0;

let score = 0;
let gameOver = false;

window.onload = function () {
  // window.onload waits for everyting incl. the imgs and domcontentloaded just waits for dom
  // use onload maybe you are selecting an ele which hasn't been loaded yet
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  ctx = board.getContext("2d");
  createBars();
  update();
  document.addEventListener("keydown", movePlayer);
};

function update() {
  animationId = requestAnimationFrame(update); // available on window obj
  // clear(); don't make functions for 1-2 lines of code over optimisation
  ctx.clearRect(0, 0, board.width, board.height);
  //draw player
  ctx.fillStyle = "rgb(6, 205, 205)";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  updateBall();
  drawBars();
  ctx.font = "20px Arial";
  ctx.fillText(score, 10, 25);

  //next level
  if (blockCount == 0) {
    score += 100 * blockRows * blockCols; // bonus points
    blockRows = Math.min(blockMaxRows, blockRows + 1);
    createBars();
  }
}

function outOfBounds(xPosition) {
  // generalised method no hardcoded no's
  return xPosition < 0 || xPosition + player.width > boardWidth;
}

function movePlayer(e) {
  if (e.key === "ArrowLeft") {
    let nextPositon = player.x - player.dx;
    if (!outOfBounds(nextPositon)) player.x = nextPositon;
  } else if (e.key === "ArrowRight") {
    let nextPositon = player.x + player.dx;
    if (!outOfBounds(nextPositon)) player.x = nextPositon;
  } else if (e.key === " " && gameOver) resetGame();
}

function updateBall() {
  ctx.fillStyle = "white";
  ball.x += ball.dx;
  ball.y += ball.dy;
  ctx.fillRect(ball.x, ball.y, ball.width, ball.height);
  if (ball.y <= 0) ball.dy *= -1;
  else if (ball.x <= 0 || ball.x + ball.width >= boardWidth) ball.dx *= -1;
  else if (ball.y + ballHeight >= boardHeight) {
    //gameOver
    gameOver = true;
    cancelAnimationFrame(animationId);
    ctx.fillText(" Game Over!! Press SPACEBAR to Try Again", 50, 400);
  }

  // checking collisions
  if (topCollision(ball, player) || bottomCollision(ball, player))
    ball.dy *= -1;
  else if (leftCollision(ball, player) || rightCollision(ball, player))
    ball.dx *= -1;
}

// making a generalised function of checking collison b/w ball and paddle & it will be reused in blocks and ball as well

function detectCollision(a, b) {
  // formula for detecting intersection b/w two rectangles
  return (
    a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x && //a's top right corner passes b's top left corner
    a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y
  ); //a's bottom left corner passes b's top left corner
}

function topCollision(ball, block) {
  //a is above b (ball is above block)
  return detectCollision(ball, block) && ball.y + ball.height >= block.y; // works fine even if condition is also matched for left collision it inverts the ball
}

function bottomCollision(ball, block) {
  //a is above b (ball is below block)
  return detectCollision(ball, block) && block.y + block.height >= ball.y;
}

function leftCollision(ball, block) {
  //a is left of b (ball is left of block)
  return detectCollision(ball, block) && ball.x + ball.width >= block.x;
}

function rightCollision(ball, block) {
  //a is right of b (ball is right of block)
  return detectCollision(ball, block) && block.x + block.width >= ball.x;
}

function drawBars() {
  ctx.fillStyle = "lightgreen";
  blockArray.forEach((block) => {
    if (block.break) return;
    if (topCollision(ball, block) || bottomCollision(ball, block)) {
      block.break = true;
      ball.dy *= -1;
      blockCount -= 1;
      score += 100;
    } else if (leftCollision(ball, block) || rightCollision(ball, block)) {
      ball.dx *= -1;
      block.break = true;
      blockCount -= 1;
      score += 100;
    }
    ctx.fillRect(block.x, block.y, blockwidth, blockheight);
  });
}

function createBars() {
  blockArray = []; // clearing the blockArray
  for (let i = 0; i < blockRows; i++) {
    for (let j = 0; j < blockCols; j++) {
      let block = {
        break: false,
        x: blockx + blockwidth * j + j * 10,
        y: blocky + blockheight * i + i * 10,
        height: blockheight,
        width: blockwidth,
      };
      blockArray.push(block);
      ctx.fillRect(block.x, block.y, blockwidth, blockheight);
    }
  }
  blockCount = blockArray.length;
}

function resetGame() {
  gameOver = false;
  player = {
    width: playerWidth,
    height: playerHeight,
    x: boardWidth / 2 - playerWidth / 2, // x and y kaha pe banana hai??
    y: boardHeight - playerHeight - 5,
    dx: playerdx, // for changing position
  };

  ball = {
    height: ballHeight,
    width: ballWidth,
    x: boardWidth / 2,
    y: boardHeight / 2,
    dx: balldx,
    dy: balldy,
  };

  blockArray = [];
  score = 0;
  blockRows = 3;
  createBars();
  update();
}

//my code observe the optimal difference
// draw player
// function keyup(e) {
//   if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
// }

// let flag = true; // for checking the state of the game

// //create All Objs
// // issue -> collision detection in bars and balls
// // sol -> create blocks in update -> and skip creating those blocks which will have a property break *******

// function newPos() {
//   player.x += player.dx;
//   if (player.x + player.width > board.width || player.x < 0)
//     player.x -= player.dx;
// }

// function updateBall() {
//   ball.x += ball.dx;
//   ball.y += ball.dy;
//   checkWalls();
//   checkCollision();
// }

// function checkCollision() {
//   if (
//     ball.x + ball.height > player.x &&
//     ball.x < player.x + player.width &&
//     ball.y + ball.width > player.y
//   )
//     ball.dy *= -1;
// }

// // function checkCollision(a, b) {
// //   return a.x < b.x + b.width && a.x + a.size > b.x &&
// // }

// function checkWalls() {
//   if (ball.x + ball.width > board.width || ball.x < 0) ball.dx *= -1;
//   if (ball.y < 0) ball.dy *= -1;
// }

// function clear() {}

// function over() {
//   if (ball.y + ball.height > board.height) {
//     cancelAnimationFrame(animationId);
//     flag = false;
//     ctx.fillText(
//       " Game Over!! Press SPACEBAR to Try Again",
//       board.width / 2 - 200,
//       board.height - 80
//     );
//     ball.x = board.width / 2;
//     ball.y = board.height - 30;
//     ball.dx = 2;
//     ball.dy = 3;
//   }
// }

// // Think before writing the function if it will be used at some other place.

// Takeaways to improve code Writing :
