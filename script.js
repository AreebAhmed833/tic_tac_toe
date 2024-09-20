const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const toggleThemeBtn = document.getElementById('toggle-theme');
const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');
let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

// Dynamically set canvas size to match the board
function setCanvasSize() {
  const boardRect = document.getElementById('board').getBoundingClientRect();
  canvas.width = boardRect.width;
  canvas.height = boardRect.height;
}

window.addEventListener('resize', setCanvasSize); // Update canvas size if window is resized
setCanvasSize();

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick() {
  const cellIndex = this.getAttribute('data-index');

  if (board[cellIndex] !== "" || !gameActive) {
    return;
  }

  board[cellIndex] = currentPlayer;
  this.textContent = currentPlayer;

  checkWinner();
}

function checkWinner() {
  let roundWon = false;
  let winningCombo = null;

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] === "" || board[b] === "" || board[c] === "") {
      continue;
    }
    if (board[a] === board[b] && board[b] === board[c]) {
      roundWon = true;
      winningCombo = [a, b, c];
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    drawWinningLine(winningCombo);
    gameActive = false;
  } else if (!board.includes("")) {
    statusText.textContent = `It's a tie!`;
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function drawWinningLine(winningCombo) {
  const startPos = getCellPosition(winningCombo[0]);
  const endPos = getCellPosition(winningCombo[2]);

  let progress = 0;
  const duration = 1000; // Animation duration in milliseconds

  function animateLine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(startPos.x, startPos.y);
    ctx.lineTo(
      startPos.x + progress * (endPos.x - startPos.x),
      startPos.y + progress * (endPos.y - startPos.y)
    );
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 5;
    ctx.stroke();

    progress += 0.02;
    if (progress < 1) {
      requestAnimationFrame(animateLine);
    }
  }

  animateLine();
}

function getCellPosition(index) {
  const cell = cells[index].getBoundingClientRect();
  const boardRect = document.getElementById('board').getBoundingClientRect();

  // Calculate the center of the cell relative to the canvas
  const x = cell.left - boardRect.left + cell.width / 2;
  const y = cell.top - boardRect.top + cell.height / 2;
  
  return { x, y };
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = "");
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the winning line
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  toggleThemeBtn.textContent = document.body.classList.contains('dark-mode') ? "Light Mode" : "Dark Mode";
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
toggleThemeBtn.addEventListener('click', toggleTheme);

statusText.textContent = `Player ${currentPlayer}'s turn`;
