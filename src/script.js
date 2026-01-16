const grid = document.getElementById("grid");
const status = document.getElementById("status");

let board = Array(9).fill(null);
let currentPlayer = "X";
let selected = null;
let gameOver = false; // 🔒 game lock flag


const adjacency = {
  0:[1,3],1:[0,2,4],2:[1,5],
  3:[0,4,6],4:[1,3,5,7],5:[2,4,8],
  6:[3,7],7:[4,6,8],8:[5,7]
};

const resetBtn = document.getElementById("resetBtn");

function render() {
  grid.innerHTML = "";

  board.forEach((cell, i) => {
    const div = document.createElement("div");
    div.className = "cell";
    div.textContent = cell || "";

    // 🔹 Add X / O classes for neon styling
    if (cell === "X") div.classList.add("X");
    if (cell === "O") div.classList.add("O");

    if (i === selected) div.classList.add("selected");

    if (
      selected !== null &&
      board[i] === null &&
      adjacency[selected].includes(i)
    ) {
      div.classList.add("valid");
    }

    div.onclick = () => handleClick(i);
    grid.appendChild(div);
  });
}


function handleClick(i) {
  if (gameOver) return; // 🚫 block input after win

  const pieces = board.filter(c => c === currentPlayer).length;

  // Placement phase
  if (pieces < 3) {
    if (board[i] === null) {
      board[i] = currentPlayer;
      endTurn();
    }
    return;
  }

  // Select own piece
  if (board[i] === currentPlayer) {
    selected = i;
    status.textContent = `Player ${currentPlayer}: select a destination`;
    render();
    return;
  }

  // Move selected piece
  if (
    selected !== null &&
    board[i] === null &&
    adjacency[selected].includes(i)
  ) {
    board[i] = currentPlayer;
    board[selected] = null;
    selected = null;
    endTurn();
  }
}

function endTurn() {
  if (checkWin()) {
    status.textContent = `🎉 Player ${currentPlayer} wins!`;
    gameOver = true;   // 🔒 lock game
    render();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  selected = null;

  const pieces = board.filter(c => c === currentPlayer).length;
  status.textContent =
    pieces < 3
      ? `Player ${currentPlayer}: place a piece`
      : `Player ${currentPlayer}: select a piece to move`;

  render();
}

function checkWin() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  return wins.some(w => w.every(i => board[i] === currentPlayer));
}

function hasValidMove(player) {
  for (let i = 0; i < board.length; i++) {
    if (board[i] === player) {
      for (let adj of adjacency[i]) {
        if (board[adj] === null) {
          return true;
        }
      }
    }
  }
  return false;
}

function resetGame() {
  board = Array(9).fill(null);
  currentPlayer = "X";
  selected = null;
  gameOver = false; // 🔓 unlock game
  status.textContent = "Player X: place a piece";
  render();
}

resetBtn.onclick = resetGame;

render();
