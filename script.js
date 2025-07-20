let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // cols
  [0,4,8], [2,4,6]           // diagonals
];

const boardDiv = document.getElementById("board");
const statusText = document.getElementById("status");
const historyList = document.getElementById("historyList");

function createBoard() {
  boardDiv.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("button");
    cell.classList.add("cell");
    cell.setAttribute("data-index", i);
    cell.addEventListener("click", handleMove);
    boardDiv.appendChild(cell);
  }
}

function handleMove(e) {
  const index = e.target.getAttribute("data-index");
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner()) {
    statusText.textContent = `Player ${currentPlayer} wins!`;
    saveWinner(currentPlayer);
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "It's a draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  return winningCombos.some(combo => {
    const [a, b, c] = combo;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's turn";
  createBoard();
}

function saveWinner(winner) {
  let winners = JSON.parse(localStorage.getItem("winners")) || [];
  winners.push(`Player ${winner}`);
  localStorage.setItem("winners", JSON.stringify(winners));
  updateHistory();
}

function updateHistory() {
  let winners = JSON.parse(localStorage.getItem("winners")) || [];
  historyList.innerHTML = "";
  winners.slice(-5).reverse().forEach(w => {
    const li = document.createElement("li");
    li.textContent = w;
    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("winners");
  updateHistory();
}

createBoard();
updateHistory();
