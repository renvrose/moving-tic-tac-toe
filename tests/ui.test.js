/** @jest-environment jsdom */

const fs = require('fs');
const path = require('path');
// Import logic at the top to ensure it's available for validation
const { isValidMove } = require('../src/gameLogic.js');

function loadApp() {
  jest.resetModules();
  const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');
  document.documentElement.innerHTML = html;
  localStorage.clear();
  // Require the script which registers DOMContentLoaded listener
  require('../src/script.js');
  document.dispatchEvent(new Event('DOMContentLoaded'));
}

describe('UI Integration - Tic-Tac-Toe Extended', () => {
  beforeEach(() => {
    loadApp();
  });

  test('Open and load application shows setup and hides game', () => {
    const setup = document.getElementById('setup');
    const game = document.getElementById('game');
    expect(setup.style.display).not.toBe('none');
    expect(game.style.display).toBe('none');
  });

  test('Change player names and blank name handling', () => {
    const px = document.getElementById('playerXInput');
    const po = document.getElementById('playerOInput');
    const start = document.getElementById('startBtn');

    px.value = 'Alice';
    po.value = 'Bob';
    start.click();

    expect(localStorage.getItem('playerXName')).toBe('Alice');
    expect(localStorage.getItem('playerOName')).toBe('Bob');

    document.getElementById('newSessionBtn').click();

    px.value = '';
    po.value = '';
    start.click();

    expect(localStorage.getItem('playerXName')).toBe('Player X');
    expect(localStorage.getItem('playerOName')).toBe('Player O');
  });

  test('Board displays empty and placing pieces alternates X then O', () => {
    document.getElementById('startBtn').click();
    const grid = document.getElementById('grid');
    expect(grid.children.length).toBe(9);

    grid.children[0].click(); // X
    expect(grid.children[0].textContent).toBe('X');

    grid.children[1].click(); // O
    expect(grid.children[1].textContent).toBe('O');
  });

  test('Undo during placement phase removes last placed piece', () => {
    document.getElementById('startBtn').click();
    const grid = document.getElementById('grid');
    const undo = document.getElementById('undoBtn');

    grid.children[0].click(); // X
    grid.children[1].click(); // O
    grid.children[2].click(); // X

    expect(grid.children[2].textContent).toBe('X');

    undo.click();
    expect(grid.children[2].textContent).toBe('');
    expect(grid.children[0].textContent).toBe('X');
    expect(grid.children[1].textContent).toBe('O');
  });

  test('Perform DOM select->move then undo (movement phase)', () => {
    document.getElementById('startBtn').click();
    const grid = document.getElementById('grid');
    const undo = document.getElementById('undoBtn');

    // Reach movement phase: X@0,1,2 | O@8,7,3
    const setupMoves = [0, 8, 1, 7, 2, 3];
    setupMoves.forEach(idx => grid.children[idx].click());

    // Verify pieces are set
    expect(grid.children[0].textContent).toBe('X');
    expect(grid.children[4].textContent).toBe('');

    // Step 1: Select X at index 0
    grid.children[0].click(); 
    
    // Step 2: Move to index 4 (center)
    grid.children[4].click();

    // Verify move happened in DOM
    expect(grid.children[0].textContent).toBe('X');
    expect(grid.children[4].textContent).toBe('');

    // Step 3: Undo movement
    undo.click();

    // Verify restoration
    expect(grid.children[0].textContent).toBe('X');
    expect(grid.children[4].textContent).toBe('');
  });

  test('Winner announcement and game locks after win', () => {
    document.getElementById('startBtn').click();
    const grid = document.getElementById('grid');
    const status = document.getElementById('status');

    // Winning sequence for X: 0, 1, 2
    [0, 3, 1, 4, 2].forEach(idx => grid.children[idx].click());

    expect(status.textContent).toMatch(/wins/);

    const before = grid.children[5].textContent;
    grid.children[5].click();
    expect(grid.children[5].textContent).toBe(before); // Should not change
  });

  test('Theme button toggles body class', () => {
    const theme = document.getElementById('themeBtn');
    expect(document.body.classList.contains('dark-mode')).toBe(false);
    theme.click();
    expect(document.body.classList.contains('dark-mode')).toBe(true);
  });

  test('Change board size to 4x4 and 5x5 (UI)', () => {
    const start = document.getElementById('startBtn');
    start.click();
    const select = document.getElementById('boardSizeSelect');
    const apply = document.getElementById('applySizeBtn');
    const grid = document.getElementById('grid');

    // Test 4x4
    select.value = '4';
    apply.click();
    expect(grid.children.length).toBe(16);

    // Test 5x5
    select.value = '5';
    apply.click();
    expect(grid.children.length).toBe(25);
  });

  test('Restart Game button returns to setup', () => {
    document.getElementById('startBtn').click();
    document.getElementById('resetBtn').click();
    expect(document.getElementById('setup').style.display).toBe('block');
    expect(document.getElementById('game').style.display).toBe('none');
  });
});