export {};

const rulesBtn = <HTMLButtonElement>document.getElementById("rules-btn");
const rules = <HTMLDivElement>document.getElementById("rules");
const closeBtn = <HTMLButtonElement>document.getElementById("close-btn");
const canvas = <HTMLCanvasElement>document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const color = {
  linen: "#fff1e6",
  magnolia: "#eae4e9",
  palePink: "#fde2e4",
  mimiPink: "#fad2e1",
  mintCream: "#e2ece9",
  powderBlue: "#bee1e6",
  periwinkleCrayola: "#cddafd",
  black: "#333",
  gray: "#555555",
};

let currentScore: number = 0;

//Break Part
const brickRowCount = 9;
const brickColumnCount = 5;

// Create brick Props
const brickInfo = {
  w: 70, // Width of the brick
  h: 20, // Height of the brick
  padding: 10, //Padding of the brick
  offsetX: 45, // X offset
  offsetY: 60, // Y Offset
  visible: true, // Visiblity turns off when ball hits the brick
};

// Create Bricks
const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX; //Calculation Position of X axis of the brick
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY; //Calculation Position of Y axis of the brick
    bricks[i][j] = { x, y, ...brickInfo };
  }
}
// Create ball props / object
const ball = {
  x: canvas.width / 2, //Position of X axis
  y: canvas.height / 2, // Position of Y axis
  size: 12, // Size of the Ball (Radius)
  speed: 4, // Speed by which th ball moves
  dx: 4, // Horizontal movement
  dy: -4, // Vertical movement
};

// Create paddle props / object
const paddle = {
  x: canvas.width / 2 - 40, //X-Position of the paddle
  y: canvas.height - 20, //Y-Position of the paddle
  w: 80, //Width of the paddle
  h: 10, //Height of the paddle
  speed: 8, //Speed by with the paddle moves
  dx: 0, //Horizonal movement
};

//Create Ball function
const drawBall = () => {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fillStyle = color.black;
  ctx.fill();
  ctx.closePath();
};

// Create Paddle Function
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
  ctx.fillStyle = color.black;
  ctx.fill();
  ctx.closePath();
};

//Draw Score
const drawScore = () => {
  ctx.font = "20px Nunito";
  ctx.fillText(`Score : ${currentScore}`, canvas.width - 100, 30);
};

// Draw Bricks
const drawBricks = () => {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? color.gray : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
};

//moving the paddle
const movePaddle = () => {
  paddle.x += paddle.dx;

  //Wall detection so that paddle does not go outside the canvas
  //For Right Side
  if (paddle.x + paddle.w > canvas.width) {
    paddle.x = canvas.width - paddle.w;
  }
  //For Left Side
  if (paddle.x < 0) {
    paddle.x = 0;
  }
};

//increase score
const increaseScore = () => {
  currentScore++;

  if (currentScore % (brickColumnCount * brickRowCount) === 0) {
    showAllBricks();
  }
};

//reset game
const showAllBricks = () => {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      brick.visible = true;
    });
  });
};

// Movie Ball
const moveBall = () => {
  ball.x += ball.dx;
  ball.y += ball.dy;

  //Wall Collision x axis
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  //Wall Collision y axis
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }

  //paddle Collision detection
  if (
    ball.x - ball.size >= paddle.x &&
    ball.x + ball.size <= paddle.x + paddle.w &&
    ball.y + ball.size >= paddle.y
  ) {
    ball.dy = -ball.speed;
    ball.speed += 0.2;
  }

  //Bricks Collision detection
  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x && //Left side check
          ball.x + ball.size < brick.x + brick.w && //Right side check
          ball.y + ball.size > brick.y && //Top side check
          ball.y - ball.size < brick.y + brick.h // Bottom side check
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });
  //lose
  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    currentScore = 0;
    ball.speed = 8;
    window.alert("You lose");
  }
};

//Draw everthing
const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
};

// Update canvas drawing and animation
const update = () => {
  movePaddle();
  moveBall();

  //Redraw Everthing
  draw();

  requestAnimationFrame(update);
};

update();

//Key down event
const keyDown = (e: KeyboardEvent) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
};

//Key up event
const keyUp = (e: KeyboardEvent) => {
  if (
    e.key === "Right" ||
    e.key === "Left" ||
    e.key === "ArrowRight" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
};

//Keyboard Events handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

const toggleRules = () => {
  if (rules.className.includes("show")) {
    rules.classList.remove("show");
  } else {
    rules.classList.add("show");
  }
};

//Event listener
rulesBtn.addEventListener("click", toggleRules);
closeBtn.addEventListener("click", toggleRules);
