import { createElement } from '../../utils.js'

var canvas = null,
  ctx = null,
  // limitX = window.innerWidth - 200,
  // limitY = window.innerHeight - 100,
  limitX = 500,
  limitY = 500,
  intervalId = null,
  TIMEOUT = 50,
  gameOver = true,
  //snake properties
  snake = [],
  initialSnakeLength = 5,
  size = 15,
  direction = "right",
  //food properties
  food = [[0, 0]];
  var score = initialSnakeLength,
  highScore = 0;

export function loadTheme() {
  const snakeContainer = createElement("snakeContainer", "", "#seshParent")
  snakeContainer.style.width = limitX
  snakeContainer.style.height = limitY
  document.querySelector("#seshParent").classList.add(`theme-snake`)
  canvas = createElement("canvas", "canvas", "#snakeContainer", "canvas")
  ctx = canvas.getContext("2d");
  createElement('gameOver', 'gameOver' ,'#snakeContainer')
  init()
}

function init() {
  console.log(`init snake`, limitX, limitY);
  createElement("score", "score", "#snakeContainer")
  canvas.width = limitX
  canvas.height = limitY
  canvas.focus()
  initGame();
  addEventListeners();
  const hs = localStorage.getItem('highScore')
  if(hs) highScore = hs
  updateScore()
}


function addEventListeners() {
  document.addEventListener("keydown", eventListener);
}

function eventListener(e) {
  function captureEvent(e) {
    e.preventDefault();
    e.stopPropagation();
  }
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
}

function initGame() {
  updateGameOver()
  gameOver = false
  clear();
  makeInitialSnake();
  makeFood();
  drawItems();
  //start();
}

function updateGameOver() {
  const goContainer = document.querySelector('#gameOver')
  if(goContainer) {
    if(gameOver)
      document.querySelector('#gameOver').innerHTML = 'Press Space to start.'
    else document.querySelector('#gameOver').innerHTML = ''
  }
}

function makeInitialSnake() {
  const newSnake = [];
  for (let i = 0; i < initialSnakeLength - 1; i++) {
    newSnake.unshift([i * size, 0]);
  }
  snake = JSON.parse(JSON.stringify(newSnake));
  // console.log(`intial snake`, JSON.stringify(snake));
}

function start() {
  gameOver = false
  updateGameOver()
  intervalId = setInterval(refresh, TIMEOUT);
  // refreshState()
}

function reset() {
  pause();
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
}

function gameover() {
  gameOver = true
  updateGameOver()
  score = 0
  updateScore()
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
    score++;
    if(score>highScore) highScore = score
    localStorage.setItem('highScore', highScore)
    updateScore()
    makeFood();
    appendTailToSnake();
  } else {
  }
}

function updateScore() {
  const sc = document.querySelector('#score')
  if(sc) sc.innerText = `Score: ${score}     High Score: ${highScore}`;
}

function appendTailToSnake() {
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
  //printSnake();
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
  gameover()
  document.removeEventListener("keydown", eventListener);
  let container = document.getElementById("snakeContainer")
  if (container) container.remove()
}


