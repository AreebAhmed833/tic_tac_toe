const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const toggleThemeBtn = document.getElementById('toggle-theme');
let currentPlayer = "X";
let gameActive = true;
let board = ["", "", "", "", "", "", "", "", ""];

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

  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];
    if (board[a] === "" || board[b] === "" || board[c] === "") {
      continue;
    }
    if (board[a] === board[b] && board[b] === board[c]) {
      roundWon = true;
      break;
    }
  }

  if (roundWon) {
    statusText.textContent = `${currentPlayer} wins!`;
    gameActive = false;
  } else if (!board.includes("")) {
    statusText.textContent = `It's a tie!`;
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
  cells.forEach(cell => cell.textContent = "");
}

function toggleTheme() {
  document.body.classList.toggle('dark-mode');
  toggleThemeBtn.textContent = document.body.classList.contains('dark-mode') ? "Light Mode" : "Dark Mode";
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
toggleThemeBtn.addEventListener('click', toggleTheme);

statusText.textContent = `Player ${currentPlayer}'s turn`;
