const gameCanvas = document.getElementById("gameCanvas");
const context = gameCanvas.getContext("2d");

// Set canvas size
gameCanvas.width = 880;
gameCanvas.height = 620;

// Paddle settings
const paddleHeight = 20;
const paddleWidth = 95;
let paddlePositionX = (gameCanvas.width - paddleWidth) / 2;

// Ball settings
const ballRadius = 20;
let ballX = gameCanvas.width / 2;
let ballY = gameCanvas.height - 30;
let ballSpeedX = 1;
let ballSpeedY = -2;

// Brick settings
const totalBrickRows = 5;
const totalBrickColumns = 5;
const brickWidth = 105;
const brickHeight = 20;
const brickSpacing = 20;
const brickTopOffset = 50;
const brickLeftOffset = 120;

// Create the brick grid
let brickGrid = [];
for (let column = 0; column < totalBrickColumns; column++) {
  brickGrid[column] = [];
  for (let row = 0; row < totalBrickRows; row++) {
    brickGrid[column][row] = { x: 0, y: 0, isActive: true };
  }
}

// Game variables
let playerScore = 0;
let playerLives = 5;

// Time-based color change
let time = 0;

// Keyboard controls
let moveRight = false;
let moveLeft = false;
document.addEventListener("keydown", (event) => {
  if (event.key === "Right" || event.key === "ArrowRight") moveRight = true;
  if (event.key === "Left" || event.key === "ArrowLeft") moveLeft = true;
});
document.addEventListener("keyup", (event) => {
  if (event.key === "Right" || event.key === "ArrowRight") moveRight = false;
  if (event.key === "Left" || event.key === "ArrowLeft") moveLeft = false;
});

// Get dynamic color values based on time
function getDynamicColor() {
    // Adjust time to create a smooth gradient effect
    const r = Math.floor(127 + 127 * Math.sin(time / 1000)); // Ranges between 0 and 255
    const g = Math.floor(127 + 127 * Math.sin((time / 1000) + 2)); // Offsetting to create the rainbow effect
    const b = Math.floor(127 + 127 * Math.sin((time / 1000) + 4)); // Offsetting to create the rainbow effect
    return `rgb(${r}, ${g}, ${b})`;
  }
// Update the dynamic box-shadow for the gameCanvas
function updateCanvasShadow() {
  const shadowColor = getDynamicColor(); // Get the dynamic color
  gameCanvas.style.boxShadow = `0 0 10px ${shadowColor}, 0 0 20px ${shadowColor}, 0 0 30px ${shadowColor}`;
}

// Draw the ball
function renderBall() {
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  context.fillStyle = getDynamicColor(); // Ball color changes dynamically
  context.fill();
  context.closePath();
}

// Draw the paddle
function renderPaddle() {
  context.beginPath();
  context.rect(paddlePositionX, gameCanvas.height - paddleHeight, paddleWidth, paddleHeight);
  context.fillStyle = getDynamicColor(); // Paddle color changes dynamically
  context.fill();
  context.closePath();
}

// Draw the bricks
function renderBricks() {
  for (let column = 0; column < totalBrickColumns; column++) {
    for (let row = 0; row < totalBrickRows; row++) {
      const brick = brickGrid[column][row];
      if (brick.isActive) {
        const brickX = column * (brickWidth + brickSpacing) + brickLeftOffset;
        const brickY = row * (brickHeight + brickSpacing) + brickTopOffset;
        brick.x = brickX;
        brick.y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        context.fillStyle = getDynamicColor(); // Brick color changes dynamically
        context.fill();
        context.closePath();
      }
    }
  }
}

// Collision detection
function handleCollisions() {
  for (let column = 0; column < totalBrickColumns; column++) {
    for (let row = 0; row < totalBrickRows; row++) {
      const brick = brickGrid[column][row];
      if (brick.isActive) {
        if (
          ballX > brick.x &&
          ballX < brick.x + brickWidth &&
          ballY > brick.y &&
          ballY < brick.y + brickHeight
        ) {
          ballSpeedY = -ballSpeedY;
          brick.isActive = false;
          playerScore++;
          if (playerScore === totalBrickRows * totalBrickColumns) {
            alert("Victory! You won the game!");
            document.location.reload();
          }
        }
      }
    }
  }
}

// Draw the score
function renderScore() {
  context.font = "16px Arial";
  context.fillStyle = "#ffffff";
  context.fillText("Score: " + playerScore, 8, 20);
}

// Draw the lives
function renderLives() {
  context.font = "16px Arial";
  context.fillStyle = "#ffffff";
  context.fillText("Lives: " + playerLives, gameCanvas.width - 65, 20);
}

// Draw dynamic background gradient
function renderBackground() {
  const gradient = context.createLinearGradient(0, 0, gameCanvas.width, gameCanvas.height);
  gradient.addColorStop(0, "black"); // Gradient color changes dynamically
  gradient.addColorStop(1, "black"); // Gradient color changes dynamically
  context.fillStyle = gradient;
  context.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
}

// Render the game
function renderGame() {
  time += 1; // Increase time for color changes
  updateCanvasShadow(); // Update the canvas shadow dynamically
  renderBackground(); // Draw the dynamic background
  renderBricks();
  renderBall();
  renderPaddle();
  renderScore();
  renderLives();
  handleCollisions();

  if (ballX + ballSpeedX > gameCanvas.width - ballRadius || ballX + ballSpeedX < ballRadius) ballSpeedX = -ballSpeedX;
  if (ballY + ballSpeedY < ballRadius) ballSpeedY = -ballSpeedY;
  else if (ballY + ballSpeedY > gameCanvas.height - ballRadius) {
    if (ballX > paddlePositionX && ballX < paddlePositionX + paddleWidth) {
      ballSpeedY = -ballSpeedY;
    } else {
      playerLives--;
      if (!playerLives) {
        alert("Game Over!");
        document.location.reload();
      } else {
        ballX = gameCanvas.width / 2;
        ballY = gameCanvas.height - 30;
        ballSpeedX = 2;
        ballSpeedY = -2;
        paddlePositionX = (gameCanvas.width - paddleWidth) / 2;
      }
    }
  }

  if (moveRight && paddlePositionX < gameCanvas.width - paddleWidth) paddlePositionX += 7;
  else if (moveLeft && paddlePositionX > 0) paddlePositionX -= 7;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  requestAnimationFrame(renderGame);
}

renderGame();
