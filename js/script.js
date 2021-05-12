"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var rulesBtn = document.getElementById("rules-btn");
var rules = document.getElementById("rules");
var closeBtn = document.getElementById("close-btn");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var color = {
    linen: "#fff1e6",
    magnolia: "#eae4e9",
    palePink: "#fde2e4",
    mimiPink: "#fad2e1",
    mintCream: "#e2ece9",
    powderBlue: "#bee1e6",
    periwinkleCrayola: "#cddafd",
    black: "#333",
    gray: "#555555"
};
var currentScore = 0;
//Break Part
var brickRowCount = 9;
var brickColumnCount = 5;
// Create brick Props
var brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
};
// Create Bricks
var bricks = [];
for (var i = 0; i < brickRowCount; i++) {
    bricks[i] = [];
    for (var j = 0; j < brickColumnCount; j++) {
        var x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX; //Calculation Position of X axis of the brick
        var y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY; //Calculation Position of Y axis of the brick
        bricks[i][j] = __assign({ x: x, y: y }, brickInfo);
    }
}
// Create ball props / object
var ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 12,
    speed: 4,
    dx: 4,
    dy: -4
};
// Create paddle props / object
var paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
};
//Create Ball function
var drawBall = function () {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = color.black;
    ctx.fill();
    ctx.closePath();
};
// Create Paddle Function
var drawPaddle = function () {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = color.black;
    ctx.fill();
    ctx.closePath();
};
//Draw Score
var drawScore = function () {
    ctx.font = "20px Nunito";
    ctx.fillText("Score : " + currentScore, canvas.width - 100, 30);
};
// Draw Bricks
var drawBricks = function () {
    bricks.forEach(function (column) {
        column.forEach(function (brick) {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? color.gray : "transparent";
            ctx.fill();
            ctx.closePath();
        });
    });
};
//moving the paddle
var movePaddle = function () {
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
var increaseScore = function () {
    currentScore++;
    if (currentScore % (brickColumnCount * brickRowCount) === 0) {
        showAllBricks();
    }
};
//reset game
var showAllBricks = function () {
    bricks.forEach(function (column) {
        column.forEach(function (brick) {
            brick.visible = true;
        });
    });
};
// Movie Ball
var moveBall = function () {
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
    if (ball.x - ball.size >= paddle.x &&
        ball.x + ball.size <= paddle.x + paddle.w &&
        ball.y + ball.size >= paddle.y) {
        ball.dy = -ball.speed;
        ball.speed += 0.2;
    }
    //Bricks Collision detection
    bricks.forEach(function (column) {
        column.forEach(function (brick) {
            if (brick.visible) {
                if (ball.x - ball.size > brick.x && //Left side check
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
        window.alert("lost");
    }
};
//Draw everthing
var draw = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
};
// Update canvas drawing and animation
var update = function () {
    movePaddle();
    moveBall();
    //Redraw Everthing
    draw();
    requestAnimationFrame(update);
};
update();
//Key down event
var keyDown = function (e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        paddle.dx = paddle.speed;
    }
    else if (e.key === "Left" || e.key === "ArrowLeft") {
        paddle.dx = -paddle.speed;
    }
};
//Key up event
var keyUp = function (e) {
    if (e.key === "Right" ||
        e.key === "Left" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowLeft") {
        paddle.dx = 0;
    }
};
//Keyboard Events handlers
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);
var toggleRules = function () {
    if (rules.className.includes("show")) {
        rules.classList.remove("show");
    }
    else {
        rules.classList.add("show");
    }
};
//Event listener
rulesBtn.addEventListener("click", toggleRules);
closeBtn.addEventListener("click", toggleRules);
