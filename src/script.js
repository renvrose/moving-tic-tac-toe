document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("grid");
  const status = document.getElementById("status");
  const resetBtn = document.getElementById("resetBtn");
  const undoBtn = document.getElementById("undoBtn");
  const boardSizeSelect = document.getElementById("boardSizeSelect");
  const applySizeBtn = document.getElementById("applySizeBtn");
  const themeBtn = document.getElementById("themeBtn");
  const startBtn = document.getElementById("startBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");
  const newSessionBtn = document.getElementById("newSessionBtn");
  const playerXInput = document.getElementById("playerXInput");
  const playerOInput = document.getElementById("playerOInput");
  const scoreboard = document.getElementById("scoreboard");
  const setup = document.getElementById("setup");
  const game = document.getElementById("game");

  let boardSize = 3;
  let board = Array(boardSize * boardSize).fill(null);
  let currentPlayer = "X";
  let selected = null;
  let gameOver = false;
  let winningCells = null;
  let history = [];
  let maxPieces = boardSize;
  let winLength = boardSize;

  let playerXName = localStorage.getItem("playerXName") || "Player X";
  let playerOName = localStorage.getItem("playerOName") || "Player O";
  let scoreX = parseInt(localStorage.getItem("scoreX")) || 0;
  let scoreO = parseInt(localStorage.getItem("scoreO")) || 0;

  if (playerXInput) playerXInput.value = playerXName;
  if (playerOInput) playerOInput.value = playerOName;

  if (game) game.style.display = "none";
  if (playAgainBtn) playAgainBtn.style.display = "none";
  if (newSessionBtn) newSessionBtn.style.display = "none";

  function updateScoreboard() {
    if (!scoreboard) return;
    scoreboard.textContent = `${playerXName}: ${scoreX} | ${playerOName}: ${scoreO}`;
    localStorage.setItem("scoreX", scoreX);
    localStorage.setItem("scoreO", scoreO);
  }

  updateScoreboard();

  function getAdjacency(i) {
    const adj = [];
    const row = Math.floor(i / boardSize);
    const col = i % boardSize;
    if (row > 0) adj.push(i - boardSize);
    if (row < boardSize - 1) adj.push(i + boardSize);
    if (col > 0) adj.push(i - 1);
    if (col < boardSize - 1) adj.push(i + 1);
    return adj;
  }

  function render() {
    grid.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    grid.innerHTML = "";

    board.forEach((cell, i) => {
      const div = document.createElement("div");
      div.className = "cell";
      div.textContent = cell || "";

      if (cell === "X") div.classList.add("X");
      if (cell === "O") div.classList.add("O");
      if (i === selected) div.classList.add("selected");

      if (selected !== null && board[i] === null && getAdjacency(selected).includes(i)) {
        div.classList.add("valid");
      }

      if (winningCells && winningCells.includes(i)) {
        div.classList.add("win");
      }

      div.onclick = () => handleClick(i);
      grid.appendChild(div);
    });
  }

  function handleClick(i) {
    if (gameOver) return;

    const pieces = board.filter(c => c === currentPlayer).length;

    // Placement phase
    if (pieces < maxPieces) {
      if (board[i] === null) {
        history.push([...board]);
        board[i] = currentPlayer;
        endTurn();
      }
      return;
    }

    // Select piece
    if (board[i] === currentPlayer) {
      selected = i;
      status.textContent = `${currentPlayer === "X" ? playerXName : playerOName}: select a destination`;
      render();
      return;
    }

    // Move piece
    if (selected !== null && board[i] === null && getAdjacency(selected).includes(i)) {
      history.push([...board]);
      board[i] = currentPlayer;
      board[selected] = null;
      selected = null;
      endTurn();
    }
  }

  function endTurn() {
    const winPattern = checkWin();

    if (winPattern) {
      winningCells = winPattern;
      gameOver = true;

      const winnerName = currentPlayer === "X" ? playerXName : playerOName;
      status.textContent = `🎉 ${winnerName} wins!`;

      if (currentPlayer === "X") scoreX++;
      else scoreO++;

      updateScoreboard();
      render();
      showEndButtons();
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    selected = null;

    const pieces = board.filter(c => c === currentPlayer).length;

    if (pieces === maxPieces && !hasValidMove(currentPlayer)) {
      status.textContent = "🤝 It's a draw!";
      gameOver = true;
      render();
      showEndButtons();
      return;
    }

    status.textContent =
      pieces < maxPieces
        ? `${currentPlayer === "X" ? playerXName : playerOName}: place a piece`
        : `${currentPlayer === "X" ? playerXName : playerOName}: select a piece to move`;

    render();
  }

  function checkWin() {
    const patterns = [];

    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c <= boardSize - winLength; c++) {
        patterns.push([...Array(winLength)].map((_, i) => r * boardSize + c + i));
      }
    }

    for (let c = 0; c < boardSize; c++) {
      for (let r = 0; r <= boardSize - winLength; r++) {
        patterns.push([...Array(winLength)].map((_, i) => (r + i) * boardSize + c));
      }
    }

    for (let r = 0; r <= boardSize - winLength; r++) {
      for (let c = 0; c <= boardSize - winLength; c++) {
        patterns.push([...Array(winLength)].map((_, i) => (r + i) * boardSize + (c + i)));
      }
    }

    for (let r = 0; r <= boardSize - winLength; r++) {
      for (let c = winLength - 1; c < boardSize; c++) {
        patterns.push([...Array(winLength)].map((_, i) => (r + i) * boardSize + (c - i)));
      }
    }

    return patterns.find(p => p.every(i => board[i] === currentPlayer)) || null;
  }

  function hasValidMove(player) {
    return board.some((cell, i) =>
      cell === player && getAdjacency(i).some(a => board[a] === null)
    );
  }

  function resetGame() {
    board = Array(boardSize * boardSize).fill(null);
    currentPlayer = "X";
    selected = null;
    gameOver = false;
    winningCells = null;
    history = [];

    status.textContent = `${playerXName}: place a piece`;
    hideEndButtons();
    render();
  }

  function undoMove() {
    if (!history.length) return;
    board = history.pop();
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    selected = null;
    winningCells = null;
    gameOver = false;
    render();
  }

  function hideEndButtons() {
    if (playAgainBtn) playAgainBtn.style.display = "none";
    if (newSessionBtn) newSessionBtn.style.display = "none";
    if (resetBtn) resetBtn.style.display = "block";
    if (undoBtn) undoBtn.style.display = "block";
  }

  function showEndButtons() {
    if (playAgainBtn) playAgainBtn.style.display = "block";
    if (newSessionBtn) newSessionBtn.style.display = "block";
    if (resetBtn) resetBtn.style.display = "none";
    if (undoBtn) undoBtn.style.display = "none";
  }

  function applyBoardSize() {
    const newSize = parseInt(boardSizeSelect.value);
    if (newSize !== boardSize) {
      boardSize = newSize;
      maxPieces = newSize;
      winLength = newSize;
      resetGame();
    }
  }

  if (resetBtn) resetBtn.onclick = resetGame;
  if (undoBtn) undoBtn.onclick = undoMove;
  if (applySizeBtn) applySizeBtn.onclick = applyBoardSize;
  if (themeBtn) themeBtn.onclick = () => document.body.classList.toggle("dark-mode");

  if (startBtn) startBtn.onclick = () => {
    playerXName = playerXInput.value || "Player X";
    playerOName = playerOInput.value || "Player O";
    localStorage.setItem("playerXName", playerXName);
    localStorage.setItem("playerOName", playerOName);

    setup.style.display = "none";
    game.style.display = "block";
    resetGame();
  };

  if (playAgainBtn) playAgainBtn.onclick = resetGame;

  if (newSessionBtn) newSessionBtn.onclick = () => {
    scoreX = 0;
    scoreO = 0;
    updateScoreboard();
    game.style.display = "none";
    setup.style.display = "block";
  };

  render();
});
