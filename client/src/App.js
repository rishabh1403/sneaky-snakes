import React, { Component } from 'react';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');
socket.emit("data", "hey");
socket.on("data", (data) => console.log("data"));

class Snake {
  init(direction, x, y) {
    this.direction = direction;
    this._queue = [];
    this.insert(x, y);
  }
  insert(x, y) {
    this._queue.unshift({ x: x, y: y });
    this.last = this._queue[0];
  }
  remove() {
    return this._queue.pop();
  }
}

class Grid {

  init(id, c, r) {
    this.width = c;
    this.height = r;
    this._grid = [];

    for (var x = 0; x < c; x++) {
      this._grid.push([]);
      for (var y = 0; y < r; y++) {
        this._grid[x].push(id);
      }
    }
  }

  set(val, x, y) {
    this._grid[x][y] = val;
  }
  get(x, y) {
    return this._grid[x][y];
  }
}
let grid = new Grid();
let snake = new Snake();
// dimensions
const ROWS = 26, COLS = 26;

// Ids for grid
const EMPTY = 0, SNAKE = 1, FOOD = 2;

//Ids for direction
const LEFT = 0, UP = 1, RIGHT = 2, DOWN = 3;

// keycodes
const KEY_LEFT = 37, KEY_UP = 38, KEY_RIGHT = 39, KEY_DOWN = 40;

let canvas, ctx, keystate, frames, score;

function setFood() {
  var empty = [];

  for (var x = 0; x < grid.width; x++) {
    for (var y = 0; y < grid.height; y++) {
      if (grid.get(x, y) === EMPTY) {
        empty.push({ x: x, y: y })
      }
    }
  }

  var randpos = empty[Math.floor(Math.random() * empty.length)];
  grid.set(FOOD, randpos.x, randpos.y);
}



function init() {
  score = 0;
  grid.init(EMPTY, COLS, ROWS);

  var sp = { x: Math.floor(COLS / 2), y: ROWS - 1 }
  snake.init(UP, sp.x, sp.y);
  grid.set(SNAKE, sp.x, sp.y);

  setFood();
}
function loop() {
  update();
  draw();

  window.requestAnimationFrame(loop, canvas);
}
function update() {
  frames++;

  if (keystate[KEY_LEFT] && snake.direction !== RIGHT) snake.direction = LEFT;
  if (keystate[KEY_UP] && snake.direction !== DOWN) snake.direction = UP;
  if (keystate[KEY_RIGHT] && snake.direction !== LEFT) snake.direction = RIGHT;
  if (keystate[KEY_DOWN] && snake.direction !== UP) snake.direction = DOWN;

  if (frames % 10 === 0) {
    var nx = snake.last.x;
    var ny = snake.last.y;

    switch (snake.direction) {
      case LEFT:
        nx--
        break;
      case UP:
        ny--;
        break;
      case RIGHT:
        nx++;
        break;
      case DOWN:
        ny++;
        break;
    }

    if (0 > nx || nx > grid.width - 1 ||
      0 > ny || ny > grid.height - 1 ||
      grid.get(nx, ny) === SNAKE
    ) {
      return init();
    }
    let tail = null;
    if (grid.get(nx, ny) === FOOD) {
      score++;
      tail = { x: nx, y: ny }
      setFood();
    } else {
      tail = snake.remove();
      grid.set(EMPTY, tail.x, tail.y);
      tail.x = nx;
      tail.y = ny;
    }


    grid.set(SNAKE, tail.x, tail.y);

    snake.insert(tail.x, tail.y);
  }

}
function draw() {
  var tw = canvas.width / grid.width;
  var th = canvas.height / grid.height;

  for (var x = 0; x < grid.width; x++) {
    for (var y = 0; y < grid.height; y++) {
      switch (grid.get(x, y)) {
        case EMPTY:
          ctx.fillStyle = "#fff";
          break;
        case SNAKE:
          ctx.fillStyle = "#0ff";
          break;
        case FOOD:
          ctx.fillStyle = "#f00";
          break;
      }
      ctx.fillRect(x * tw, y * th, tw, th);
    }
  }
  ctx.fillStyle = "#000";
  ctx.fillText("score : " + score, 10, canvas.height - 10);
}

class App extends Component {



  componentWillMount() {
    canvas = document.createElement("canvas");
    canvas.width = ROWS * 20;
    canvas.height = COLS * 20;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);

    frames = 0;
    keystate = {};

    document.addEventListener("keydown", function (evt) {
      keystate[evt.keyCode] = true
    })

    document.addEventListener("keyup", function (evt) {
      delete keystate[evt.keyCode];
    })
    init();
    loop();
  }
  render() {
    return (
      <div className="fix">
      </div>
    );
  }
}

export default App;