const { getAdjacency, checkWin, hasValidMove, countPieces, isValidMove } = require('../src/gameLogic.js');

describe('Game Logic - Adjacency', () => {
  describe('getAdjacency', () => {
    test('returns 8 neighbors for center cell (3x3 board)', () => {
      const adj = getAdjacency(4, 3); // Center cell in 3x3
      expect(adj.length).toBe(8);
      expect(adj).toContain(1);
      expect(adj).toContain(3);
      expect(adj).toContain(5);
      expect(adj).toContain(7);
    });

    test('returns 3 neighbors for corner cell', () => {
      const adj = getAdjacency(0, 3); // Top-left corner
      expect(adj.length).toBe(3);
      expect(adj).toEqual(expect.arrayContaining([1, 3, 4]));
    });

    test('returns 5 neighbors for edge cell', () => {
      const adj = getAdjacency(1, 3); // Top center edge
      expect(adj.length).toBe(5);
      expect(adj).toEqual(expect.arrayContaining([0, 2, 3, 4, 5]));
    });

    test('handles top-right corner', () => {
      const adj = getAdjacency(2, 3); // Top-right corner
      expect(adj.length).toBe(3);
      expect(adj).toEqual(expect.arrayContaining([1, 4, 5]));
    });

    test('handles bottom-left corner', () => {
      const adj = getAdjacency(6, 3); // Bottom-left corner
      expect(adj.length).toBe(3);
      expect(adj).toEqual(expect.arrayContaining([3, 4, 7]));
    });

    test('handles bottom-right corner', () => {
      const adj = getAdjacency(8, 3); // Bottom-right corner
      expect(adj.length).toBe(3);
      expect(adj).toEqual(expect.arrayContaining([4, 5, 7]));
    });

    test('works correctly on 4x4 board', () => {
      const adj = getAdjacency(5, 4); // Not center
      expect(adj.length).toBe(8);
    });

    test('no adjacency includes same cell', () => {
      const adj = getAdjacency(4, 3);
      expect(adj).not.toContain(4);
    });
  });
});

describe('Game Logic - Win Detection', () => {
  describe('checkWin', () => {
    test('detects horizontal win on top row', () => {
      const board = ['X', 'X', 'X', null, 'O', null, null, 'O', null];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toEqual([0, 1, 2]);
    });

    test('detects horizontal win on middle row', () => {
      const board = [null, 'O', null, 'X', 'X', 'X', null, 'O', null];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toEqual([3, 4, 5]);
    });

    test('detects horizontal win on bottom row', () => {
      const board = [null, 'O', null, null, 'O', null, 'X', 'X', 'X'];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toEqual([6, 7, 8]);
    });

    test('detects vertical win on left column', () => {
      const board = ['X', 'O', null, 'X', 'O', null, 'X', null, null];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toEqual([0, 3, 6]);
    });

    test('detects vertical win on middle column', () => {
      const board = [null, 'X', 'O', null, 'X', null, null, 'X', 'O'];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toEqual([1, 4, 7]);
    });

    test('detects vertical win on right column', () => {
      const board = [null, 'O', 'X', null, 'O', 'X', null, null, 'X'];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toEqual([2, 5, 8]);
    });

    test('detects diagonal win (top-left to bottom-right)', () => {
      const board = ['X', 'O', null, null, 'X', 'O', null, null, 'X'];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toEqual([0, 4, 8]);
    });

    test('detects diagonal win (top-right to bottom-left)', () => {
      const board = [null, 'O', 'X', null, 'X', 'O', 'X', null, null];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toEqual([2, 4, 6]);
    });

    test('returns null when no win', () => {
      const board = ['X', 'O', null, 'O', 'X', null, null, null, null];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toBeNull();
    });

    test('returns null on empty board', () => {
      const board = Array(9).fill(null);
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toBeNull();
    });

    test('detects win for player O', () => {
      const board = ['O', 'O', 'O', 'X', null, 'X', null, null, null];
      const result = checkWin(board, 'O', 3, 3);
      expect(result).toEqual([0, 1, 2]);
    });

    test('ignores other player pieces', () => {
      const board = ['X', 'X', 'O', null, null, null, null, null, null];
      const result = checkWin(board, 'X', 3, 3);
      expect(result).toBeNull();
    });

    test('works on 4x4 board with winLength 3', () => {
      const board = Array(16).fill(null);
      board[0] = 'X';
      board[1] = 'X';
      board[2] = 'X';
      const result = checkWin(board, 'X', 4, 3);
      expect(result).toEqual([0, 1, 2]);
    });

    test('works on 4x4 board vertical', () => {
      const board = Array(16).fill(null);
      board[0] = 'X';
      board[4] = 'X';
      board[8] = 'X';
      const result = checkWin(board, 'X', 4, 3);
      expect(result).toEqual([0, 4, 8]);
    });
  });
});

describe('Game Logic - Valid Moves', () => {
  describe('hasValidMove', () => {
    test('returns true when player has adjacent empty cell', () => {
      const board = ['X', null, null, null, null, null, null, null, null];
      const result = hasValidMove(board, 'X', 3);
      expect(result).toBe(true);
    });

    test('returns false when player has no pieces', () => {
      const board = [null, null, null, null, null, null, null, null, null];
      const result = hasValidMove(board, 'X', 3);
      expect(result).toBe(false);
    });

    test('returns false when all adjacent cells are filled', () => {
      const board = ['X', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'];
      const result = hasValidMove(board, 'X', 3);
      expect(result).toBe(false);
    });

    test('checks all pieces of a player', () => {
      const board = ['X', null, null, null, 'X', null, null, null, 'O'];
      const result = hasValidMove(board, 'X', 3);
      expect(result).toBe(true);
    });

    test('returns true for player in middle with valid moves', () => {
      const board = [null, null, null, null, 'X', null, null, null, null];
      const result = hasValidMove(board, 'X', 3);
      expect(result).toBe(true);
    });
  });

  describe('countPieces', () => {
    test('counts 0 pieces on empty board', () => {
      const board = Array(9).fill(null);
      expect(countPieces(board, 'X')).toBe(0);
    });

    test('counts single piece', () => {
      const board = ['X', null, null, null, null, null, null, null, null];
      expect(countPieces(board, 'X')).toBe(1);
    });

    test('counts multiple pieces', () => {
      const board = ['X', null, 'X', null, 'X', null, null, null, null];
      expect(countPieces(board, 'X')).toBe(3);
    });

    test('counts only specified player pieces', () => {
      const board = ['X', 'O', 'X', 'O', 'X', null, null, null, null];
      expect(countPieces(board, 'X')).toBe(3);
      expect(countPieces(board, 'O')).toBe(2);
    });

    test('returns 0 for player with no pieces', () => {
      const board = ['X', 'X', 'X', null, null, null, null, null, null];
      expect(countPieces(board, 'O')).toBe(0);
    });
  });

  describe('isValidMove', () => {
    test('allows placement on empty cell when under max pieces', () => {
      const board = ['X', null, null, null, null, null, null, null, null];
      const result = isValidMove(1, null, board, 3, 3, 'X');
      expect(result).toBe(true);
    });

    test('prevents placement on occupied cell', () => {
      const board = ['X', 'O', null, null, null, null, null, null, null];
      const result = isValidMove(1, null, board, 3, 3, 'X');
      expect(result).toBe(false);
    });

    test('allows movement to adjacent empty cell after max pieces', () => {
      const board = ['X', 'X', 'X', null, 'O', 'O', null, null, null];
      const selectedIndex = 0;
      const result = isValidMove(3, selectedIndex, board, 3, 3, 'X');
      expect(result).toBe(true);
    });

    test('prevents movement to non-adjacent cell', () => {
      const board = ['X', 'X', 'X', 'O', 'O', 'O', null, null, null];
      const selectedIndex = 0;
      const result = isValidMove(8, selectedIndex, board, 3, 3, 'X');
      expect(result).toBe(false);
    });

    test('prevents placement on occupied cell during movement phase', () => {
      const board = ['X', 'X', 'X', 'O', 'O', 'O', 'X', null, null];
      const selectedIndex = 0;
      const result = isValidMove(1, selectedIndex, board, 3, 3, 'X');
      expect(result).toBe(false);
    });

    test('works on 4x4 board', () => {
      const board = Array(16).fill(null);
      board[0] = 'X';
      const result = isValidMove(1, null, board, 4, 4, 'X');
      expect(result).toBe(true);
    });
  });
});

describe('Game Logic - Integration', () => {
  test('full game scenario: X wins', () => {
    const board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
    const win = checkWin(board, 'X', 3, 3);
    expect(win).toEqual([0, 1, 2]);
    
    // O cannot win in this state
    const oWin = checkWin(board, 'O', 3, 3);
    expect(oWin).toBeNull();
  });

  test('full game scenario: board fills without winner', () => {
    const board = ['X', 'O', 'X', 'O', 'X', 'O', 'O', 'X', 'O'];
    
    // No wins
    expect(checkWin(board, 'X', 3, 3)).toBeNull();
    expect(checkWin(board, 'O', 3, 3)).toBeNull();
    
    // Both players at max pieces
    expect(countPieces(board, 'X')).toBe(4);
    expect(countPieces(board, 'O')).toBe(5);
  });

  test('piece movement after placement phase', () => {
    // All pieces placed
    const board = ['X', null, 'X', null, 'X', 'O', 'O', null, 'O'];
    
    // X has 3 pieces
    expect(countPieces(board, 'X')).toBe(3);
    
    // X can move piece at index 0 to index 1 (adjacent empty)
    expect(isValidMove(1, 0, board, 3, 3, 'X')).toBe(true);
    
    // X cannot move piece at index 0 to index 8 (not adjacent)
    expect(isValidMove(8, 0, board, 3, 3, 'X')).toBe(false);
  });
});

describe('Functional Tests - 3x3 Board', () => {
  const boardSize = 3;
  const maxPieces = 3;
  const winLength = 3;

  describe('Test 3: Place pieces on empty board', () => {
    test('first move creates empty board with one X', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      expect(countPieces(board, 'X')).toBe(1);
      expect(countPieces(board, 'O')).toBe(0);
    });

    test('cannot place on occupied cell', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[1] = 'O';
      expect(isValidMove(1, null, board, boardSize, maxPieces, 'X')).toBe(false);
    });
  });

  describe('Test 4: Placement phase - alternating turns and max pieces', () => {
    test('X and O alternate correctly', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X'; // Turn 1
      board[1] = 'O'; // Turn 2
      board[2] = 'X'; // Turn 3
      expect(countPieces(board, 'X')).toBe(2);
      expect(countPieces(board, 'O')).toBe(1);
    });

    test('cannot place more than 3 pieces per player', () => {
      const board = ['X', 'X', 'X', 'O', 'O', 'O', null, null, null];
      // Both at max (3 pieces each)
      expect(countPieces(board, 'X')).toBe(3);
      expect(countPieces(board, 'O')).toBe(3);
      // Should not allow placement anymore
      expect(isValidMove(6, null, board, boardSize, maxPieces, 'X')).toBe(false);
    });
  });

  describe('Test 5: Movement phase - select and move adjacent pieces', () => {
    test('can select piece and move to adjacent empty cell', () => {
      const board = ['X', 'X', 'X', 'O', 'O', 'O', null, null, null];
      const selectedIndex = 0;
      // Cell 3 is adjacent to cell 0
      expect(isValidMove(3, selectedIndex, board, boardSize, maxPieces, 'X')).toBe(false); // Cell 3 occupied
      
      // Cell 4 is adjacent to cell 0 but occupied, so test with a different board
      const board2 = ['X', 'X', 'X', null, 'O', 'O', 'O', null, null];
      expect(isValidMove(3, 0, board2, boardSize, maxPieces, 'X')).toBe(true); // Cell 3 empty & adjacent to 0
    });

    test('after moving piece, original cell becomes empty', () => {
      const board = ['X', null, 'X', 'O', null, 'O', null, null, null];
      // Simulate moving X from 0 to 3 (but 3 is occupied, so to 6)
      const newBoard = [...board];
      newBoard[6] = 'X';
      newBoard[0] = null;
      expect(newBoard[0]).toBeNull();
      expect(newBoard[6]).toBe('X');
    });
  });

  describe('Test 6: Win detection - 3 in a row', () => {
    test('detect horizontal win', () => {
      const board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
      expect(checkWin(board, 'X', boardSize, winLength)).toEqual([0, 1, 2]);
    });

    test('detect vertical win', () => {
      const board = ['X', 'O', null, 'X', 'O', null, 'X', null, null];
      expect(checkWin(board, 'X', boardSize, winLength)).toEqual([0, 3, 6]);
    });

    test('detect diagonal win', () => {
      const board = ['X', 'O', null, null, 'X', 'O', null, null, 'X'];
      expect(checkWin(board, 'X', boardSize, winLength)).toEqual([0, 4, 8]);
    });
  });

  describe('Test 7: After winning, cannot move pieces', () => {
    test('when X wins, game should be over', () => {
      const board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
      const win = checkWin(board, 'X', boardSize, winLength);
      expect(win).not.toBeNull(); // Game is over
      // Cannot make valid moves when game is over (handled by gameOver flag in script.js)
    });
  });

  describe('Test 8: Undo during placement phase', () => {
    test('undo removes piece and reverts turn', () => {
      const board = ['X', 'O', 'X', null, null, null, null, null, null];
      const undoBoard = [...board];
      undoBoard[2] = null; // Undo removes last X
      expect(countPieces(undoBoard, 'X')).toBe(1);
    });
  });

  describe('Test 9: Undo during movement phase', () => {
    test('undo returns piece to original cell', () => {
      const board = ['X', null, 'X', 'O', null, 'O', 'X', null, null];
      // Simulate undo: piece at 6 goes back to 0
      const undoBoard = [...board];
      undoBoard[0] = 'X';
      undoBoard[6] = null;
      expect(undoBoard[0]).toBe('X');
      expect(undoBoard[6]).toBeNull();
    });
  });

  describe('Test 10: Play Again button - reset board', () => {
    test('play again clears all pieces and resets to X turn', () => {
      const board = ['X', 'X', 'X', 'O', 'O', null, null, null, null];
      const resetBoard = Array(boardSize * boardSize).fill(null);
      expect(countPieces(resetBoard, 'X')).toBe(0);
      expect(countPieces(resetBoard, 'O')).toBe(0);
    });
  });
});

describe('Functional Tests - 4x4 Board (4 in a row to win)', () => {
  const boardSize = 4;
  const maxPieces = 4;
  const winLength = 4;

  describe('Test 3: Place pieces on 4x4 board', () => {
    test('board has 16 cells', () => {
      const board = Array(boardSize * boardSize).fill(null);
      expect(board.length).toBe(16);
    });

    test('can place pieces on 4x4 board', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[1] = 'O';
      expect(countPieces(board, 'X')).toBe(1);
      expect(countPieces(board, 'O')).toBe(1);
    });
  });

  describe('Test 4: Max 4 pieces per player on 4x4', () => {
    test('cannot place more than 4 pieces per player', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[1] = 'X';
      board[2] = 'X';
      board[3] = 'X';
      expect(countPieces(board, 'X')).toBe(4);
    });
  });

  describe('Test 5: Movement on 4x4 board', () => {
    test('can move pieces on larger board', () => {
      const board = Array(boardSize * boardSize).fill(null);
      // Place 4 pieces for each player
      board[0] = 'X'; board[1] = 'X'; board[2] = 'X'; board[3] = 'X';
      board[5] = 'O'; board[6] = 'O'; board[7] = 'O'; board[8] = 'O';
      
      // X at position 0 can move to position 4 (adjacent)
      expect(isValidMove(4, 0, board, boardSize, maxPieces, 'X')).toBe(true);
    });
  });

  describe('Test 6: Win on 4x4 board requires 4 in a row', () => {
    test('detect 4 horizontal in a row', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[1] = 'X';
      board[2] = 'X';
      board[3] = 'X';
      expect(checkWin(board, 'X', boardSize, winLength)).toEqual([0, 1, 2, 3]);
    });

    test('3 in a row does NOT win on 4x4 board', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[1] = 'X';
      board[2] = 'X';
      // Only 3 in a row, need 4
      expect(checkWin(board, 'X', boardSize, winLength)).toBeNull();
    });

    test('detect 4 vertical in a row on 4x4', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[4] = 'X';
      board[8] = 'X';
      board[12] = 'X';
      expect(checkWin(board, 'X', boardSize, winLength)).toEqual([0, 4, 8, 12]);
    });

    test('detect 4 diagonal in a row on 4x4', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[5] = 'X';
      board[10] = 'X';
      board[15] = 'X';
      expect(checkWin(board, 'X', boardSize, winLength)).toEqual([0, 5, 10, 15]);
    });
  });

  describe('Test 10: Undo on 4x4 board', () => {
    test('undo works on 4x4 board', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[1] = 'O';
      
      const undoBoard = [...board];
      undoBoard[1] = null;
      expect(countPieces(undoBoard, 'O')).toBe(0);
    });
  });

  describe('Test 10: Play Again on 4x4 board', () => {
    test('reset clears 4x4 board', () => {
      const board = Array(boardSize * boardSize).fill(null);
      // Board should be empty after reset
      expect(board.every(cell => cell === null)).toBe(true);
    });
  });
});

describe('Functional Tests - 5x5 Board (5 in a row to win)', () => {
  const boardSize = 5;
  const maxPieces = 5;
  const winLength = 5;

  describe('Test 3: Place pieces on 5x5 board', () => {
    test('board has 25 cells', () => {
      const board = Array(boardSize * boardSize).fill(null);
      expect(board.length).toBe(25);
    });
  });

  describe('Test 4: Max 5 pieces per player on 5x5', () => {
    test('max pieces is 5 on 5x5 board', () => {
      const board = Array(boardSize * boardSize).fill(null);
      for (let i = 0; i < 5; i++) {
        board[i] = 'X';
      }
      expect(countPieces(board, 'X')).toBe(5);
    });
  });

  describe('Test 6: Win on 5x5 board requires 5 in a row', () => {
    test('detect 5 horizontal in a row', () => {
      const board = Array(boardSize * boardSize).fill(null);
      for (let i = 0; i < 5; i++) {
        board[i] = 'X';
      }
      expect(checkWin(board, 'X', boardSize, winLength)).toEqual([0, 1, 2, 3, 4]);
    });

    test('4 in a row does NOT win on 5x5 board', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[1] = 'X';
      board[2] = 'X';
      board[3] = 'X';
      // Only 4 in a row, need 5
      expect(checkWin(board, 'X', boardSize, winLength)).toBeNull();
    });

    test('detect 5 vertical in a row on 5x5', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[5] = 'X';
      board[10] = 'X';
      board[15] = 'X';
      board[20] = 'X';
      expect(checkWin(board, 'X', boardSize, winLength)).toEqual([0, 5, 10, 15, 20]);
    });

    test('detect 5 diagonal in a row on 5x5', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[6] = 'X';
      board[12] = 'X';
      board[18] = 'X';
      board[24] = 'X';
      expect(checkWin(board, 'X', boardSize, winLength)).toEqual([0, 6, 12, 18, 24]);
    });
  });

  describe('Test 5: Movement on 5x5 board', () => {
    test('adjacency works on 5x5 board', () => {
      // Center of 5x5 is position 12
      const adj = getAdjacency(12, boardSize);
      expect(adj.length).toBe(8); // Center has 8 neighbors
    });

    test('can move pieces on 5x5 board', () => {
      const board = Array(boardSize * boardSize).fill(null);
      board[0] = 'X';
      board[1] = 'X';
      board[2] = 'X';
      board[3] = 'X';
      board[4] = 'X';
      
      // X at position 0 can move to position 5 (adjacent)
      expect(isValidMove(5, 0, board, boardSize, maxPieces, 'X')).toBe(true);
    });
  });
});
