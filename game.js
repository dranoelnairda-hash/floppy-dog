const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = 360;
canvas.height = 640;

// DOG
let dog = {
  x: 60,
  y: 300,
  size: 32,
  velocity: 0,
  gravity: 0.5,
  jump: -8
};

// GAME
let pipes = [];
let frame = 0;
let score = 0;
let gameRunning = false;

// IMAGES (simple shapes for now)
function drawDog() {
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(dog.x, dog.y, dog.size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function addPipe() {
  let gap = 140;
  let topHeight = Math.random() * 250 + 50;

  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 50
  });
}

function drawPipes() {
  ctx.fillStyle = "#3cb371";
  pipes.forEach(p => {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, p.bottom, p.width, canvas.height - p.bottom);
  });
}

function update() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // DOG PHYSICS
  dog.velocity += dog.gravity;
  dog.y += dog.velocity;

  // PIPES
  if (frame % 120 === 0) addPipe();
  pipes.forEach(p => p.x -= 2);

  // COLLISION
  pipes.forEach(p => {
    if (
      dog.x + dog.size / 2 > p.x &&
      dog.x - dog.size / 2 < p.x + p.width &&
      (dog.y - dog.size / 2 < p.top ||
        dog.y + dog.size / 2 > p.bottom)
    ) {
      gameRunning = false;
      alert("Game Over! 🦴 Score: " + score);
      location.reload();
    }
  });

  // FLOOR
  if (dog.y + dog.size / 2 > canvas.height) {
    gameRunning = false;
    alert("Game Over! 🦴 Score: " + score);
    location.reload();
  }

  // SCORE
  pipes.forEach(p => {
    if (p.x + p.width === dog.x) score++;
  });

  drawPipes();
  drawDog();

  ctx.fillStyle = "#fff";
  ctx.font = "24px Arial";
  ctx.fillText("🦴 " + score, 20, 40);

  frame++;
  requestAnimationFrame(update);
}

// CONTROLS
document.addEventListener("click", () => {
  if (!gameRunning) {
    gameRunning = true;
    update();
  }
  dog.velocity = dog.jump;
});
