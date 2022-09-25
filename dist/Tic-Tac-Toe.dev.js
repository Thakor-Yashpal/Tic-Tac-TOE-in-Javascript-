"use strict";

document.onkeypress = function (evt) {
  evt = evt || window.event;
  var modal = document.getElementsByClassName("modal")[0];

  if (evt.keyCode === 27) {
    modal.style.display = "none";
  }
};

window.onclick = function (evt) {
  var modal = document.getElementsByClassName("modal")[0];

  if (evt.target === modal) {
    modal.style.display = "none";
  }
};

function sumArray(array) {
  var sum = 0,
      i = 0;

  for (i = 0; i < array.length; i++) {
    sum += array[i];
  }

  return sum;
}

function isInArray(element, array) {
  if (array.indexOf(element) > -1) {
    return true;
  }

  return false;
}

function shuffleArray(array) {
  var counter = array.length,
      temp,
      index;

  while (counter > 0) {
    index = Math.floor(Math.random() * counter);
    counter--;
    temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function intRandom(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
} // GLOBAL VARIABLES


var moves = 0,
    winner = 0,
    x = 1,
    o = 3,
    player = x,
    computer = o,
    whoseTurn = x,
    gameOver = false,
    score = {
  ties: 0,
  player: 0,
  computer: 0
},
    xText = "<span class=\"x\">&times;</class>",
    oText = "<span class=\"o\">o</class>",
    playerText = xText,
    computerText = oText,
    difficulty = 1,
    myGrid = null;

function Grid() {
  this.cells = new Array(9);
}

Grid.prototype.getFreeCellIndices = function () {
  var i = 0,
      resultArray = [];

  for (i = 0; i < this.cells.length; i++) {
    if (this.cells[i] === 0) {
      resultArray.push(i);
    }
  }

  return resultArray;
};

Grid.prototype.getRowValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getRowValues!");
    return undefined;
  }

  var i = index * 3;
  return this.cells.slice(i, i + 3);
};

Grid.prototype.getRowIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getRowIndices!");
    return undefined;
  }

  var row = [];
  index = index * 3;
  row.push(index);
  row.push(index + 1);
  row.push(index + 2);
  return row;
}; // get a column (values)


Grid.prototype.getColumnValues = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnValues!");
    return undefined;
  }

  var i,
      column = [];

  for (i = index; i < this.cells.length; i += 3) {
    column.push(this.cells[i]);
  }

  return column;
}; // get a column (indices)


Grid.prototype.getColumnIndices = function (index) {
  if (index !== 0 && index !== 1 && index !== 2) {
    console.error("Wrong arg for getColumnIndices!");
    return undefined;
  }

  var i,
      column = [];

  for (i = index; i < this.cells.length; i += 3) {
    column.push(i);
  }

  return column;
}; // get diagonal cells
// arg 0: from top-left
// arg 1: from top-right


Grid.prototype.getDiagValues = function (arg) {
  var cells = [];

  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagValues!");
    return undefined;
  } else if (arg === 0) {
    cells.push(this.cells[0]);
    cells.push(this.cells[4]);
    cells.push(this.cells[8]);
  } else {
    cells.push(this.cells[2]);
    cells.push(this.cells[4]);
    cells.push(this.cells[6]);
  }

  return cells;
}; // get diagonal cells
// arg 0: from top-left
// arg 1: from top-right


Grid.prototype.getDiagIndices = function (arg) {
  if (arg !== 1 && arg !== 0) {
    console.error("Wrong arg for getDiagIndices!");
    return undefined;
  } else if (arg === 0) {
    return [0, 4, 8];
  } else {
    return [2, 4, 6];
  }
};

Grid.prototype.getFirstWithTwoInARow = function (agent) {
  if (agent !== computer && agent !== player) {
    console.error("Function getFirstWithTwoInARow accepts only player or computer as argument.");
    return undefined;
  }

  var sum = agent * 2,
      freeCells = shuffleArray(this.getFreeCellIndices());

  for (var _i = 0; _i < freeCells.length; _i++) {
    for (var _j = 0; _j < 3; _j++) {
      var rowV = this.getRowValues(_j);
      var rowI = this.getRowIndices(_j);
      var colV = this.getColumnValues(_j);
      var colI = this.getColumnIndices(_j);

      if (sumArray(rowV) == sum && isInArray(freeCells[_i], rowI)) {
        return freeCells[_i];
      } else if (sumArray(colV) == sum && isInArray(freeCells[_i], colI)) {
        return freeCells[_i];
      }
    }

    for (j = 0; j < 2; j++) {
      var diagV = this.getDiagValues(j);
      var diagI = this.getDiagIndices(j);

      if (sumArray(diagV) == sum && isInArray(freeCells[_i], diagI)) {
        return freeCells[_i];
      }
    }
  }

  return false;
};

Grid.prototype.reset = function () {
  for (var _i2 = 0; _i2 < this.cells.length; _i2++) {
    this.cells[_i2] = 0;
  }

  return true;
};

function initialize() {
  myGrid = new Grid();
  moves = 0;
  winner = 0;
  gameOver = false;
  whoseTurn = player; // default, this may change

  for (var _i3 = 0; _i3 <= myGrid.cells.length - 1; _i3++) {
    myGrid.cells[_i3] = 0;
  } // setTimeout(assignRoles, 500);


  setTimeout(showOptions, 500);
} // Ask player if they want to play as X or O. X goes first.


function assignRoles() {
  askUser("Do you want to go first?");
  document.getElementById("yesBtn").addEventListener("click", makePlayerX);
  document.getElementById("noBtn").addEventListener("click", makePlayerO);
}

function makePlayerX() {
  player = x;
  computer = o;
  whoseTurn = player;
  playerText = xText;
  computerText = oText;
  document.getElementById("userFeedback").style.display = "none";
  document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
  document.getElementById("noBtn").removeEventListener("click", makePlayerO);
}

function makePlayerO() {
  player = o;
  computer = x;
  whoseTurn = computer;
  playerText = oText;
  computerText = xText;
  setTimeout(makeComputerMove, 400);
  document.getElementById("userFeedback").style.display = "none";
  document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
  document.getElementById("noBtn").removeEventListener("click", makePlayerO);
} // executed when player clicks one of the table cells


function cellClicked(id) {
  var idName = id.toString();
  var cell = parseInt(idName[idName.length - 1]);

  if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
    // cell is already occupied or something else is wrong
    return false;
  }

  moves += 1;
  document.getElementById(id).innerHTML = playerText; // randomize orientation (for looks only)

  var rand = Math.random();

  if (rand < 0.3) {
    document.getElementById(id).style.transform = "rotate(180deg)";
  } else if (rand > 0.6) {
    document.getElementById(id).style.transform = "rotate(90deg)";
  }

  document.getElementById(id).style.cursor = "default";
  myGrid.cells[cell] = player; // Test if we have a winner:

  if (moves >= 5) {
    winner = checkWin();
  }

  if (winner === 0) {
    whoseTurn = computer;
    makeComputerMove();
  }

  return true;
}

function restartGame(ask) {
  if (moves > 0) {
    var response = confirm("Are you sure you want to start over?");

    if (response === false) {
      return;
    }
  }

  gameOver = false;
  moves = 0;
  winner = 0;
  whoseTurn = x;
  myGrid.reset();

  for (var i = 0; i <= 8; i++) {
    var id = "cell" + i.toString();
    document.getElementById(id).innerHTML = "";
    document.getElementById(id).style.cursor = "pointer";
    document.getElementById(id).classList.remove("win-color");
  }

  if (ask === true) {
    // setTimeout(assignRoles, 200);
    setTimeout(showOptions, 200);
  } else if (whoseTurn == computer) {
    setTimeout(makeComputerMove, 800);
  }
} // The core logic of the game AI:


function makeComputerMove() {
  // debugger;
  if (gameOver) {
    return false;
  }

  var cell = -1,
      myArr = [],
      corners = [0, 2, 6, 8];

  if (moves >= 3) {
    cell = myGrid.getFirstWithTwoInARow(computer);

    if (cell === false) {
      cell = myGrid.getFirstWithTwoInARow(player);
    }

    if (cell === false) {
      if (myGrid.cells[4] === 0 && difficulty == 1) {
        cell = 4;
      } else {
        myArr = myGrid.getFreeCellIndices();
        cell = myArr[intRandom(0, myArr.length - 1)];
      }
    } // Avoid a catch-22 situation:


    if (moves == 3 && myGrid.cells[4] == computer && player == x && difficulty == 1) {
      if (myGrid.cells[7] == player && (myGrid.cells[0] == player || myGrid.cells[2] == player)) {
        myArr = [6, 8];
        cell = myArr[intRandom(0, 1)];
      } else if (myGrid.cells[5] == player && (myGrid.cells[0] == player || myGrid.cells[6] == player)) {
        myArr = [2, 8];
        cell = myArr[intRandom(0, 1)];
      } else if (myGrid.cells[3] == player && (myGrid.cells[2] == player || myGrid.cells[8] == player)) {
        myArr = [0, 6];
        cell = myArr[intRandom(0, 1)];
      } else if (myGrid.cells[1] == player && (myGrid.cells[6] == player || myGrid.cells[8] == player)) {
        myArr = [0, 2];
        cell = myArr[intRandom(0, 1)];
      }
    } else if (moves == 3 && myGrid.cells[4] == player && player == x && difficulty == 1) {
      if (myGrid.cells[2] == player && myGrid.cells[6] == computer) {
        cell = 8;
      } else if (myGrid.cells[0] == player && myGrid.cells[8] == computer) {
        cell = 6;
      } else if (myGrid.cells[8] == player && myGrid.cells[0] == computer) {
        cell = 2;
      } else if (myGrid.cells[6] == player && myGrid.cells[2] == computer) {
        cell = 0;
      }
    }
  } else if (moves === 1 && myGrid.cells[4] == player && difficulty == 1) {
    // if player is X and played center, play one of the corners
    cell = corners[intRandom(0, 3)];
  } else if (moves === 2 && myGrid.cells[4] == player && computer == x && difficulty == 1) {
    // if player is O and played center, take two opposite corners
    if (myGrid.cells[0] == computer) {
      cell = 8;
    } else if (myGrid.cells[2] == computer) {
      cell = 6;
    } else if (myGrid.cells[6] == computer) {
      cell = 2;
    } else if (myGrid.cells[8] == computer) {
      cell = 0;
    }
  } else if (moves === 0 && intRandom(1, 10) < 8) {
    cell = corners[intRandom(0, 3)];
  } else {
    // choose the center of the board if possible
    if (myGrid.cells[4] === 0 && difficulty == 1) {
      cell = 4;
    } else {
      myArr = myGrid.getFreeCellIndices();
      cell = myArr[intRandom(0, myArr.length - 1)];
    }
  }

  var id = "cell" + cell.toString(); // console.log("computer chooses " + id);

  document.getElementById(id).innerHTML = computerText;
  document.getElementById(id).style.cursor = "default";
  var rand = Math.random();

  if (rand < 0.3) {
    document.getElementById(id).style.transform = "rotate(180deg)";
  } else if (rand > 0.6) {
    document.getElementById(id).style.transform = "rotate(90deg)";
  }

  myGrid.cells[cell] = computer;
  moves += 1;

  if (moves >= 5) {
    winner = checkWin();
  }

  if (winner === 0 && !gameOver) {
    whoseTurn = player;
  }
} // Check if the game is over and determine winner


function checkWin() {
  winner = 0; // rows

  for (var _i4 = 0; _i4 <= 2; _i4++) {
    var row = myGrid.getRowValues(_i4);

    if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
      if (row[0] == computer) {
        score.computer++;
        winner = computer; // console.log("computer wins");
      } else {
        score.player++;
        winner = player; // console.log("player wins");
      }

      var tmpAr = myGrid.getRowIndices(_i4);

      for (var _j2 = 0; _j2 < tmpAr.length; _j2++) {
        var str = "cell" + tmpAr[_j2];
        document.getElementById(str).classList.add("win-color");
      }

      setTimeout(endGame, 1000, winner);
      return winner;
    }
  } // columns


  for (i = 0; i <= 2; i++) {
    var col = myGrid.getColumnValues(i);

    if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
      if (col[0] == computer) {
        score.computer++;
        winner = computer;
      } else {
        score.player++;
        winner = player; // console.log("player wins");
      } // Give the winning row/column/diagonal a different bg-color


      var _tmpAr = myGrid.getColumnIndices(i);

      for (var _j3 = 0; _j3 < _tmpAr.length; _j3++) {
        var _str = "cell" + _tmpAr[_j3];

        document.getElementById(_str).classList.add("win-color");
      }

      setTimeout(endGame, 1000, winner);
      return winner;
    }
  } // diagonals


  for (i = 0; i <= 1; i++) {
    var diagonal = myGrid.getDiagValues(i);

    if (diagonal[0] > 0 && diagonal[0] == diagonal[1] && diagonal[0] == diagonal[2]) {
      if (diagonal[0] == computer) {
        score.computer++;
        winner = computer; // console.log("computer wins");
      } else {
        score.player++;
        winner = player;
      }

      var _tmpAr2 = myGrid.getDiagIndices(i);

      for (var _j4 = 0; _j4 < _tmpAr2.length; _j4++) {
        var _str2 = "cell" + _tmpAr2[_j4];

        document.getElementById(_str2).classList.add("win-color");
      }

      setTimeout(endGame, 1000, winner);
      return winner;
    }
  } // If we haven't returned a winner by now, if the board is full, it's a tie


  var myArr = myGrid.getFreeCellIndices();

  if (myArr.length === 0) {
    winner = 10;
    score.ties++;
    endGame(winner);
    return winner;
  }

  return winner;
}

function announceWinner(text) {
  document.getElementById("winText").innerHTML = text;
  document.getElementById("winAnnounce").style.display = "block";
  setTimeout(closeModal, 1400, "winAnnounce");
}

function askUser(text) {
  document.getElementById("questionText").innerHTML = text;
  document.getElementById("userFeedback").style.display = "block";
}

function showOptions() {
  if (player == o) {
    document.getElementById("rx").checked = false;
    document.getElementById("ro").checked = true;
  } else if (player == x) {
    document.getElementById("rx").checked = true;
    document.getElementById("ro").checked = false;
  }

  if (difficulty === 0) {
    document.getElementById("r0").checked = true;
    document.getElementById("r1").checked = false;
  } else {
    document.getElementById("r0").checked = false;
    document.getElementById("r1").checked = true;
  }

  document.getElementById("optionsDlg").style.display = "block";
}

function getOptions() {
  var diffs = document.getElementsByName('difficulty');

  for (var _i5 = 0; _i5 < diffs.length; _i5++) {
    if (diffs[_i5].checked) {
      difficulty = parseInt(diffs[_i5].value);
      break; // debugger;
    }
  }

  if (document.getElementById('rx').checked === true) {
    player = x;
    computer = o;
    whoseTurn = player;
    playerText = xText;
    computerText = oText;
  } else {
    player = o;
    computer = x;
    whoseTurn = computer;
    playerText = oText;
    computerText = xText;
    setTimeout(makeComputerMove, 400);
  }

  document.getElementById("optionsDlg").style.display = "none";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function endGame(who) {
  if (who == player) {
    announceWinner("Congratulations, you won!");
  } else if (who == computer) {
    announceWinner("Computer wins!");
  } else {
    announceWinner("It's a tie!");
  }

  gameOver = true;
  whoseTurn = 0;
  moves = 0;
  winner = 0;
  document.getElementById("computer_score").innerHTML = score.computer;
  document.getElementById("tie_score").innerHTML = score.ties;
  document.getElementById("player_score").innerHTML = score.player;

  for (var _i6 = 0; _i6 <= 8; _i6++) {
    var id = "cell" + _i6.toString();

    document.getElementById(id).style.cursor = "default";
  }

  setTimeout(restartGame, 800);
}
//# sourceMappingURL=Tic-Tac-Toe.dev.js.map
