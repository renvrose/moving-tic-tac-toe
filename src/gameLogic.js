/**
 * Core game logic functions for tic-tac-toe
 * These functions are exported for testing
 */

/**
 * Get all adjacent cells for a given position
 * @param {number} i - Cell index
 * @param {number} boardSize - Size of the board
 * @returns {number[]} Array of adjacent cell indices
 */
function getAdjacency(i, boardSize) {
  const adj = [];
  const row = Math.floor(i / boardSize);
  const col = i % boardSize;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue;
      const r = row + dr;
      const c = col + dc;
      if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
        adj.push(r * boardSize + c);
      }
    }
  }
  return adj;
}

/**
 * Check if current player has won
 * @param {(string|null)[]} board - Board state
 * @param {string} currentPlayer - Current player ('X' or 'O')
 * @param {number} boardSize - Size of the board
 * @param {number} winLength - Number of pieces needed to win
 * @returns {number[]|null} Winning cell indices or null
 */
function checkWin(board, currentPlayer, boardSize, winLength) {
  const patterns = [];

  // Horizontal patterns
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c <= boardSize - winLength; c++) {
      patterns.push([...Array(winLength)].map((_, i) => r * boardSize + c + i));
    }
  }

  // Vertical patterns
  for (let c = 0; c < boardSize; c++) {
    for (let r = 0; r <= boardSize - winLength; r++) {
      patterns.push([...Array(winLength)].map((_, i) => (r + i) * boardSize + c));
    }
  }

  // Diagonal patterns (top-left to bottom-right)
  for (let r = 0; r <= boardSize - winLength; r++) {
    for (let c = 0; c <= boardSize - winLength; c++) {
      patterns.push([...Array(winLength)].map((_, i) => (r + i) * boardSize + (c + i)));
    }
  }

  // Diagonal patterns (top-right to bottom-left)
  for (let r = 0; r <= boardSize - winLength; r++) {
    for (let c = winLength - 1; c < boardSize; c++) {
      patterns.push([...Array(winLength)].map((_, i) => (r + i) * boardSize + (c - i)));
    }
  }

  return patterns.find(p => p.every(i => board[i] === currentPlayer)) || null;
}

/**
 * Check if a player has any valid moves available
 * @param {(string|null)[]} board - Board state
 * @param {string} player - Player to check ('X' or 'O')
 * @param {number} boardSize - Size of the board
 * @returns {boolean} True if player has valid moves
 */
function hasValidMove(board, player, boardSize) {
  return board.some((cell, i) =>
    cell === player && getAdjacency(i, boardSize).some(a => board[a] === null)
  );
}

/**
 * Count pieces of a specific player on the board
 * @param {(string|null)[]} board - Board state
 * @param {string} player - Player to count ('X' or 'O')
 * @returns {number} Number of pieces
 */
function countPieces(board, player) {
  return board.filter(cell => cell === player).length;
}

/**
 * Check if a move is valid (empty cell for placement or adjacent for movement)
 * @param {number} targetIndex - Target cell index
 * @param {number} selectedIndex - Currently selected cell index
 * @param {(string|null)[]} board - Board state
 * @param {number} boardSize - Size of the board
 * @param {number} maxPieces - Maximum pieces per player
 * @param {string} currentPlayer - Current player
 * @returns {boolean} True if move is valid
 */
function isValidMove(targetIndex, selectedIndex, board, boardSize, maxPieces, currentPlayer) {
  const pieces = countPieces(board, currentPlayer);

  // Phase 1: Placement
  if (pieces < maxPieces) {
    return board[targetIndex] === null;
  }

  // Phase 2: Movement
  if (selectedIndex !== null && board[targetIndex] === null) {
    return getAdjacency(selectedIndex, boardSize).includes(targetIndex);
  }

  return false;
}

// Export for Node.js/Jest
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAdjacency,
    checkWin,
    hasValidMove,
    countPieces,
    isValidMove
  };
}
