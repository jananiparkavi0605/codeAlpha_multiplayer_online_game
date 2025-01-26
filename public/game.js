const socket = io(); // Connect to the server

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.7; // 70% of the window height

// Player setup
const player = { x: canvas.width / 2 - 50, y: canvas.height - 30, width: 100, height: 20, color: 'lime' };
const otherPlayers = {}; // Store other players

// Falling objects
const objects = [];
const objectRadius = 10;

// Movement
let dx = 0;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') dx = -10;
  if (e.key === 'ArrowRight') dx = 10;
  socket.emit('playerMove', { x: player.x + dx });
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') dx = 0;
});

function drawPlayer(player) {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObjects() {
  objects.forEach((object) => {
    ctx.beginPath();
    ctx.arc(object.x, object.y, object.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  });
}

function updateObjects() {
  objects.forEach((object) => object.y += 4);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update player
  player.x += dx;

  // Prevent going out of bounds
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

  // Draw players and objects
  drawPlayer(player);
  for (const id in otherPlayers) drawPlayer(otherPlayers[id]);
  drawObjects();

  updateObjects();

  requestAnimationFrame(gameLoop);
}

// Socket event listeners
socket.on('playerMove', (data) => {
  if (!otherPlayers[data.id]) otherPlayers[data.id] = { x: 0, y: player.y, width: 100, height: 20, color: 'blue' };
  otherPlayers[data.id].x = data.x;
});

socket.on('spawnObject', (data) => {
  objects.push(data);
});

// Spawn new objects at intervals
setInterval(() => {
  const object = { x: Math.random() * (canvas.width - objectRadius * 2), y: 0, radius: objectRadius };
  objects.push(object);
  socket.emit('spawnObject', object); // Broadcast to all players
}, 1000);

gameLoop();
