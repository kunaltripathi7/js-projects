"use strict";

// To do -> background look cool
const canvas = document.querySelector(".board");
const ctx = canvas.getContext("2d");

const bar = {
  height: 12,
  width: 60,
  x: 35,
  y: 70,
  rows: 3,
};

//lower bar
const hitter = {
  width: 110, // size of the object
  height: 10,
  x: canvas.width / 2 - 55, // x and y kaha pe banana hai??
  y: canvas.height - 20,
  speed: 7, // rate of changing
  dx: 0, // for changing position
};

const ball = {
  size: 8,
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 3,
  dy: 4,
};

function init() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgb(6, 205, 205)";
  ctx.fillText("100", 10, 40);
}
init();

//create All Objs
function createBars(bar) {
  let down = bar.y;
  for (let i = 0; i < bar.rows; i++) {
    let left = bar.x;
    while (left + bar.width < canvas.width) {
      ctx.fillRect(left, down, bar.width, bar.height);
      left += bar.width + 10;
    }
    down += bar.height + 10;
  }
}

function createHitter(hitter) {
  ctx.fillRect(hitter.x, hitter.y, hitter.width, hitter.height);
}

function createBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fill();
}

//event listeners
function keydown(e) {
  if (e.key === "ArrowLeft") hitter.dx = -hitter.speed;
  else if (e.key === "ArrowRight") hitter.dx = hitter.speed;
}

function keyup(e) {
  if (e.key === "ArrowLeft") hitter.dx = 0;
  else if (e.key === "ArrowRight") hitter.dx = 0;
}

document.addEventListener("keydown", keydown);
document.addEventListener("keyup", keyup);

function newPos() {
  hitter.x += hitter.dx;
  if (hitter.x + hitter.width > canvas.width || hitter.x < 0)
    hitter.x -= hitter.dx;
}

function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  checkWalls();
}

function checkWalls() {
  if (ball.x + ball.size > canvas.width || ball.x < 0) ball.dx *= -1;
  if (ball.y + ball.size > canvas.height || ball.y < 0) ball.dy *= -1;
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
  clear();
  createBars(bar);
  createHitter(hitter);
  createBall();
  updateBall();
  newPos();
  requestAnimationFrame(update);
}
update();
