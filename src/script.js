document.addEventListener("DOMContentLoaded", () => {

  const grid = document.getElementById("grid");
  const status = document.getElementById("status");
  const resetBtn = document.getElementById("resetBtn");
  const undoBtn = document.getElementById("undoBtn");
  const boardSizeSelect = document.getElementById("boardSizeSelect");
  const applySizeBtn = document.getElementById("applySizeBtn");
  const themeBtn = document.getElementById("themeBtn");


  let boardSize = 3;
  let board = Array(boardSize * boardSize).fill(null);
  let currentPlayer = "X";
  let selected = null;
  let gameOver = false;
  let winningCells = null;
  let history = [];

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

    if (pieces < boardSize) {
      if (board[i] === null) {
        history.push([...board]);
        board[i] = currentPlayer;
        endTurn();
      }
      return;
    }

    if (board[i] === currentPlayer) {
      selected = i;
      status.textContent = `Player ${currentPlayer}: select a destination`;
      render();
      return;
    }

    if (selected !== null && board[i] === null && getAdjacency(selected).includes(i)) {
      history.push([...board]);
      board[i] = currentPlayer;
      board[selected] = null;
      selected = null;
      endTurn();
    }
  }

  function endTurn() {
    const winningPattern = checkWin();

    if (winningPattern) {
      winningCells = winningPattern;
      status.textContent = `🎉 Player ${currentPlayer} wins!`;
      gameOver = true;
      render();
      return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    selected = null;

    const pieces = board.filter(c => c === currentPlayer).length;
    if (pieces === boardSize && !hasValidMove(currentPlayer)) {
      status.textContent = "🤝 It's a draw!";
      gameOver = true;
      render();
      return;
    }

    status.textContent =
      pieces < boardSize
        ? `Player ${currentPlayer}: place a piece`
        : `Player ${currentPlayer}: select a piece to move`;

    render();
  }

  function checkWin() {
    const wins = [];
    // Rows
    for (let r = 0; r < boardSize; r++) {
      for (let c = 0; c <= boardSize - boardSize; c++) {
        const pattern = [];
        for (let i = 0; i < boardSize; i++) {
          pattern.push(r * boardSize + c + i);
        }
        wins.push(pattern);
      }
    }
    // Columns
    for (let c = 0; c < boardSize; c++) {
      for (let r = 0; r <= boardSize - boardSize; r++) {
        const pattern = [];
        for (let i = 0; i < boardSize; i++) {
          pattern.push((r + i) * boardSize + c);
        }
        wins.push(pattern);
      }
    }
    // Main diagonals
    for (let r = 0; r <= boardSize - boardSize; r++) {
      for (let c = 0; c <= boardSize - boardSize; c++) {
        const pattern = [];
        for (let i = 0; i < boardSize; i++) {
          pattern.push((r + i) * boardSize + (c + i));
        }
        wins.push(pattern);
      }
    }
    // Anti diagonals
    for (let r = 0; r <= boardSize - boardSize; r++) {
      for (let c = boardSize - 1; c >= boardSize - boardSize - 1; c--) {
        const pattern = [];
        for (let i = 0; i < boardSize; i++) {
          pattern.push((r + i) * boardSize + (c - i));
        }
        wins.push(pattern);
      }
    }

    for (let pattern of wins) {
      if (pattern.every(i => board[i] === currentPlayer)) return pattern;
    }
    return null;
  }

  function hasValidMove(player) {
    for (let i = 0; i < board.length; i++) {
      if (board[i] === player) {
        for (let adj of getAdjacency(i)) {
          if (board[adj] === null) return true;
        }
      }
    }
    return false;
  }

  function resetGame() {
    board = Array(boardSize * boardSize).fill(null);
    currentPlayer = "X";
    selected = null;
    gameOver = false;
    winningCells = null;
    history = [];
    status.textContent = "Player X: place a piece";
    render();
  }

  function undoMove() {
    if (history.length === 0) return;
    const previous = history.pop();
    board = [...previous];
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    selected = null;
    winningCells = null;
    gameOver = false;
    status.textContent =
      board.filter(c => c === currentPlayer).length < boardSize
        ? `Player ${currentPlayer}: place a piece`
        : `Player ${currentPlayer}: select a piece to move`;
    render();
  }

  function applyBoardSize() {
    const newSize = parseInt(boardSizeSelect.value);
    if (newSize !== boardSize) {
      boardSize = newSize;
      resetGame();
    }
  }

  resetBtn.onclick = resetGame;
  undoBtn.onclick = undoMove;
  applySizeBtn.onclick = applyBoardSize;
  themeBtn.onclick = () => document.body.classList.toggle("dark-mode");

  render();
});
