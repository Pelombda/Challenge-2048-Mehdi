document.addEventListener("DOMContentLoaded", () => {
  const gridContainer = document.getElementById("grid-container");
  const scoreDisplay = document.getElementById("score");
  const resetButton = document.getElementById("reset-button");
  const winMessage = document.getElementById("win-message");
  const gameOverMessage = document.getElementById("game-over-message");
  const continueButton = document.getElementById("continue-button");
  let score = 0;
  let grid = [];
  let gameWon = false;

  function createGrid() {
    gridContainer.innerHTML = "";
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");
        tile.textContent = grid[i][j] ? grid[i][j] : "";
        gridContainer.appendChild(tile);
      }
    }
    addNewTile();
    addNewTile();
  }

  function addNewTile() {
    let emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          emptyTiles.push({ x: i, y: j });
        }
      }
    }
    if (emptyTiles.length > 0) {
      let { x, y } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      grid[x][y] = Math.random() < 0.9 ? 2 : 4;
      updateGrid();
    }
  }

  function updateGrid() {
    const tiles = gridContainer.children;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let index = i * 4 + j;
        tiles[index].textContent = grid[i][j] ? grid[i][j] : "";
        tiles[index].className = "tile";
        if (grid[i][j]) {
          tiles[index].classList.add("tile-" + grid[i][j]);
        }
      }
    }
    scoreDisplay.textContent = "Score: " + score;
    checkWin();
    checkGameOver();
  }

  function checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 2048 && !gameWon) {
          winMessage.classList.remove("hidden");
          gameWon = true;
        }
      }
    }
  }

  function checkGameOver() {
    // Vérifier s'il y a encore des cases vides ou des possibilités de fusion
    let gameOver = true;

    // Vérifier les cases vides
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) {
          gameOver = false;
          break;
        }
      }
    }

    // Vérifier les possibilités de fusion (horizontalement et verticalement)
    if (gameOver) {
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (
            (i < 3 && grid[i][j] === grid[i + 1][j]) || // Fusion verticale
            (j < 3 && grid[i][j] === grid[i][j + 1]) // Fusion horizontale
          ) {
            gameOver = false;
            break;
          }
        }
      }
    }

    // Si le jeu est terminé, afficher un message de défaite
    if (gameOver) {
      gameOverMessage.classList.remove("hidden");
    }
  }

  document.addEventListener("keydown", handleKeyPress);
  resetButton.addEventListener("click", () => {
    gameWon = false;
    gameOverMessage.classList.add("hidden");
    winMessage.classList.add("hidden");
    createGrid();
  });

  continueButton.addEventListener("click", () => {
    winMessage.classList.add("hidden");
  });

  function handleKeyPress(e) {
    let moved = false;
    switch (e.key) {
      case "ArrowUp":
        moved = moveUp();
        break;
      case "ArrowDown":
        moved = moveDown();
        break;
      case "ArrowLeft":
        moved = moveLeft();
        break;
      case "ArrowRight":
        moved = moveRight();
        break;
    }
    if (moved) {
      addNewTile();
    }
  }

  function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      let row = grid[i].filter((num) => num !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          score += row[j];
          row.splice(j + 1, 1);
        }
      }
      while (row.length < 4) row.push(0);
      if (!arraysEqual(grid[i], row)) {
        grid[i] = row;
        moved = true;
      }
    }
    updateGrid();
    return moved;
  }

  function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
      let row = grid[i].filter((num) => num !== 0);
      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          score += row[j];
          row.splice(j - 1, 1);
        }
      }
      while (row.length < 4) row.unshift(0);
      if (!arraysEqual(grid[i], row)) {
        grid[i] = row;
        moved = true;
      }
    }
    updateGrid();
    return moved;
  }

  function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
      let column = [];
      for (let i = 0; i < 4; i++) {
        if (grid[i][j] !== 0) column.push(grid[i][j]);
      }
      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          score += column[i];
          column.splice(i + 1, 1);
        }
      }
      while (column.length < 4) column.push(0);
      for (let i = 0; i < 4; i++) {
        if (grid[i][j] !== column[i]) {
          grid[i][j] = column[i];
          moved = true;
        }
      }
    }
    updateGrid();
    return moved;
  }

  function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
      let column = [];
      for (let i = 0; i < 4; i++) {
        if (grid[i][j] !== 0) column.push(grid[i][j]);
      }
      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          score += column[i];
          column.splice(i - 1, 1);
        }
      }
      while (column.length < 4) column.unshift(0);
      for (let i = 0; i < 4; i++) {
        if (grid[i][j] !== column[i]) {
          grid[i][j] = column[i];
          moved = true;
        }
      }
    }
    updateGrid();
    return moved;
  }
  continueButton.addEventListener("click", () => {
    winMessage.classList.add("hidden"); // Ajout de la classe hidden pour masquer le message de victoire
  });

  function arraysEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  createGrid();
});
