import { createElement } from '../../utils.js'

var canvas = null,
  ctx = null,
  limitX = window.innerWidth - 100,
  limitY = window.innerHeight - 50,
  intervalId = null,
  TIMEOUT = 50,
  score = 0,
  gameOver = false,
  //snake properties
  snake = [],
  initialSnakeLength = 2,
  size = 20,
  direction = "right",
  //food properties
  food = [[0, 0]];

export function loadTheme() {
  createElement("snakeContainer", "", "#seshParent")
  document.querySelector("#seshParent").className = `theme-snake`
  canvas = createElement("canvas", "canvas", "#snakeContainer", "canvas")
  ctx = canvas.getContext("2d");
  init()
}

function init() {
  console.log(`init`, limitX, window.innerWidth, limitY, window.innerHeight);
  createElement("score", "score", "#snakeContainer")
  canvas.width = limitX
  canvas.height = limitY
  canvas.focus()
  initGame();
  addEventListeners();
}


function addEventListeners() {
  // document.querySelector("#start").addEventListener("click", function (e) {
  //   start();
  // });
  // document.querySelector("#pause").addEventListener("click", function (e) {
  //   pause();
  // });
  // document.querySelector("#reset").addEventListener("click", function (e) {
  //   reset();
  //   document.querySelector("#reset").blur();
  // });
  function captureEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  document.addEventListener("keydown", function (e) {
    switch (e.key) {
      case " ":
        captureEvent(e)
        if (intervalId) pause();
        else if (gameOver) {
          reset()
          start()
        }
        else start();
        break;
      case "ArrowLeft":
        captureEvent(e)
        if (direction !== "left" && direction !== "right") direction = "left";
        break;
      case "ArrowRight":
        captureEvent(e)
        if (direction !== "left" && direction !== "right") direction = "right";
        break;
      case "ArrowUp":
        captureEvent(e)
        if (direction !== "up" && direction !== "down") direction = "up";
        break;
      case "ArrowDown":
        captureEvent(e)
        if (direction !== "up" && direction !== "down") direction = "down";
        break;
      default:
        break;
    }
  });
}

function initGame() {
  gameOver = false
  clear();
  makeInitialSnake();
  makeFood();
  drawItems();
  //start();
}

function makeInitialSnake() {
  const newSnake = [];
  for (let i = 0; i < initialSnakeLength - 1; i++) {
    newSnake.unshift([i * size, 0]);
  }
  snake = JSON.parse(JSON.stringify(newSnake));
  console.log(`intial snake`, JSON.stringify(snake));
}

function start() {
  intervalId = setInterval(refresh, TIMEOUT);
  // refreshState()
}

function reset() {
  pause();
  //change this
  clear();
  makeInitialSnake();
  makeFood();
  direction = "right";
  score = 0;
  drawItems();
}

function pause() {
  clearInterval(intervalId);
  intervalId = null;
  console.log(`paused`, snake[0], food);
  // checkFoodEaten();
}

function gameover() {
  pause();
}

function refresh() {
  refreshState();
  drawItems();
}

function drawItems() {
  clear();
  drawSnake();
  drawFood();
}

function checkGameOver() {
  // if snek eats itself
  for (let i = 1; i < snake.length; i++) {
    const cell = snake[i];
    if (checkIntersection(snake[0], cell)) {
      gameover();
    }
  }
  // if border is hit
  if (
    snake[0][0] < 0 ||
    snake[0][0] > limitX - size ||
    snake[0][1] < 0 ||
    snake[0][1] > limitY - size
  ) {
    console.log(`game over`);
    gameover();
  }
}

function checkIntersection(r1, r2) {
  if (
    !(
      r1[0] >= r2[0] + size ||
      r1[0] + size <= r2[0] ||
      r1[1] >= r2[1] + size ||
      r1[1] + size <= r2[1]
    )
  )
    return true;
}

function checkFoodEaten() {
  if (checkIntersection(snake[0], food)) {
    console.log(`eaten`);
    score++;
    document.querySelector("#score").innerText = score;
    makeFood();
    appendTailToSnake();
  } else {
    console.log(`not eaten`);
  }
}

function appendTailToSnake() {
  console.log(`appending`);
  const tail = JSON.parse(JSON.stringify(snake[snake.length - 1]));
  switch (direction) {
    case "right": {
      snake[snake.length] = [tail[0] - size, tail[1]];
      break;
    }
    case "left": {
      snake[snake.length] = [tail[0] + size, tail[1]];
      break;
    }
    case "top": {
      snake[snake.length] = [tail[0], tail[1] - size];
      break;
    }
    case "bottom": {
      snake[snake.length] = [tail[0], tail[1] + size];
      break;
    }
    default:
      break;
  }
  printSnake();
}

function printSnake() {
  console.log(`snake---`, JSON.stringify(snake));
}

function refreshState() {
  let buffer = [snake[0][0], snake[0][1]];
  //check game over
  checkGameOver();
  //check if snek ate food
  checkFoodEaten();
  for (let i = 1; i < snake.length; i++) {
    const temp = [snake[i][0], snake[i][1]];
    snake[i][0] = buffer[0];
    snake[i][1] = buffer[1];
    buffer = [temp[0], temp[1]];
  }
  switch (direction) {
    case "right": {
      snake[0][0] += size;
      break;
    }
    case "down": {
      snake[0][1] += size;
      break;
    }
    case "left": {
      snake[0][0] -= size;
      break;
    }
    case "up": {
      snake[0][1] -= size;
      break;
    }
    default:
      break;
  }
  // console.log(`after refresh`, JSON.stringify(snake));
}

function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  // console.log(JSON.stringify(snake));
  ctx.fillStyle = "#35fbff";
  for (let cell of snake) {
    ctx.fillRect(cell[0], cell[1], size, size);
  }
}

function makeFood() {
  const randX = Math.floor(Math.random() * (limitX - size)),
    randY = Math.floor(Math.random() * (limitY - size));
  // console.log(randX, randY);
  food = [randX, randY];
}
function drawFood() {
  ctx.fillStyle = "#ffc735";
  ctx.fillRect(food[0], food[1], size, size);
}



export function cleanup() {
  let container = document.getElementById("snakeContainer")
  if (container) container.remove()
}


