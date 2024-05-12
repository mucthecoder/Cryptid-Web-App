//should implement the game rules and let us play, ideally
round = 0;
turnList = ["red", "green", "orange", "blue", "purple"];
images = [];
turn = 0;
var initTurn = document.getElementsByClassName(turnList[turn]);
initTurn[0].style.backgroundColor="red";

function cellClicked(cellClass) {
  var cells = document.getElementsByClassName(cellClass);
  var cell = cells[0];

  if (round < 2) {
    var shapeDiv = createPiece("square");
    var classesArray = Array.from(cell.classList);
    var classToAdd = turnList[turn];
    if (!classesArray.includes("c"+classToAdd) && !classesArray.includes("neg")) {
      cell.classList.add("c"+turnList[turn]);
      cell.classList.add("neg");
      cell.classList.add("nred");
      processTurn();
      cell.appendChild(shapeDiv);
    }
  }
}


function createPiece(shape) {
  var shapeDiv = document.createElement("div");
  shapeDiv.style.width = "15px"; // Adjust width as needed
  shapeDiv.style.height = "15px"; // Adjust height as needed
  shapeDiv.style.backgroundColor = turnList[turn];
  if (shape == "square") {
    shapeDiv.classList.add("square");
  } else {
    shapeDiv.classList.add("circle");
    shapeDiv.style.borderRadius = "50%";
  }
  return shapeDiv;
}

function processTurn() {
  turn++;
  if (turn == 5) {
    turn = 0;
    round++;
  }
  var prev = turn - 1;
  if (prev == -1) prev = 4;
  var currentTurn = document.getElementsByClassName(turnList[turn]);
  currentTurn[0].style.backgroundColor = turnList[turn];
  var prevTurn = document.getElementsByClassName(turnList[prev]);
  prevTurn[0].style.backgroundColor = "";
}
