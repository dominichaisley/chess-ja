let boardState = [];

let currentPlayer = "white";

let selectedSquare;

let whiteKingPosition = [7, 4];
let blackKingPosition = [0, 4];

let whiteKingMoved = false;
let blackKingMoved = false;

let whiteKingsideRookMoved = false;
let blackKingsideRookMoved = false;

let whiteQueensideRookMoved = false;
let blackQueensideRookMoved = false;

let enPassantPossible = [];

let moveGenerationDepth = 0;

let boardRotation = "white";

let promotingSquare;

let whitePieceList;
let blackPieceList;

let botColor;

let gameMode = "";

let gameActive = false;

let gameEval = 0;

let gameCount = 0;
let whiteWins = 0;
let blackWins = 0;
let drawCount = 0;

let botSpeed = 1000;

let botOne;
let botTwo;

let botOneWins = 0;
let botTwoWins = 0;

let botOneColor;
let botTwoColor;

let whiteBot;
let blackBot;

let botDepth = 2;

createBoard();

setBoard();

renderBoard();

function showStartMenu() {
  document.querySelector(".start-game-menu").classList.remove("hidden");
}

function createBoard() {
  console.time("createBoard");
  let squaresHTML = "";
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (i % 2 === 1) {
        if (j % 2 === 1) {
          squaresHTML += `<button class="light-square square-${i}-${j}"></button>`;
        } else {
          squaresHTML += `<button class="dark-square square-${i}-${j}"></button>`;
        }
      } else {
        if (j % 2 === 1) {
          squaresHTML += `<button class="dark-square square-${i}-${j}"></button>`;
        } else {
          squaresHTML += `<button class="light-square square-${i}-${j}"></button>`;
        }
      }
    }
  }
  document.querySelector(".board").innerHTML = squaresHTML;

  let boardSquare;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      document
        .querySelector(`.square-${i}-${j}`)
        .addEventListener("click", () => selectSquare(i, j));
    }
  }

  document.querySelector(".bot-vs-bot").addEventListener("click", () => {
    document.querySelector(".start-game-menu").classList.add("hidden");
    document.querySelector(".select-bots-menu").classList.remove("hidden");
  });

  document
    .querySelector(".select-bots-menu-play-button")
    .addEventListener("click", () => startBotVsBot());

  document.querySelector(".play-vs-bot").addEventListener("click", () => {
    document.querySelector(".start-game-menu").classList.add("hidden");
    document
      .querySelector(".select-player-color-menu")
      .classList.remove("hidden");
  });

  document
    .querySelector(".play-as-white")
    .addEventListener("click", () => selectPlayerColor("white"));

  document
    .querySelector(".play-as-black")
    .addEventListener("click", () => selectPlayerColor("black"));

  document.querySelector(".pass-and-play").addEventListener("click", () => {
    document.querySelector(".start-game-menu").classList.add("hidden");
    setBoard();
    renderBoard();
    gameMode = "pass and play";
    gameActive = true;
  });

  document
    .querySelector(".below-board-new-game-button")
    .addEventListener("click", () => {
      setBoard();
      renderBoard();
      showStartMenu();
      gameActive = false;
    });

  document
    .querySelector(".rotate-board-button")
    .addEventListener("click", () => {
      rotateBoard();
      renderBoard();
    });

  document
    .querySelector(".white-resign-board-button")
    .addEventListener("click", () => chooseResult("white resigns"));

  document
    .querySelector(".draw-board-button")
    .addEventListener("click", () => chooseResult("draw"));

  document
    .querySelector(".black-resign-board-button")
    .addEventListener("click", () => chooseResult("black resigns"));

  document
    .querySelector(".white-queen-promotion")
    .addEventListener("click", () => promote("queen", "white", 9));
  document
    .querySelector(".white-knight-promotion")
    .addEventListener("click", () => promote("knight", "white", 3));
  document
    .querySelector(".white-rook-promotion")
    .addEventListener("click", () => promote("rook", "white", 5));
  document
    .querySelector(".white-bishop-promotion")
    .addEventListener("click", () => promote("bishop", "white", 3));

  document
    .querySelector(".black-queen-promotion")
    .addEventListener("click", () => promote("queen", "black", 9));
  document
    .querySelector(".black-knight-promotion")
    .addEventListener("click", () => promote("knight", "black", 3));
  document
    .querySelector(".black-rook-promotion")
    .addEventListener("click", () => promote("rook", "black", 5));
  document
    .querySelector(".black-bishop-promotion")
    .addEventListener("click", () => promote("bishop", "black", 3));

  document
    .querySelector(".exit-white-promotion")
    .addEventListener("click", () => cancelPromotion("white"));
  document
    .querySelector(".exit-black-promotion")
    .addEventListener("click", () => cancelPromotion("black"));
  console.timeEnd("createBoard");
}

function setBoard() {
  console.time("setBoard");
  boardState = [];
  currentPlayer = "white";
  whiteKingPosition = [7, 4];
  blackKingPosition = [0, 4];
  if (document.querySelector(".selected")) {
    document.querySelector(".selected").classList.remove("selected");
  }
  document.querySelector(".result").classList.add("hidden");
  document.querySelector(".select-player-color-menu").classList.add("hidden");
  document.querySelector(".white-promotion-selection").classList.add("hidden");
  document.querySelector(".black-promotion-selection").classList.add("hidden");
  whiteKingMoved = false;
  blackKingMoved = false;
  whiteKingsideRookMoved = false;
  blackKingsideRookMoved = false;
  whiteQueensideRookMoved = false;
  blackQueensideRookMoved = false;
  enPassantPossible = [];
  whitePieceList = [
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  blackPieceList = [
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "pawn",
    "rook",
    "knight",
    "bishop",
    "queen",
    "king",
    "bishop",
    "knight",
    "rook",
  ];
  if (gameCount === 0) {
    gameMode = "";
  }
  gameEval = 0;

  if (gameMode === "bot vs bot") {
    if (botOneColor === "White") {
      botOneColor = "Black";
      blackBot = botOne;
      botTwoColor = "White";
      whiteBot = botTwo;
    } else {
      botOneColor = "White";
      whiteBot = botOne;
      botTwoColor = "Black";
      blackBot = botTwo;
    }
  }

  const pieceList = [
    ["rook", 5],
    ["knight", 3],
    ["bishop", 3],
    ["queen", 9],
    ["king", 0],
    ["bishop", 3],
    ["knight", 3],
    ["rook", 5],
  ];

  let piece;

  let boardRow = [];
  for (let i = 0; i < 8; i++) {
    piece = {
      type: pieceList[i][0],
      color: "black",
      sprite: `<img src="Pieces/black-${pieceList[i][0]}.svg">`,
      value: pieceList[i][1],
    };
    boardRow.push(piece);
  }
  boardState.push(boardRow);

  boardRow = [];
  for (let i = 0; i < 8; i++) {
    piece = {
      type: "pawn",
      color: "black",
      sprite: `<img src="Pieces/black-pawn.svg">`,
      value: 1,
    };
    boardRow.push(piece);
  }
  boardState.push(boardRow);

  for (let i = 0; i < 4; i++) {
    boardRow = [];
    for (let j = 0; j < 8; j++) {
      boardRow.push(null);
    }
    boardState.push(boardRow);
  }

  boardRow = [];
  for (let i = 0; i < 8; i++) {
    piece = {
      type: "pawn",
      color: "white",
      sprite: `<img src="Pieces/white-pawn.svg">`,
      value: 1,
    };
    boardRow.push(piece);
  }
  boardState.push(boardRow);

  boardRow = [];
  for (let i = 0; i < 8; i++) {
    piece = {
      type: pieceList[i][0],
      color: "white",
      sprite: `<img src="Pieces/white-${pieceList[i][0]}.svg">`,
      value: pieceList[i][1],
    };
    boardRow.push(piece);
  }
  boardState.push(boardRow);
  console.timeEnd("setBoard");
}

function renderBoard() {
  console.time("renderBoard");
  let square;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState[i][j]) {
        square = document.querySelector(`.square-${i}-${j}`);
        square.innerHTML = "<div></div>" + boardState[i][j].sprite;
      } else {
        square = document.querySelector(`.square-${i}-${j}`);
        square.innerHTML = "<div></div>";
      }
    }
  }
  console.timeEnd("renderBoard");
}

function rotateBoard() {
  let squaresHTML = "";
  if (boardRotation === "white") {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (i % 2 === 1) {
          if (j % 2 === 1) {
            squaresHTML += `<button class="light-square square-${7 - i}-${
              7 - j
            }"></button>`;
          } else {
            squaresHTML += `<button class="dark-square square-${7 - i}-${
              7 - j
            }"></button>`;
          }
        } else {
          if (j % 2 === 1) {
            squaresHTML += `<button class="dark-square square-${7 - i}-${
              7 - j
            }"></button>`;
          } else {
            squaresHTML += `<button class="light-square square-${7 - i}-${
              7 - j
            }"></button>`;
          }
        }
      }
    }
    document.querySelector(".board").innerHTML = squaresHTML;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        document
          .querySelector(`.square-${i}-${j}`)
          .addEventListener("click", () => selectSquare(i, j));
      }
    }

    let rankLabels = document.querySelector(".rank-labels");
    rankLabels.classList.remove("white-rank-labels");
    rankLabels.classList.add("black-rank-labels");

    let fileLabels = document.querySelector(".file-labels");
    fileLabels.classList.remove("white-file-labels");
    fileLabels.classList.add("black-file-labels");

    let lightSquareBoardLabels = document.querySelectorAll(
      ".light-square-board-label"
    );

    let darkSquareBoardLabels = document.querySelectorAll(
      ".dark-square-board-label"
    );

    lightSquareBoardLabels.forEach((label) => {
      label.classList.remove("light-square-board-label");
      label.classList.add("dark-square-board-label");
    });

    darkSquareBoardLabels.forEach((label) => {
      label.classList.remove("dark-square-board-label");
      label.classList.add("light-square-board-label");
    });

    let whitePromotionSelection = document.querySelector(
      ".white-promotion-selection"
    );

    let blackPromotionSelection = document.querySelector(
      ".black-promotion-selection"
    );

    whitePromotionSelection.classList.remove("top-promotion-selection");
    whitePromotionSelection.classList.add("bottom-promotion-selection");

    blackPromotionSelection.classList.remove("bottom-promotion-selection");
    blackPromotionSelection.classList.add("top-promotion-selection");

    boardRotation = "black";
  } else {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (i % 2 === 1) {
          if (j % 2 === 1) {
            squaresHTML += `<button class="light-square square-${i}-${j}"></button>`;
          } else {
            squaresHTML += `<button class="dark-square square-${i}-${j}"></button>`;
          }
        } else {
          if (j % 2 === 1) {
            squaresHTML += `<button class="dark-square square-${i}-${j}"></button>`;
          } else {
            squaresHTML += `<button class="light-square square-${i}-${j}"></button>`;
          }
        }
      }
    }
    document.querySelector(".board").innerHTML = squaresHTML;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        document
          .querySelector(`.square-${i}-${j}`)
          .addEventListener("click", () => selectSquare(i, j));
      }
    }

    let rankLabels = document.querySelector(".rank-labels");
    rankLabels.classList.remove("black-rank-labels");
    rankLabels.classList.add("white-rank-labels");

    let fileLabels = document.querySelector(".file-labels");
    fileLabels.classList.remove("black-file-labels");
    fileLabels.classList.add("white-file-labels");

    let lightSquareBoardLabels = document.querySelectorAll(
      ".light-square-board-label"
    );

    let darkSquareBoardLabels = document.querySelectorAll(
      ".dark-square-board-label"
    );

    lightSquareBoardLabels.forEach((label) => {
      label.classList.remove("light-square-board-label");
      label.classList.add("dark-square-board-label");
    });

    darkSquareBoardLabels.forEach((label) => {
      label.classList.remove("dark-square-board-label");
      label.classList.add("light-square-board-label");
    });

    let whitePromotionSelection = document.querySelector(
      ".white-promotion-selection"
    );

    let blackPromotionSelection = document.querySelector(
      ".black-promotion-selection"
    );

    whitePromotionSelection.classList.remove("bottom-promotion-selection");
    whitePromotionSelection.classList.add("top-promotion-selection");

    blackPromotionSelection.classList.remove("top-promotion-selection");
    blackPromotionSelection.classList.add("bottom-promotion-selection");

    boardRotation = "white";
  }
}

function selectSquare(i, j) {
  console.time("selectSquare");
  if (!gameActive) {
    return;
  }
  document
    .querySelector(`.${currentPlayer}-promotion-selection`)
    .classList.add("hidden");
  if (document.querySelector(".selected")) {
    document.querySelector(".selected").classList.remove("selected");
  }
  if (boardState[i][j]) {
    if (currentPlayer === boardState[i][j].color) {
      document.querySelector(`.square-${i}-${j}`).classList.add("selected");
      selectedSquare = [i, j];
      renderMoves(i, j);
    } else {
      if (
        document
          .querySelector(`.square-${i}-${j} div`)
          .classList.contains("possible-move")
      ) {
        movePiece(i, j);
      } else {
        document.querySelector(`.square-${i}-${j}`).classList.add("selected");
        selectedSquare = [i, j];
        clearMoves();
      }
    }
  } else {
    if (
      document
        .querySelector(`.square-${i}-${j} div`)
        .classList.contains("possible-move")
    ) {
      movePiece(i, j);
    } else {
      clearMoves();
    }
  }
  console.timeEnd("selectSquare");
}

function generateMoves(i, j) {
  if (boardState[i][j].type === "pawn") {
    return generatePawnMoves(i, j);
  } else if (boardState[i][j].type === "rook") {
    return generateRookMoves(i, j);
  } else if (boardState[i][j].type === "knight") {
    return generateKnightMoves(i, j);
  } else if (boardState[i][j].type === "bishop") {
    return generateBishopMoves(i, j);
  } else if (boardState[i][j].type === "queen") {
    return generateQueenMoves(i, j);
  } else if (boardState[i][j].type === "king") {
    return generateKingMoves(i, j);
  }
}

function generatePawnMoves(i, j) {
  const moves = [];
  if (boardState[i][j].color === "white") {
    let moveRank = i - 1;
    let moveFile = j;
    if (!boardState[moveRank][moveFile]) {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
      moveRank = i - 2;
      if (i === 6 && !boardState[moveRank][moveFile]) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    }

    moveRank = i - 1;

    moveFile = j + 1;
    if (moveFile <= 7) {
      if (boardState[moveRank][moveFile]) {
        if (boardState[moveRank][moveFile].color != currentPlayer) {
          if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
            moves.push([moveRank, moveFile]);
          }
        }
      }
    }

    moveFile = j - 1;
    if (moveFile >= 0) {
      if (boardState[moveRank][moveFile]) {
        if (boardState[moveRank][moveFile].color != currentPlayer) {
          if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
            moves.push([moveRank, moveFile]);
          }
        }
      }
    }
  } else if (boardState[i][j].color === "black") {
    let moveRank = i + 1;
    let moveFile = j;
    if (!boardState[moveRank][moveFile]) {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
      moveRank = i + 2;
      if (i === 1 && !boardState[moveRank][moveFile]) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    }
    moveRank = i + 1;

    moveFile = j + 1;
    if (moveFile <= 7) {
      if (boardState[moveRank][moveFile]) {
        if (boardState[moveRank][moveFile].color != currentPlayer) {
          if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
            moves.push([moveRank, moveFile]);
          }
        }
      }
    }
    moveFile = j - 1;
    if (moveFile >= 0) {
      if (boardState[moveRank][moveFile]) {
        if (boardState[moveRank][moveFile].color != currentPlayer) {
          if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
            moves.push([moveRank, moveFile]);
          }
        }
      }
    }
  }

  if (JSON.stringify(enPassantPossible) !== "[]") {
    if (i === enPassantPossible[0][0][0] && j === enPassantPossible[0][0][1]) {
      if (
        moveGenerationDepth ||
        !inCheck(
          [i, j],
          [enPassantPossible[0][1][0], enPassantPossible[0][1][1]]
        )
      ) {
        if (
          boardState[i][enPassantPossible[0][1][1]] &&
          boardState[i][enPassantPossible[0][1][1]].color !== currentPlayer
        ) {
          moves.push([enPassantPossible[0][1][0], enPassantPossible[0][1][1]]);
        }
      }
    } else if (
      enPassantPossible[1] &&
      i === enPassantPossible[1][0][0] &&
      j === enPassantPossible[1][0][1]
    ) {
      if (
        moveGenerationDepth ||
        !inCheck(
          [i, j],
          [enPassantPossible[1][1][0], enPassantPossible[1][1][1]]
        )
      ) {
        if (
          boardState[i][enPassantPossible[1][1][1]] &&
          boardState[i][enPassantPossible[1][1][1]].color !== currentPlayer
        ) {
          moves.push([enPassantPossible[1][1][0], enPassantPossible[1][1][1]]);
        }
      }
    }
  }

  return moves;
}

function generateRookMoves(i, j) {
  const moves = [];

  let moveRank = i + 1;
  let moveFile = j;
  while (moveRank <= 7 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank++;
  }
  if (moveRank <= 7 && boardState[moveRank][moveFile].color !== currentPlayer) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i - 1;
  moveFile = j;
  while (moveRank >= 0 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank--;
  }
  if (moveRank >= 0 && boardState[moveRank][moveFile].color !== currentPlayer) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i;
  moveFile = j + 1;
  while (moveFile <= 7 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveFile++;
  }
  if (moveFile <= 7 && boardState[moveRank][moveFile].color !== currentPlayer) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i;
  moveFile = j - 1;
  while (moveFile >= 0 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveFile--;
  }
  if (moveFile >= 0 && boardState[moveRank][moveFile].color !== currentPlayer) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  return moves;
}

function generateKnightMoves(i, j) {
  const moves = [];

  let moveRank = i - 2;
  let moveFile = j - 1;
  if (moveRank >= 0 && moveFile >= 0) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i - 2;
  moveFile = j + 1;
  if (moveRank >= 0 && moveFile <= 7) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i - 1;
  moveFile = j + 2;
  if (moveRank >= 0 && moveFile <= 7) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i + 1;
  moveFile = j + 2;
  if (moveRank <= 7 && moveFile <= 7) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i + 2;
  moveFile = j + 1;
  if (moveRank <= 7 && moveFile <= 7) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i + 2;
  moveFile = j - 1;
  if (moveRank <= 7 && moveFile >= 0) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i + 1;
  moveFile = j - 2;
  if (moveRank <= 7 && moveFile >= 0) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i - 1;
  moveFile = j - 2;
  if (moveRank >= 0 && moveFile >= 0) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  return moves;
}

function generateBishopMoves(i, j) {
  const moves = [];

  let moveRank = i + 1;
  let moveFile = j + 1;
  while (moveRank <= 7 && moveFile <= 7 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank++;
    moveFile++;
  }
  if (
    moveRank <= 7 &&
    moveFile <= 7 &&
    boardState[moveRank][moveFile].color !== currentPlayer
  ) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i + 1;
  moveFile = j - 1;
  while (moveRank <= 7 && moveFile >= 0 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank++;
    moveFile--;
  }
  if (
    moveRank <= 7 &&
    moveFile >= 0 &&
    boardState[moveRank][moveFile].color !== currentPlayer
  ) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i - 1;
  moveFile = j + 1;
  while (moveRank >= 0 && moveFile <= 7 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank--;
    moveFile++;
  }
  if (
    moveRank >= 0 &&
    moveFile <= 7 &&
    boardState[moveRank][moveFile].color !== currentPlayer
  ) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i - 1;
  moveFile = j - 1;
  while (moveRank >= 0 && moveFile >= 0 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank--;
    moveFile--;
  }
  if (
    moveRank >= 0 &&
    moveFile >= 0 &&
    boardState[moveRank][moveFile].color !== currentPlayer
  ) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  return moves;
}

function generateQueenMoves(i, j) {
  const moves = [];

  let moveRank = i + 1;
  let moveFile = j;
  while (moveRank <= 7 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank++;
  }
  if (moveRank <= 7 && boardState[moveRank][moveFile].color !== currentPlayer) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i - 1;
  moveFile = j;
  while (moveRank >= 0 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank--;
  }
  if (moveRank >= 0 && boardState[moveRank][moveFile].color !== currentPlayer) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i;
  moveFile = j + 1;
  while (moveFile <= 7 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveFile++;
  }
  if (moveFile <= 7 && boardState[moveRank][moveFile].color !== currentPlayer) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i;
  moveFile = j - 1;
  while (moveFile >= 0 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveFile--;
  }
  if (moveFile >= 0 && boardState[moveRank][moveFile].color !== currentPlayer) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i + 1;
  moveFile = j + 1;
  while (moveRank <= 7 && moveFile <= 7 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank++;
    moveFile++;
  }
  if (
    moveRank <= 7 &&
    moveFile <= 7 &&
    boardState[moveRank][moveFile].color !== currentPlayer
  ) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i + 1;
  moveFile = j - 1;
  while (moveRank <= 7 && moveFile >= 0 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank++;
    moveFile--;
  }
  if (
    moveRank <= 7 &&
    moveFile >= 0 &&
    boardState[moveRank][moveFile].color !== currentPlayer
  ) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i - 1;
  moveFile = j + 1;
  while (moveRank >= 0 && moveFile <= 7 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank--;
    moveFile++;
  }
  if (
    moveRank >= 0 &&
    moveFile <= 7 &&
    boardState[moveRank][moveFile].color !== currentPlayer
  ) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  moveRank = i - 1;
  moveFile = j - 1;
  while (moveRank >= 0 && moveFile >= 0 && !boardState[moveRank][moveFile]) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
    moveRank--;
    moveFile--;
  }
  if (
    moveRank >= 0 &&
    moveFile >= 0 &&
    boardState[moveRank][moveFile].color !== currentPlayer
  ) {
    if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
      moves.push([moveRank, moveFile]);
    }
  }

  return moves;
}

function generateKingMoves(i, j) {
  const moves = [];

  let moveRank = i - 1;
  let moveFile = j;
  if (moveRank >= 0) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i - 1;
  moveFile = j + 1;
  if (moveRank >= 0 && moveFile <= 7) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i;
  moveFile = j + 1;
  if (moveFile <= 7) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i + 1;
  moveFile = j + 1;
  if (moveRank <= 7 && moveFile <= 7) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i + 1;
  moveFile = j;
  if (moveRank <= 7) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i + 1;
  moveFile = j - 1;
  if (moveRank <= 7 && moveFile >= 0) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i;
  moveFile = j - 1;
  if (moveFile >= 0) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  moveRank = i - 1;
  moveFile = j - 1;
  if (moveRank >= 0 && moveFile >= 0) {
    if (boardState[moveRank][moveFile]) {
      if (boardState[moveRank][moveFile].color != currentPlayer) {
        if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
          moves.push([moveRank, moveFile]);
        }
      }
    } else {
      if (moveGenerationDepth || !inCheck([i, j], [moveRank, moveFile])) {
        moves.push([moveRank, moveFile]);
      }
    }
  }

  if (currentPlayer === "white") {
    if (!whiteKingMoved) {
      if (!whiteKingsideRookMoved && !boardState[7][5] && !boardState[7][6]) {
        if (
          moveGenerationDepth ||
          (!inCheck([i, j], [7, 6]) && !inCheck([i, j], [7, 5]))
        ) {
          moves.push([7, 6]);
        }
      }
      if (
        !whiteQueensideRookMoved &&
        !boardState[7][3] &&
        !boardState[7][2] &&
        !boardState[7][1]
      ) {
        if (
          moveGenerationDepth ||
          (!inCheck([i, j], [7, 2]) && !inCheck([i, j], [7, 3]))
        ) {
          moves.push([7, 2]);
        }
      }
    }
  } else {
    if (!blackKingMoved) {
      if (!blackKingsideRookMoved && !boardState[0][5] && !boardState[0][6]) {
        if (
          moveGenerationDepth ||
          (!inCheck([i, j], [0, 6]) && !inCheck([i, j], [0, 5]))
        ) {
          moves.push([0, 6]);
        }
      }
      if (
        !blackQueensideRookMoved &&
        !boardState[0][3] &&
        !boardState[0][2] &&
        !boardState[0][1]
      ) {
        if (
          moveGenerationDepth ||
          (!inCheck([i, j], [0, 2]) && !inCheck([i, j], [0, 3]))
        ) {
          moves.push([0, 2]);
        }
      }
    }
  }

  return moves;
}

function renderMoves(i, j) {
  //console.time('generateMoves')
  const moves = generateMoves(i, j);
  //console.timeEnd('generateMoves')
  clearMoves();
  for (let idx = 0; idx < moves.length; idx++) {
    if (boardState[moves[idx][0]][moves[idx][1]]) {
      document
        .querySelector(`.square-${moves[idx][0]}-${moves[idx][1]} div`)
        .classList.add("possible-move");
      document
        .querySelector(`.square-${moves[idx][0]}-${moves[idx][1]} div`)
        .classList.add("capture");
    } else {
      document
        .querySelector(`.square-${moves[idx][0]}-${moves[idx][1]} div`)
        .classList.add("possible-move");
    }
  }
}

function clearMoves() {
  if (document.querySelectorAll(".possible-move")) {
    document
      .querySelectorAll(".possible-move")
      .forEach((item) => item.classList.remove("possible-move"));
  }
  if (document.querySelectorAll(".capture")) {
    document
      .querySelectorAll(".capture")
      .forEach((item) => item.classList.remove("capture"));
  }
}

function movePiece(i, j) {
  if (boardState[selectedSquare[0]][selectedSquare[1]].type === "king") {
    if (currentPlayer === "white") {
      if (selectedSquare[1] === 4 && j === 6) {
        boardState[7][5] = boardState[7][7];
        boardState[7][7] = null;
      }

      if (selectedSquare[1] === 4 && j === 2) {
        boardState[7][3] = boardState[7][0];
        boardState[7][0] = null;
      }

      whiteKingMoved = true;
      whiteKingPosition = [i, j];
    } else {
      if (selectedSquare[1] === 4 && j === 6) {
        boardState[0][5] = boardState[0][7];
        boardState[0][7] = null;
      }

      if (selectedSquare[1] === 4 && j === 2) {
        boardState[0][3] = boardState[0][0];
        boardState[0][0] = null;
      }

      blackKingMoved = true;
      blackKingPosition = [i, j];
    }
  }

  if (
    (selectedSquare[0] === 7 && selectedSquare[1] === 0) ||
    (i === 7 && j === 0)
  ) {
    whiteQueensideRookMoved = true;
  }

  if (
    (selectedSquare[0] === 7 && selectedSquare[1] === 7) ||
    (i === 7 && j === 7)
  ) {
    whiteKingsideRookMoved = true;
  }

  if (
    (selectedSquare[0] === 0 && selectedSquare[1] === 0) ||
    (i === 0 && j === 0)
  ) {
    blackQueensideRookMoved = true;
  }

  if (
    (selectedSquare[0] === 0 && selectedSquare[1] === 7) ||
    (i === 0 && j === 7)
  ) {
    blackKingsideRookMoved = true;
  }

  let currentEnPassant = false;
  if (boardState[selectedSquare[0]][selectedSquare[1]].type === "pawn") {
    if (selectedSquare[1] !== j && !boardState[i][j]) {
      boardState[selectedSquare[0]][j] = null;
      if (currentPlayer === "white") {
        let pawnIndex = blackPieceList.indexOf("pawn");
        blackPieceList.splice(pawnIndex, 1);
        gameEval++;
      } else {
        let pawnIndex = whitePieceList.indexOf("pawn");
        whitePieceList.splice(pawnIndex, 1);
        gameEval--;
      }
    }

    if (currentPlayer === "white") {
      if (selectedSquare[0] === 6 && i === 4) {
        if (j + 1 <= 7) {
          enPassantPossible.push([
            [i, j + 1],
            [i + 1, j],
          ]);
        }
        if (j - 1 >= 0) {
          enPassantPossible.push([
            [i, j - 1],
            [i + 1, j],
          ]);
        }
        currentEnPassant = true;
      }
    } else {
      if (selectedSquare[0] === 1 && i === 3) {
        if (j + 1 <= 7) {
          enPassantPossible.push([
            [i, j + 1],
            [i - 1, j],
          ]);
        }
        if (j - 1 >= 0) {
          enPassantPossible.push([
            [i, j - 1],
            [i - 1, j],
          ]);
        }
        currentEnPassant = true;
      }
    }
  }

  let promoting = false;
  if (boardState[selectedSquare[0]][selectedSquare[1]].type === "pawn") {
    if (
      i === 0 &&
      boardState[selectedSquare[0]][selectedSquare[1]].color === "white"
    ) {
      promoting = true;
      promotingSquare = [i, j];
      displayPromotionSelection(j);
    } else if (
      i === 7 &&
      boardState[selectedSquare[0]][selectedSquare[1]].color === "black"
    ) {
      promoting = true;
      promotingSquare = [i, j];
      displayPromotionSelection(j);
    }
  }

  if (!promoting) {
    if (boardState[i][j]) {
      if (currentPlayer === "white") {
        let capturedPieceIndex = blackPieceList.indexOf(boardState[i][j].type);
        blackPieceList.splice(capturedPieceIndex, 1);
        gameEval += boardState[i][j].value;
      } else {
        let capturedPieceIndex = whitePieceList.indexOf(boardState[i][j].type);
        whitePieceList.splice(capturedPieceIndex, 1);
        gameEval -= boardState[i][j].value;
      }
    }

    updateEvalBar();

    boardState[i][j] = boardState[selectedSquare[0]][selectedSquare[1]];
    boardState[selectedSquare[0]][selectedSquare[1]] = null;

    renderBoard();

    if (currentPlayer === "white") {
      currentPlayer = "black";
    } else {
      currentPlayer = "white";
    }

    if (JSON.stringify(enPassantPossible) !== "[]" && !currentEnPassant) {
      enPassantPossible = [];
    }

    displayResult();

    if (
      (gameActive &&
        gameMode === "play vs bot" &&
        currentPlayer === botColor) ||
      (gameActive && gameMode === "bot vs bot")
    ) {
      playBotMove();
    }
  }
}

function inCheck(movingPieceSquare, destinationSquare) {
  //console.time('inCheck')
  const saveBoardState = JSON.stringify(boardState);
  if (movingPieceSquare && destinationSquare) {
    playTestMove(movingPieceSquare, destinationSquare);
  }
  if (currentPlayer === "white") {
    currentPlayer = "black";
  } else {
    currentPlayer = "white";
  }
  let opponentMoves = [];
  let opponentPieceMoves = [];
  moveGenerationDepth = 1;
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState[i][j]) {
        if (boardState[i][j].color === currentPlayer) {
          opponentPieceMoves = generateMoves(i, j);
          for (let k = 0; k < opponentPieceMoves.length; k++) {
            opponentMoves.push(JSON.stringify(opponentPieceMoves[k]));
          }
        }
      }
    }
  }
  moveGenerationDepth = 0;
  if (currentPlayer === "white") {
    currentPlayer = "black";
  } else {
    currentPlayer = "white";
  }
  boardState = JSON.parse(saveBoardState);
  //console.timeEnd('inCheck')
  if (
    movingPieceSquare &&
    destinationSquare &&
    boardState[movingPieceSquare[0]][movingPieceSquare[1]].type === "king"
  ) {
    return opponentMoves.includes(
      JSON.stringify([destinationSquare[0], destinationSquare[1]])
    );
  } else if (currentPlayer === "white") {
    return opponentMoves.includes(JSON.stringify(whiteKingPosition));
  } else {
    return opponentMoves.includes(JSON.stringify(blackKingPosition));
  }
}

function displayResult() {
  let moves;
  let gameResult = "";
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState[i][j]) {
        if (boardState[i][j].color === currentPlayer) {
          moves = generateMoves(i, j);
          if (JSON.stringify(moves) !== "[]") {
            gameResult = "continue";
            break;
          }
        }
      }
    }
    if (gameResult === "continue") {
      break;
    }
  }

  if (gameResult !== "continue") {
    if (inCheck()) {
      gameResult = "checkmate";
    } else {
      gameResult = "stalemate";
    }
  }

  if (whitePieceList.length === 1 && blackPieceList.length === 1) {
    gameResult = "insufficient material";
  }

  if (
    whitePieceList.length === 2 &&
    (whitePieceList.includes("knight") || whitePieceList.includes("bishop")) &&
    blackPieceList.length === 1
  ) {
    gameResult = "insufficient material";
  }

  if (
    blackPieceList.length === 2 &&
    (blackPieceList.includes("knight") || blackPieceList.includes("bishop")) &&
    whitePieceList.length === 1
  ) {
    gameResult = "insufficient material";
  }

  if (gameResult === "checkmate") {
    let resultElement = document.querySelector(".result");
    if (currentPlayer === "black") {
      resultElement.innerHTML =
        '<div>White Wins!</div><button class="result-new-game-button game-control-button">New Game</button>';
      if (gameMode === "bot vs bot" && gameCount < 100) {
        gameCount++;
        whiteWins++;
        if (botOneColor === "White") {
          botOneWins++;
        } else {
          botTwoWins++;
        }
        whiteWins++;
        setBoard();
        renderBoard();
        selectPlayerColor("white");
        document.querySelector(".scoreboard").innerHTML = `<div>
              <div><u>Bot 1</u></div>
              <div>${botOneColor}</div>
              <div>${botOneWins} Wins</div>
              <div>${botOne}</div>
            </div>
            <div>
              <div><u>Bot 2</u></div>
              <div>${botTwoColor}</div>
              <div>${botTwoWins} Wins</div>
              <div>${botTwo}</div>
            </div>
            <div>Draws: ${drawCount}</div>
            <input class="bot-speed-input" placeholder="Enter bot speed">`;
        document
          .querySelector(".bot-speed-input")
          .addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              updateBotSpeed();
            }
          });
        return;
      }
    } else {
      resultElement.innerHTML =
        '<div>Black Wins!</div><button class="result-new-game-button game-control-button">New Game</button>';
      if (gameMode === "bot vs bot" && gameCount < 100) {
        gameCount++;
        blackWins++;
        if (botOneColor === "Black") {
          botOneWins++;
        } else {
          botTwoWins++;
        }
        setBoard();
        renderBoard();
        selectPlayerColor("white");
        document.querySelector(".scoreboard").innerHTML = `<div>
              <div><u>Bot 1</u></div>
              <div>${botOneColor}</div>
              <div>${botOneWins} Wins</div>
              <div>${botOne}</div>
            </div>
            <div>
              <div><u>Bot 2</u></div>
              <div>${botTwoColor}</div>
              <div>${botTwoWins} Wins</div>
              <div>${botTwo}</div>
            </div>
            <div>Draws: ${drawCount}</div>
            <input class="bot-speed-input" placeholder="Enter bot speed">`;
        document
          .querySelector(".bot-speed-input")
          .addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
              updateBotSpeed();
            }
          });
        return;
      }
    }
    document
      .querySelector(".result-new-game-button")
      .addEventListener("click", () => {
        setBoard();
        renderBoard();
        showStartMenu();
      });
    gameActive = false;
    resultElement.classList.remove("hidden");
  } else if (
    gameResult === "stalemate" ||
    gameResult === "insufficient material"
  ) {
    let resultElement = document.querySelector(".result");
    resultElement.innerHTML =
      '<div>Draw!</div><button class="result-new-game-button game-control-button">New Game</button>';
    if (gameMode === "bot vs bot" && gameCount < 100) {
      gameCount++;
      drawCount++;
      setBoard();
      renderBoard();
      selectPlayerColor("white");
      document.querySelector(".scoreboard").innerHTML = `<div>
            <div><u>Bot 1</u></div>
            <div>${botOneColor}</div>
            <div>${botOneWins} Wins</div>
            <div>${botOne}</div>
          </div>
          <div>
            <div><u>Bot 2</u></div>
            <div>${botTwoColor}</div>
            <div>${botTwoWins} Wins</div>
            <div>${botTwo}</div>
          </div>
          <div>Draws: ${drawCount}</div>
          <input class="bot-speed-input" placeholder="Enter bot speed">`;
      document
        .querySelector(".bot-speed-input")
        .addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            updateBotSpeed();
          }
        });
      return;
    }
    document
      .querySelector(".result-new-game-button")
      .addEventListener("click", () => {
        setBoard();
        renderBoard();
        showStartMenu();
      });
    gameActive = false;
    resultElement.classList.remove("hidden");
  }
}

function displayPromotionSelection(j) {
  if (
    gameMode === "bot vs bot" ||
    (gameMode === "play vs bot" && currentPlayer === botColor)
  ) {
    promote("queen", currentPlayer, 9);
    return;
  }

  let options = document.querySelector(`.${currentPlayer}-promotion-selection`);
  if (boardRotation === "white") {
    options.style.left = `${j * 75}px`;
  } else {
    options.style.left = `${525 - j * 75}px`;
  }
  options.classList.remove("hidden");
}

function promote(type, color, value) {
  if (boardState[promotingSquare[0]][promotingSquare[1]]) {
    if (currentPlayer === "white") {
      let capturedPieceIndex = blackPieceList.indexOf(
        boardState[promotingSquare[0]][promotingSquare[1]].type
      );
      blackPieceList.splice(capturedPieceIndex, 1);
      gameEval += boardState[promotingSquare[0]][promotingSquare[1]].value;
    } else {
      let capturedPieceIndex = whitePieceList.indexOf(
        boardState[promotingSquare[0]][promotingSquare[1]].type
      );
      whitePieceList.splice(capturedPieceIndex, 1);
      gameEval -= boardState[promotingSquare[0]][promotingSquare[1]].value;
    }
  }

  if (currentPlayer === "white") {
    let pawnIndex = whitePieceList.indexOf("pawn");
    whitePieceList.splice(pawnIndex, 1);
    whitePieceList.push(type);
    gameEval--;
  } else {
    let pawnIndex = blackPieceList.indexOf("pawn");
    blackPieceList.splice(pawnIndex, 1);
    blackPieceList.push(type);
    gameEval++;
  }

  let piece = {
    type,
    color,
    sprite: `<img src="Pieces/${color}-${type}.svg">`,
    value,
  };

  if (piece.color === "white") {
    gameEval += piece.value;
  } else if (piece.color === "black") {
    gameEval -= piece.value;
  }

  updateEvalBar();

  boardState[promotingSquare[0]][promotingSquare[1]] = piece;
  boardState[selectedSquare[0]][selectedSquare[1]] = null;

  document
    .querySelector(`.${color}-promotion-selection`)
    .classList.add("hidden");

  renderBoard();

  if (currentPlayer === "white") {
    currentPlayer = "black";
  } else {
    currentPlayer = "white";
  }

  if (JSON.stringify(enPassantPossible) !== "[]") {
    enPassantPossible = [];
  }

  displayResult();

  if (
    (gameActive && gameMode === "play vs bot" && currentPlayer === botColor) ||
    (gameActive && gameMode === "bot vs bot")
  ) {
    playBotMove();
  }
}

function cancelPromotion(color) {
  document
    .querySelector(`.${color}-promotion-selection`)
    .classList.add("hidden");

  if (document.querySelector(".selected")) {
    document.querySelector(".selected").classList.remove("selected");
  }

  clearMoves();
}

function chooseResult(selectedResult) {
  let resultElement = document.querySelector(".result");
  if (selectedResult === "white resigns") {
    resultElement.innerHTML =
      '<div>Black Wins!</div><button class="result-new-game-button game-control-button">New Game</button>';
  } else if (selectedResult === "black resigns") {
    resultElement.innerHTML =
      '<div>White Wins!</div><button class="result-new-game-button game-control-button">New Game</button>';
  } else if (selectedResult === "draw") {
    resultElement.innerHTML =
      '<div>Draw!</div><button class="result-new-game-button game-control-button">New Game</button>';
  }
  document
    .querySelector(".result-new-game-button")
    .addEventListener("click", () => {
      setBoard();
      renderBoard();
      showStartMenu();
    });
  gameActive = false;
  resultElement.classList.remove("hidden");
}

function selectPlayerColor(color) {
  document.querySelector(".select-player-color-menu").classList.add("hidden");
  if (color === "white") {
    botColor = "black";
  } else {
    botColor = "white";
  }
  if (boardRotation !== color) {
    rotateBoard();
    renderBoard();
  }
  if (gameMode !== "bot vs bot") {
    gameMode = "play vs bot";
  }
  gameActive = true;
  if (color === "black" || gameMode === "bot vs bot") {
    playBotMove();
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function testCaller() {
  let depth = 1;
  while (depth <= 5) {
    console.log(`Depth: ${depth}`);
    console.time("moveGenerationTest");
    console.log(`Result: ${moveGenerationTest(depth)}`);
    console.timeEnd("moveGenerationTest");
    depth++;
  }
}

function moveGenerationTest(depth) {
  if (depth === 0) {
    return 1;
  }

  const moves = [];
  let pieceMoves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState[i][j]) {
        if (boardState[i][j].color === currentPlayer) {
          pieceMoves = generateMoves(i, j);
          for (let k = 0; k < pieceMoves.length; k++) {
            moves.push([[i, j], pieceMoves[k]]);
          }
        }
      }
    }
  }

  let numPositions = 0;

  moves.forEach((move) => {
    let saveBoardState = JSON.stringify(boardState);
    selectSquare(move[0][0], move[0][1]);
    selectSquare(move[1][0], move[1][1]);
    numPositions += moveGenerationTest(depth - 1);
    boardState = JSON.parse(saveBoardState);
  });

  return numPositions;
}

function updateEvalBar() {
  document.querySelector(".white-eval").style.height = `${
    50 + (gameEval / 39) * 100
  }%`;
  if (50 + (gameEval / 39) * 100 < 0) {
    document.querySelector(".white-eval").style.height = "0";
  }
  document.querySelector(".white-eval").innerHTML = `<div>${gameEval}</div>`;
}

function updateBotSpeed() {
  botSpeed = Number(document.querySelector(".bot-speed-input").value);
  document.querySelector(".bot-speed-input").value = "";
}

function playTestMove(startSquare, endSquare) {
  const s1 = startSquare[0];
  const s2 = startSquare[1];
  const d1 = endSquare[0];
  const d2 = endSquare[1];

  if (boardState[s1][s2].type === "king") {
    if (currentPlayer === "white") {
      if (s2 === 4 && d2 === 6) {
        boardState[7][5] = boardState[7][7];
        boardState[7][7] = null;
      }

      if (s2 === 4 && d2 === 2) {
        boardState[7][3] = boardState[7][0];
        boardState[7][0] = null;
      }
    } else {
      if (s2 === 4 && d2 === 6) {
        boardState[0][5] = boardState[0][7];
        boardState[0][7] = null;
      }

      if (s2 === 4 && d2 === 2) {
        boardState[0][3] = boardState[0][0];
        boardState[0][0] = null;
      }
    }
  }

  if (boardState[s1][s2].type === "pawn") {
    if (s2 !== d2 && !boardState[d1][d2]) {
      boardState[s1][d2] = null;
    }
  }

  let promoting = false;
  if (boardState[s1][s2].type === "pawn") {
    if (d1 === 0 && boardState[s1][s2].color === "white") {
      promoting = true;
      let piece = {
        type: "queen",
        color: "white",
        sprite: `<img src="Pieces/white-queen.svg">`,
        value: 9,
      };

      boardState[d1][d2] = piece;
      boardState[s1][s2] = null;
    } else if (d1 === 7 && boardState[s1][s2].color === "black") {
      promoting = true;
      let piece = {
        type: "queen",
        color: "black",
        sprite: `<img src="Pieces/black-queen.svg">`,
        value: 9,
      };

      boardState[d1][d2] = piece;
      boardState[s1][s2] = null;
    }
  }

  if (!promoting) {
    boardState[d1][d2] = boardState[s1][s2];
    boardState[s1][s2] = null;
  }
}

function startBotVsBot() {
  botOne = document.querySelector(".bot-1-selection").value;
  botTwo = document.querySelector(".bot-2-selection").value;
  botOneColor = "White";
  botTwoColor = "Black";
  whiteBot = botOne;
  blackBot = botTwo;
  document.querySelector(".start-game-menu").classList.add("hidden");
  document.querySelector(".select-bots-menu").classList.add("hidden");
  setBoard();
  renderBoard();
  gameMode = "bot vs bot";
  selectPlayerColor("white");
  document.querySelector(".scoreboard").innerHTML = `<div>
        <div><u>Bot 1</u></div>
        <div>${botOneColor}</div>
        <div>${botOneWins} Wins</div>
        <div>${botOne}</div>
      </div>
      <div>
        <div><u>Bot 2</u></div>
        <div>${botTwoColor}</div>
        <div>${botTwoWins} Wins</div>
        <div>${botTwo}</div>
      </div>
      <div>Draws: ${drawCount}</div>
      <input class="bot-speed-input" placeholder="Enter bot speed">`;
  document
    .querySelector(".bot-speed-input")
    .addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        updateBotSpeed();
      }
    });
}

function playBotMove() {
  let bestMove;
  if (gameMode === "play vs bot") {
    bestMove = thirdGenBot(botDepth)[0];
  } else {
    if (currentPlayer === "white") {
      if (whiteBot === "Gen 1") {
        bestMove = firstGenBot();
      } else if (whiteBot === "Gen 2") {
        bestMove = secondGenBot();
      } else if (whiteBot === "Gen 3") {
        bestMove = thirdGenBot(botDepth)[0];
      }
    } else {
      if (blackBot === "Gen 1") {
        bestMove = firstGenBot();
      } else if (blackBot === "Gen 2") {
        bestMove = secondGenBot();
      } else if (blackBot === "Gen 3") {
        bestMove = thirdGenBot(botDepth)[0];
      }
    }
  }
  sleep(botSpeed).then(() => selectSquare(bestMove[0][0], bestMove[0][1]));
  sleep(botSpeed).then(() => selectSquare(bestMove[1][0], bestMove[1][1]));
}

function firstGenBot() {
  const moves = [];
  let pieceMoves = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState[i][j]) {
        if (boardState[i][j].color === currentPlayer) {
          pieceMoves = generateMoves(i, j);
          for (let k = 0; k < pieceMoves.length; k++) {
            moves.push([[i, j], pieceMoves[k]]);
          }
        }
      }
    }
  }
  let move = moves[Math.floor(Math.random() * moves.length)];
  if (moves.length !== 0) {
    return move;
  }
}

function secondGenBot() {
  let pieceMoves;

  let bestMoves;
  let bestEval;
  if (currentPlayer === "white") {
    bestEval = -999;
  } else {
    bestEval = 999;
  }

  let evalChange;

  let d1;
  let d2;

  let saveBoardState;
  let saveEnPassantPossible;
  let moves;
  let gameResult;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState[i][j]) {
        if (boardState[i][j].color === currentPlayer) {
          pieceMoves = generateMoves(i, j);
          for (let k = 0; k < pieceMoves.length; k++) {
            d1 = pieceMoves[k][0];
            d2 = pieceMoves[k][1];

            saveBoardState = JSON.stringify(boardState);
            saveEnPassantPossible = enPassantPossible;
            enPassantPossible = [];
            playTestMove([i, j], [d1, d2]);
            if (currentPlayer === "white") {
              currentPlayer = "black";
            } else {
              currentPlayer = "white";
            }

            moves = [];
            gameResult = "";
            for (let a = 0; a < 8; a++) {
              for (let b = 0; b < 8; b++) {
                if (boardState[a][b]) {
                  if (boardState[a][b].color === currentPlayer) {
                    moves = generateMoves(a, b);
                    if (JSON.stringify(moves) !== "[]") {
                      gameResult = "continue";
                      break;
                    }
                  }
                }
              }
              if (gameResult === "continue") {
                break;
              }
            }

            if (gameResult !== "continue") {
              if (inCheck()) {
                gameResult = "checkmate";
              }
            }

            if (currentPlayer === "white") {
              currentPlayer = "black";
            } else {
              currentPlayer = "white";
            }
            enPassantPossible = saveEnPassantPossible;
            boardState = JSON.parse(saveBoardState);

            if (gameResult === "checkmate") {
              return [
                [i, j],
                [d1, d2],
              ];
            }

            evalChange = gameEval;
            if (boardState[d1][d2]) {
              if (currentPlayer === "white") {
                evalChange += boardState[d1][d2].value;
              } else {
                evalChange -= boardState[d1][d2].value;
              }
            }

            if (boardState[i][j].type === "pawn") {
              if (currentPlayer === "white") {
                if (j !== d2 && !boardState[d1][d2]) {
                  evalChange++;
                }
                if (d1 === 0) {
                  evalChange += 8;
                }
              } else {
                if (j !== d2 && !boardState[d1][d2]) {
                  evalChange--;
                }
                if (d1 === 7) {
                  evalChange -= 8;
                }
              }
            }

            if (currentPlayer === "white") {
              if (evalChange > bestEval) {
                bestEval = evalChange;
                bestMoves = [
                  [
                    [i, j],
                    [d1, d2],
                  ],
                ];
              } else if (evalChange === bestEval) {
                bestMoves.push([
                  [i, j],
                  [d1, d2],
                ]);
              }
            } else {
              if (evalChange < bestEval) {
                bestEval = evalChange;
                bestMoves = [
                  [
                    [i, j],
                    [d1, d2],
                  ],
                ];
              } else if (evalChange === bestEval) {
                bestMoves.push([
                  [i, j],
                  [d1, d2],
                ]);
              }
            }
          }
        }
      }
    }
  }
  let bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

  return bestMove;
}

function thirdGenBot(depth) {
  let pieceMoves;

  let bestMoves = [];
  let bestMove;
  let bestEval;
  if (currentPlayer === "white") {
    bestEval = -999;
  } else {
    bestEval = 999;
  }

  let evalChange;

  let d1;
  let d2;

  let saveBoardState;
  let saveEnPassantPossible;
  let moves;
  let gameResult;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (boardState[i][j]) {
        if (boardState[i][j].color === currentPlayer) {
          pieceMoves = generateMoves(i, j);
          for (let k = 0; k < pieceMoves.length; k++) {
            d1 = pieceMoves[k][0];
            d2 = pieceMoves[k][1];

            bestMove = [
              [i, j],
              [d1, d2],
            ];

            saveBoardState = JSON.stringify(boardState);
            saveEnPassantPossible = enPassantPossible;
            enPassantPossible = [];
            playTestMove([i, j], [d1, d2]);
            if (currentPlayer === "white") {
              currentPlayer = "black";
            } else {
              currentPlayer = "white";
            }

            moves = [];
            gameResult = "";
            for (let a = 0; a < 8; a++) {
              for (let b = 0; b < 8; b++) {
                if (boardState[a][b]) {
                  if (boardState[a][b].color === currentPlayer) {
                    moves = generateMoves(a, b);
                    if (JSON.stringify(moves) !== "[]") {
                      gameResult = "continue";
                      break;
                    }
                  }
                }
              }
              if (gameResult === "continue") {
                break;
              }
            }

            evalChange = 0;

            if (gameResult !== "continue") {
              if (inCheck()) {
                if (currentPlayer === "white") {
                  evalChange = -999;
                  depth = 1;
                } else {
                  evalChange = 999;
                  depth = 1;
                }
              } else {
                if (currentPlayer === "white") {
                  evalChange = 999;
                  depth = 1;
                } else {
                  evalChange = -999;
                  depth = 1;
                }
              }
            }

            if (currentPlayer === "white") {
              currentPlayer = "black";
            } else {
              currentPlayer = "white";
            }
            boardState = JSON.parse(saveBoardState);

            if (boardState[d1][d2]) {
              if (currentPlayer === "white") {
                evalChange += boardState[d1][d2].value;
              } else {
                evalChange -= boardState[d1][d2].value;
              }
            }

            if (boardState[i][j].type === "pawn") {
              if (currentPlayer === "white") {
                if (j !== d2 && !boardState[d1][d2]) {
                  evalChange++;
                }
                if (d1 === 0) {
                  evalChange += 8;
                }
              } else {
                if (j !== d2 && !boardState[d1][d2]) {
                  evalChange--;
                }
                if (d1 === 7) {
                  evalChange -= 8;
                }
              }
            }

            if (depth > 1) {
              playTestMove([i, j], [d1, d2]);
              if (currentPlayer === "white") {
                currentPlayer = "black";
              } else {
                currentPlayer = "white";
              }
              evalChange += thirdGenBot(depth - 1)[1];
              if (currentPlayer === "white") {
                currentPlayer = "black";
              } else {
                currentPlayer = "white";
              }
            }

            enPassantPossible = saveEnPassantPossible;
            boardState = JSON.parse(saveBoardState);

            if (currentPlayer === "white") {
              if (evalChange > bestEval) {
                bestEval = evalChange;
                bestMoves = [
                  [
                    [i, j],
                    [d1, d2],
                  ],
                ];
              } else if (evalChange === bestEval) {
                bestMoves.push([
                  [i, j],
                  [d1, d2],
                ]);
              }
            } else {
              if (evalChange < bestEval) {
                bestEval = evalChange;
                bestMoves = [
                  [
                    [i, j],
                    [d1, d2],
                  ],
                ];
              } else if (evalChange === bestEval) {
                bestMoves.push([
                  [i, j],
                  [d1, d2],
                ]);
              }
            }
          }
        }
      }
    }
  }

  if (bestMoves.length !== 0) {
    bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  return [bestMove, bestEval];
}

/* 
  Gen 1 VS Gen 1
  White Wins: 8
  Black Wins: 8
  Draws: 84 

  Gen 2 VS Gen 2
  Bot 1: 12 wins
  Bot 2: 11 wins
  Draws: 77

  Gen 2 VS Gen 1
  Gen 2: 90 wins
  Gen 1: 0 wins
  Draws: 10

  Gen 2 VS Gen 2
  Bot 1: 15 wins
  Bot 2: 14 wins
  Draws: 71

  Gen 3 VS Gen 1
  Gen 3: 100 wins
  Gen 1: 0 wins
  Draws 0

  Gen 3 VS Gen 2
  Gen 3: 100 wins
  Gen 2: 0 wins
  Draws: 0

  Gen 3 VS Gen 3
  Bot 1: 10 wins
  Bot 2: 9 wins
  Draws: 1
*/
