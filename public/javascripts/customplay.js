const cellImageArray = [null, null, null, null, null, null];
var mapCodeValue = 0,
  config = 0,
  clues,
  hint,
  dest,
  canvas,
  ctx,
  gridSize,
  cellSize,
  imageUrls;

goal = "local";
mode = "";
thingImage = [
  "s1.png",
  "s2.png",
  "s3.png",
  "s4.png",
  "p1.png",
  "p2.png",
  "p3.png",
  "p4.png",
];
counter = 0;
mapstring = "";
arrayOfEverything = [];

let spheJsonString =null;

document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll(".image-row img");
  const cells = document.querySelectorAll(".grid-cell");
  const imageRow = document.getElementById("image-row");
  const flipButton = document.getElementById("flip");

  // Set to track images currently in cells
  //const imagesInCells = new Set();

  // Function to handle drag start event
  images.forEach((img) => {
    img.addEventListener("dragstart", (e) => {
      console.log("Drag started:", e.target.id);
      e.dataTransfer.setData("text/plain", e.target.id);
    });
  });

  // Function to handle drag over event for grid cells
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("over");
    console.log("Drag over:", e.currentTarget.id);
  };

  // Function to handle drag leave event for grid cells
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("over");
    console.log("Drag leave:", e.currentTarget.id);
  };

  // Function to handle drop event for grid cells
  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("over");
    const imgId = e.dataTransfer.getData("text/plain");
    const img = document.getElementById(imgId);
    console.log("Dropped:", imgId, "into", e.currentTarget.id);
    if (img) {
      if (e.currentTarget.classList.contains("grid-cell")) {
        // Get the cell index
        const cellIndex = Array.from(cells).indexOf(e.currentTarget);
        if (e.currentTarget.children.length === 0) {
          // Clone the image and append it to the cell
          const clonedImg = img.cloneNode(true);
          clonedImg.id = imgId + "-clone";
          e.currentTarget.appendChild(clonedImg);

          // Update the tracking array and set
          //const prevCellIndex = cellImageArray.indexOf(imgId);
          // if (prevCellIndex !== -1) {
          //     //cellImageArray[prevCellIndex] = null;
          //     imagesInCells.delete(imgId);
          // }
          cellImageArray[cellIndex] = imgId;
          //imagesInCells.add(imgId);
        } else {
          console.log("Cell is not empty:", e.currentTarget.id);
        }
      } else {
        console.log("Dropping into an invalid area:", e.currentTarget.id);
        if (!e.currentTarget.classList.contains("image-row")) {
          // If image is dropped outside the cells, remove it
          const prevCellIndex = cellImageArray.indexOf(imgId);
          if (prevCellIndex !== -1) {
            cellImageArray[prevCellIndex] = null;
            imagesInCells.delete(imgId);
          }
          img.remove();
        }
      }
    } else {
      console.error("Image element not found for ID:", imgId);
    }
    console.log("Current cellImageArray:", cellImageArray);
  };

  // Add event listeners for grid cells
  cells.forEach((cell) => {
    cell.addEventListener("dragover", handleDragOver);
    cell.addEventListener("dragleave", handleDragLeave);
    cell.addEventListener("drop", handleDrop);
  });

  // Flip button functionality
  flipButton.addEventListener("click", () => {
    const firstSet = document.querySelectorAll(
      "#img0, #img1, #img2, #img3, #img4, #img5"
    );
    const secondSet = document.querySelectorAll(
      "#img6, #img7, #img8, #img9, #img10, #img11"
    );

    firstSet.forEach((img) => {
      if (true) {
        img.style.display = img.style.display === "none" ? "inline" : "none";
      }
    });

    secondSet.forEach((img) => {
      if (true) {
        img.style.display = img.style.display === "none" ? "inline" : "none";
      }
    });

    // Track the visibility state of the first set
    // const isFirstSetVisible = Array.from(firstSet).every(img => img.style.display !== 'none');
    // if (isFirstSetVisible) {
    //     firstSet.forEach(img => img.style.display = 'none');
    //     secondSet.forEach(img => img.style.display = 'inline');
    // } else {
    //     firstSet.forEach(img => img.style.display = 'inline');
    //     secondSet.forEach(img => img.style.display = 'none');
    // }
  });
});

function submitConfig() {
  console.log(cellImageArray);
  if (!cellImageArray.includes(null)) {
    cellImageArray.forEach((str) => {
      str = str.substring(3);
      if (parseInt(str) < 9) mapstring += parseInt(str) + 1;
      else if (str == "9") mapstring += "A";
      else if (str == "10") mapstring += "B";
      else if (str == "11") mapstring += "C";
    });
    console.log("here is the mapstring" + mapstring);

    document.getElementById("image-row").remove();
    document.getElementById("flip").remove();
    document.querySelector(".grid-container").remove();
    document.getElementById("submit-button").remove();

    drawIt2(mapstring);

    const introButton = createButton("Intro", introFunction);
    const normalButton = createButton("Normal", normalFunction);

    // Append the buttons to the buttons div
    document.getElementById("buttons").appendChild(introButton);
    document.getElementById("buttons").appendChild(normalButton);
  }
}

function createButton(text, clickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.onclick = clickHandler;
  return button;
}

function cellClicked(cellClass) {
  var cells = document.getElementsByClassName(cellClass);
  var cell = cells[0];
  if (counter != "done") {
    const img = document.createElement("img");
    img.src = "tiles/" + thingImage[counter];
    img.style.width = "20px";
    img.style.height = "20px";
    cell.appendChild(img);
    newcounter = processCounter();
    mapstring += processCellClass(cellClass);

    document.getElementById("buttons").innerHTML = "";
    console.log("here lies counter "+counter);
    if (counter != "done") {
      const img2 = document.createElement("img");
      img2.src = "tiles/" + thingImage[newcounter];
      img2.style.width = "50px";
      img2.style.height = "50px"; // Replace 'path/to/your/image.png' with the actual path to your image
      document.getElementById("buttons").appendChild(img2);
    } else {
      const textElement = document.createElement("p");
      textElement.textContent = "Pick destination";
      document.getElementById("buttons").appendChild(textElement);
    }
    console.log("mapstring so far" + mapstring);
  } else {
    addButtons();
    arrayOfEverything.push(mapstring);
    arrayOfEverything.push(mode);
    arrayOfEverything.push(cellClass);
  }
}

function customButtonClickHandler() {
  console.log("Download clicked");
  // Your code for the custom button click handler
  // Call the function defined elsewhere
  const inputs = document.querySelectorAll("#buttons input[type='text']");
  // Initialize an array to store the values

  // Iterate over each input and add its value to the array
  inputs.forEach((input) => {
    arrayOfEverything.push(input.value);
    // Clear the input value
    input.value = "";
  });

  // Log the array of values
  console.log("Values:", arrayOfEverything);

  // Extract values from inputs
  const mapCode = arrayOfEverything[0];
  const mode = arrayOfEverything[1];
  const destination = arrayOfEverything[2];
  const numberOfPlayers = arrayOfEverything[3];
  players = {};
  const rules = [];

  // Construct players object
  for (let i = 0; i < numberOfPlayers; i++) {
    rules.push(arrayOfEverything[4 + i]);
  }
  players = { [numberOfPlayers]: [{ destination, rules }] };

  // Construct final JSON object
  const customMap = {
    mapCode,
    mode,
    key: mapCode,
    players,
  };

  // Convert JSON to string
  const jsonString = JSON.stringify(customMap, null, 2);

  // Create a blob from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a URL for the blob
  const url = window.URL.createObjectURL(blob);

  // Create a link element to trigger the download
  const link = document.createElement("a");
  link.href = url;
  link.download = "custommap.json";
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Cleanup
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);

  console.log("Custom map JSON downloaded");
}

function playButtonClickHandler() {
  console.log("play clicked, saved json to variable spheJsonString");
  // Your code for the custom button click handler
  // Call the function defined elsewhere
  const inputs = document.querySelectorAll("#buttons input[type='text']");
  // Initialize an array to store the values

  // Iterate over each input and add its value to the array
  inputs.forEach((input) => {
    arrayOfEverything.push(input.value);
    // Clear the input value
    input.value = "";
  });

  // Log the array of values
  console.log("Values:", arrayOfEverything);

  // Extract values from inputs
  const mapCode = arrayOfEverything[0];
  const mode = arrayOfEverything[1];
  const destination = arrayOfEverything[2];
  const numberOfPlayers = arrayOfEverything[3];
  players = {};
  const rules = [];

  // Construct players object
  for (let i = 0; i < numberOfPlayers; i++) {
    rules.push(arrayOfEverything[4 + i]);
  }
  players = { [numberOfPlayers]: [{ destination, rules }] };

  // Construct final JSON object
  const customMap = {
    mapCode,
    mode,
    key: mapCode,
    players,
  };

  // Convert JSON to string
  spheJsonString = JSON.stringify(customMap, null, 2);
  console.log(spheJsonString);
  // Create a blob from the JSON string
  // const blob = new Blob([jsonString], { type: "application/json" });

  // // Create a URL for the blob
  // const url = window.URL.createObjectURL(blob);

  // // Create a link element to trigger the download
  // const link = document.createElement("a");
  // link.href = url;
  // link.download = "custommap.json";
  // document.body.appendChild(link);

  // // Trigger the download
  // link.click();

  // // Cleanup
  // document.body.removeChild(link);
  // window.URL.revokeObjectURL(url);

  // console.log("Custom map JSON downloaded");
}

function button3ClickHandler() {
  console.log("Button 3 clicked");
  // Your code for button 3 click handler
  arrayOfEverything.push(3);
  const buttonsDiv = document.getElementById("buttons");
  buttonsDiv.innerHTML = "";

  // Add three text inputs
  for (let i = 0; i < 3; i++) {
    const input = document.createElement("input");
    input.type = "text";
    buttonsDiv.appendChild(input);
  }

  // Add a button
  const customButton = document.createElement("button");
  customButton.textContent = "Download";
  customButton.onclick = customButtonClickHandler;
  buttonsDiv.appendChild(customButton);

  const playButton = document.createElement("button");
  playButton.textContent = "Play";
  playButton.onclick = playButtonClickHandler;
  buttonsDiv.appendChild(playButton);
}

function button4ClickHandler() {
  console.log("Button 4 clicked");
  // Your code for button 4 click handler
  arrayOfEverything.push(4);
  const buttonsDiv = document.getElementById("buttons");
  buttonsDiv.innerHTML = "";

  // Add three text inputs
  for (let i = 0; i < 4; i++) {
    const input = document.createElement("input");
    input.type = "text";
    buttonsDiv.appendChild(input);
  }

  // Add a button
  const customButton = document.createElement("button");
  customButton.textContent = "Download";
  customButton.onclick = customButtonClickHandler;
  buttonsDiv.appendChild(customButton);

  const playButton = document.createElement("button");
  playButton.textContent = "Play";
  playButton.onclick = playButtonClickHandler;
  buttonsDiv.appendChild(playButton);
}

function button5ClickHandler() {
  console.log("Button 5 clicked");
  // Your code for button 5 click handler
  arrayOfEverything.push(5);
  const buttonsDiv = document.getElementById("buttons");
  buttonsDiv.innerHTML = "";

  // Add three text inputs
  for (let i = 0; i < 5; i++) {
    const input = document.createElement("input");
    input.type = "text";
    buttonsDiv.appendChild(input);
  }

  // Add a button
  const customButton = document.createElement("button");
  customButton.textContent = "Donwload";
  customButton.onclick = customButtonClickHandler;
  buttonsDiv.appendChild(customButton);

  const playButton = document.createElement("button");
  playButton.textContent = "Play";
  playButton.onclick = playButtonClickHandler;
  buttonsDiv.appendChild(playButton);
}

function addButtons() {
  const buttonsDiv = document.getElementById("buttons");
  buttonsDiv.innerHTML = "";

  // Create and append buttons
  const button3 = createButton("3", button3ClickHandler);
  const button4 = createButton("4", button4ClickHandler);
  const button5 = createButton("5", button5ClickHandler);

  buttonsDiv.appendChild(button3);
  buttonsDiv.appendChild(button4);
  buttonsDiv.appendChild(button5);
}

function createButton(text, clickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.onclick = clickHandler;
  return button;
}

function processCellClass(cellClass) {
  // Split the string at the comma
  const [row, col] = cellClass.split(",");

  // Convert row and col to base 16
  const hexRow = parseInt(row).toString(16).toUpperCase();
  const hexCol = parseInt(col).toString(16).toUpperCase();

  // Concatenate row and col
  const result = hexRow + hexCol;

  return result;
}

function processCounter() {
  if (mode == "normal") {
    if (counter == 7) counter = "done";
    else counter++;
  } else {
    if (counter == 6) counter = "done";
    else if (counter != 2) counter++;
    else counter += 2;
  }
  return counter;
}

// Example functions to be defined elsewhere
function introFunction() {
  console.log("Intro button clicked");
  // Your intro function code here
  mode = "intro";
  document.getElementById("buttons").innerHTML = "";

  // Create and append an image element
  const img = document.createElement("img");
  img.src = "tiles/" + thingImage[0];
  img.style.width = "50px";
  img.style.height = "50px"; // Replace 'path/to/your/image.png' with the actual path to your image
  document.getElementById("buttons").appendChild(img);
}

function normalFunction() {
  console.log("Normal button clicked");
  // Your normal function code here
  mode = "normal";
  document.getElementById("buttons").innerHTML = "";

  // Create and append an image element
  const img = document.createElement("img");
  img.src = "tiles/" + thingImage[0];
  img.style.width = "50px";
  img.style.height = "50px"; // Replace 'path/to/your/image.png' with the actual path to your image
  document.getElementById("buttons").appendChild(img);
}

function drawIt2(str) {
  config = transformString(str);

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clearBox("box");

  // Define the grid layout
  gridSize = { rows: 3, cols: 2 };
  cellSize = {
    width: canvas.width / gridSize.cols,
    height: canvas.height / gridSize.rows,
  };

  // List of image URLs
  imageUrls = [
    "tiles/" + config[0] + ".png",
    "tiles/" + config[1] + ".png",
    "tiles/" + config[2] + ".png",
    "tiles/" + config[3] + ".png",
    "tiles/" + config[4] + ".png",
    "tiles/" + config[5] + ".png",
  ];

  loadImages();
}

function transformString(str) {
  var substr = str.toString().slice(0, 6);
  var transformed = [];
  console.log(substr);
  for (var i = 0; i < substr.length; i++) {
    var char = substr[i];

    if (!isNaN(parseInt(char))) {
      transformed.push(parseInt(char) - 1);
    } else if (char === "A") {
      transformed.push(9);
    } else if (char === "B") {
      transformed.push(10);
    } else if (char === "C") {
      transformed.push(11);
    }
  }
  return transformed;
}

function loadImages() {
  var imagesLoaded = 0;

  imageUrls.forEach(function (url, index) {
    var img = new Image();
    img.src = url;
    img.onload = function () {
      var row = Math.floor(index / gridSize.cols);
      var col = index % gridSize.cols;

      if (index == 2 || index == 3) {
        ctx.drawImage(
          img,
          col * cellSize.width - (index % 2 == 0 ? 0 : 14),
          row * cellSize.height - 28,
          cellSize.width,
          cellSize.height
        );
      } else if (index == 4 || index == 5) {
        ctx.drawImage(
          img,
          col * cellSize.width - (index % 2 == 0 ? 0 : 14),
          row * cellSize.height - 56,
          cellSize.width,
          cellSize.height
        );
      } else {
        ctx.drawImage(
          img,
          col * cellSize.width - (index % 2 == 0 ? 0 : 14),
          row * cellSize.height,
          cellSize.width,
          cellSize.height
        );
        console.log("This is my ratio" + col * cellSize.width);
      }

      imagesLoaded++;
      if (imagesLoaded === imageUrls.length) {
        console.log("i passed");
        setUp();
        //drawTowersAndShacks();
        console.log("now i'm here");
      }
    };
  });
}

function clearBox(elementID) {
  var box = document.getElementById(elementID);
  while (box.firstChild) {
    box.removeChild(box.firstChild);
  }
}

function setUp() {
  const box = document.getElementById("box");

  for (let col = 0; col < 12; col++) {
    const column = document.createElement("div");
    column.classList.add("column");
    if (Number(col + 1) % 2 == 0) {
      column.classList.add("cdown-2");
    }
    for (let row = 0; row < 9; row++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.classList.add(`${row},${col}`);
      if (goal == "local") {
        cell.onclick = function () {
          cellClicked(`${row},${col}`);
          //on_starter(`${row},${col}`);
        };
      } else {
        cell.onclick = function () {
          //cellClicked(`${row},${col}`);
          on_starter(`${row},${col}`);
        };
      }
      //cell.addEventListener("click",interact);
      cell.style.backgroundColor = "#80808000";
      hover(cell);
      column.appendChild(cell);
    }
    box.appendChild(column);
  }
}

function hover(cell) {
  cell.addEventListener("mouseenter", function () {
    // Set background color with RGBA (red, green, blue, alpha) values only on hover
    // Example RGBA color (light blue with 50% opacity)
    var classesArray = Array.from(cell.classList);
    if (classesArray.includes("neg"))
      this.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
    else this.style.backgroundColor = "rgba(0, 255, 0, 0.4)";
  });

  cell.addEventListener("mouseleave", function () {
    // Reset background color when mouse leaves
    this.style.backgroundColor = "rgba(128, 128, 128, 0)"; // Restore initial background color on mouse leave
  });
}

function custom_hover(cell, val) {
  console.log(cell);
  cell.addEventListener("mouseenter", function () {
    if (val) this.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
    else this.style.backgroundColor = "rgba(0, 255, 0, 0.4)";
  });

  cell.addEventListener("mouseleave", function () {
    this.style.backgroundColor = "rgba(128, 128, 128, 0)";
  });
}
