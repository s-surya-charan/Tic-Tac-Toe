const board = document.getElementById("board");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const modeBtn = document.getElementById("mode");
const themeBtn = document.getElementById("theme");

const scoreXEl = document.getElementById("scoreX");
const scoreOEl = document.getElementById("scoreO");
const scoreDrawEl = document.getElementById("scoreDraw");

let currentPlayer = "X";
let gameActive = true;
let vsAI = false;
let boardState = ["", "", "", "", "", "", "", "", ""];
let scores = { X: 0, O: 0, Draw: 0 };

// Initialize board
function createBoard() {
  board.innerHTML = "";
  boardState = ["", "", "", "", "", "", "", "", ""];
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
  message.textContent = `Player ${currentPlayer}'s turn`;
}
createBoard();

// Handle move
function handleCellClick(e) {
  const index = e.target.dataset.index;
  if (boardState[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);
  if (vsAI && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

// Make a move
function makeMove(index, player) {
  boardState[index] = player;
  document.querySelector(`[data-index='${index}']`).textContent = player;
  document.querySelector(`[data-index='${index}']`).classList.add("taken");

  if (checkWin(player)) {
    message.textContent = `🎉 Player ${player} Wins!`;
    gameActive = false;
    scores[player]++;
    updateScores();
    return;
  }

  if (!boardState.includes("")) {
    message.textContent = "😐 It's a Draw!";
    gameActive = false;
    scores.Draw++;
    updateScores();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  message.textContent = `Player ${currentPlayer}'s turn`;
}

// AI move (random for now)
function aiMove() {
  let emptyIndices = boardState.map((val, idx) => (val === "" ? idx : null)).filter(v => v !== null);
  if (emptyIndices.length === 0) return;
  let choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  makeMove(choice, "O");
}

// Check win
function checkWin(player) {
  const winPatterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return winPatterns.some(pattern => pattern.every(idx => boardState[idx] === player));
}

// Update scores
function updateScores() {
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.Draw;
}

// Restart game
restartBtn.addEventListener("click", () => {
  gameActive = true;
  currentPlayer = "X";
  createBoard();
});

// Toggle mode
modeBtn.addEventListener("click", () => {
  vsAI = !vsAI;
  modeBtn.textContent = vsAI ? "👥 2 Player" : "🤖 vs Player";
  restartBtn.click();
});

// Toggle theme
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
