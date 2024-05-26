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

const game_progress=[];
tilePos = [null, null, null, null, null, null];
var dict = {
  "forest_or_mountain": "The habitat is on forest or mountain",
  "forest_or_bone": "The habitat is on forest or swamp",
  "desert_or_mountain": "The habitat is on desert or mountain",
  "desert_or_bone": "The habitat is on desert or swamp",
  "forest_or_desert": "The habitat is on forest or desert",
  "mountain_or_bone": "The habitat is on mountain or swamp",
  "water_or_bone": "The habitat is on water or swamp",
  "water_or_desert": "The habitat is on water or desert",
  "water_or_forest": "The habitat is on water or forest",
  "water_or_mountain": "The habitat is on water or mountain",
  "within_water": "The habitat is within one space of water",
  "within_forest": "The habitat is within one space of forest",
  "within_desert": "The habitat is within one space of desert",
  "within_mountain": "The habitat is within one space of mountain",
  "within_bone": "The habitat is within one space of swamp",
  "within_fissure": "The habitat is within one space of either animal territory",
  "within_pyramid": "The habitat is within two spaces of a standing stone",
  "within_colony": "The habitat is within two spaces of a shack",
  "within_dormant_fissure": "The habitat is within two spaces of a bear territory",
  "within_active_fissure": "The habitat is within two spaces of a cougar territory",
  "within_green": "The habitat is within three spaces of a green structure",
  "within_red": "The habitat is within three spaces of a white structure",
  "within_blue": "The habitat is within three spaces of a blue structure",
  "within_black": "The habitat is within three spaces of a black structure",
  "not_forest_or_mountain": "The habitat is not on forest or mountain",
  "not_forest_or_bone": "The habitat is not on forest or swamp",
  "not_desert_or_mountain": "The habitat is not on desert or mountain",
  "not_desert_or_bone": "The habitat is not on desert or swamp",
  "not_forest_or_desert": "The habitat is not on forest or desert",
  "not_mountain_or_bone": "The habitat is not on mountain or swamp",
  "not_water_or_bone": "The habitat is not on water or swamp",
  "not_water_or_desert": "The habitat is not on water or desert",
  "not_water_or_forest": "The habitat is not on water or forest",
  "not_water_or_mountain": "The habitat is not on water or mountain",
  "not_within_water": "The habitat is not within one space of water",
  "not_within_forest": "The habitat is not within one space of forest",
  "not_within_desert": "The habitat is not within one space of desert",
  "not_within_mountain": "The habitat is not within one space of mountain",
  "not_within_bone": "The habitat is not within one space of swamp",
  "not_within_fissure": "The habitat is not within one space of either animal territory",
  "not_within_pyramid": "The habitat is not within two spaces of a standing stone",
  "not_within_colony": "The habitat is not within two spaces of a shack",
  "not_within_dormant_fissure": "The habitat is not within two spaces of a bear territory",
  "not_within_active_fissure": "The habitat is not within two spaces of a cougar territory",
  "not_within_green": "The habitat is not within three spaces of a green structure",
  "not_within_red": "The habitat is not within three spaces of a white structure",
  "not_within_blue": "The habitat is not within three spaces of a blue structure",
  "not_within_black": "The habitat is not within three spaces of a black structure",
  "hint_not_1": "There are no within 1 clues",
  "hint_water": "There are no clues which mention water",
  "hint_terrain": "There are no clues which mention terrain of any type",
  "hint_fissure": "There are no clues which mention animals",
  "hint_mountain": "There are no clues which mention mountain",
  "hint_forest": "There are no clues which mention forest",
  "hint_desert": "There are no clues which mention desert",
  "hint_bone": "There are no clues which mention swamp",
  "hint_not_2": "There are no within 2 clues",
  "hint_not_3": "There are no within 3 clues"
}

function drawIt(data) {
    try {
        //console.log(data.players);
        mapCodeValue = data.mapCode;
        game_progress.push({ mapCode: mapCodeValue });

        // Handle the number of players
        let num_players = 0;
        for (let i = 3; i < 6; i++) {
            if (i in data.players) {
                num_players = i;
                sessionStorage.setItem("cryptid-num-players", i);
            }
        }
        //console.log(num_players);
        // Ensure that destination and rules exist for the determined number of players
        if (!data.players || !data.players[num_players]) {
            throw new Error("Invalid player data");
        }

        dest = data.players[num_players][0].destination;
        clues = data.players[num_players][0].rules;
        //console.log(dict);
        for (let i = 0; i < clues.length; i++) {
          
          let h=dict[clues[i]];
          if (h){
            clues[i] = dict[clues[i]];
          }
          //console.log(clues[i]);
          
        }
        let g = { rules: clues };
        game_progress.push(g);

        // Transform map code value
        config = transformString(mapCodeValue);

        // Get canvas context and clear the canvas
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

        tilePos = [
            config[0],
            config[1],
            config[2],
            config[3],
            config[4],
            config[5],
        ];
        //console.log("done with drawIt, somewhat");

        // Load the images
        loadImages();
        //console.log("me");
    } catch (error) {
        alert("Invalid JSON"+error.message);
    }
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
  //console.log(substr);
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

function transformString2(str) {
  var substr = str.toString().slice(6);
  var transformed = [];
  //console.log(substr);
  for (var i = 0; i < substr.length; i++) {
    var char = substr[i];

    if (!isNaN(parseInt(char))) {
      transformed.push(parseInt(char));
    } else if (char === "A") {
      transformed.push(10);
    } else if (char === "B") {
      transformed.push(11);
    } else if (char === "C") {
      transformed.push(12);
    }
  }
  return transformed;
}

// Function to load images onto the canvas
function loadImages() {
  var imagesLoaded = 0;
    //console.log(imageUrls);
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
        //console.log("This is my ratio" + col * cellSize.width);
      }
      //console.log("incrementing");
      imagesLoaded++;
      if (imagesLoaded === imageUrls.length) {
        console.log("i passed");
        setUp();
        drawTowersAndShacks();
        //console.log("now i'm here");
      }
    };
  });
}

function drawTowersAndShacks() {
  // Draw towers and shacks on top of the board images
  // Example positions (8, 6) for towers and shacks
  //console.log("I got this far");
  coordinates = transformString2(mapCodeValue);
  //console.log(coordinates);
  if (coordinates.length == 12) {
    drawTower("tiles/s1.png", coordinates[0], coordinates[1]); // Replace "tower-image-url" with actual tower image URL
    drawTower("tiles/s2.png", coordinates[2], coordinates[3]); // Replace "tower-image-url" with actual tower image URL
    drawTower("tiles/s3.png", coordinates[4], coordinates[5]); // Replace "tower-image-url" with actual tower image URL
    drawShack("tiles/p1.png", coordinates[6], coordinates[7]); // Replace "shack-image-url" with actual shack image URL
    drawShack("tiles/p2.png", coordinates[8], coordinates[9]); // Replace "shack-image-url" with actual shack image URL
    drawShack("tiles/p3.png", coordinates[10], coordinates[11]); // Replace "shack-image-url" with actual shack image URL
  } else {
    drawTower("tiles/s1.png", coordinates[0], coordinates[1]); // Replace "tower-image-url" with actual tower image URL
    drawTower("tiles/s2.png", coordinates[2], coordinates[3]); // Replace "tower-image-url" with actual tower image URL
    drawTower("tiles/s3.png", coordinates[4], coordinates[5]); // Replace "tower-image-url" with actual tower image URL
    drawTower("tiles/s4.png", coordinates[6], coordinates[7]); // Replace "tower-image-url" with actual tower image URL
    drawShack("tiles/p1.png", coordinates[8], coordinates[9]); // Replace "shack-image-url" with actual shack image URL
    drawShack("tiles/p2.png", coordinates[10], coordinates[11]); // Replace "shack-image-url" with actual shack image URL
    drawShack("tiles/p3.png", coordinates[12], coordinates[13]); // Replace "shack-image-url" with actual shack image URL
    drawShack("tiles/p4.png", coordinates[14], coordinates[15]); // Replace "shack-image-url" with actual shack image URL
  }
  updateTitles();
}

function updateTitles() {
  // Loop through all cells and update their titles
  for (let col = 0; col < 12; col++) {
    for (let row = 0; row < 9; row++) {
      const cellClass = `${row},${col}`;
      const cells = document.getElementsByClassName(cellClass);
      const cellTitle = rcToString(row, col);
      var cell = cells[0];
      cell.title = cellTitle;
    }
  }
}


function drawTower(imgUrl, r, c) {
  addStructureToTitle(r,c, "tower");
  var img = new Image();
  img.src = imgUrl;
  img.style.width = "35%";
  img.style.aspectRatio = "1/1";
  img.onload = function () {
    // Construct the class name of the cell
    var cellClass = `${r},${c}`;
    // Find all cells with the specified class
    var cells = document.getElementsByClassName(cellClass);
    // Iterate over all found cells (in case there are multiple cells with the same class)
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      // Append the tower image to each found cell
      cell.appendChild(img);
    }
  };
}

function addStructureToTitle(r,c, structure){
  if(Math.floor(r/3)==0){
    if(Math.floor(c/6)==0) listOfAllTiles[config[0]][r%3][c%6]+=", "+structure;
    else listOfAllTiles[config[1]][r%3][c%6]+=", "+structure;
  } else if (Math.floor(r/3)==1){
    if(Math.floor(c/6)==0) listOfAllTiles[config[2]][r%3][c%6]+=", "+structure;
    else listOfAllTiles[config[3]][r%3][c%6]+=", "+structure;
  } else{
    if(Math.floor(c/6)==0) listOfAllTiles[config[4]][r%3][c%6]+=", "+structure;
    else listOfAllTiles[config[5]][r%3][c%6]+=", "+structure;
  }
  //console.log(listOfAllTiles[config[0]]);
}

function drawShack(imgUrl, r, c) {
  addStructureToTitle(r,c,"shack");
  //console.log("i am drawing shack");
  var img = new Image();
  img.src = imgUrl;
  img.style.width = "35%";
  img.style.aspectRatio = "1/1";
  img.onload = function () {
    // Construct the class name of the cell
    var cellClass = `${r},${c}`;
    // Find all cells with the specified class
    var cells = document.getElementsByClassName(cellClass);
    // Iterate over all found cells (in case there are multiple cells with the same class)
    for (var i = 0; i < cells.length; i++) {
      var cell = cells[i];
      // Append the tower image to each found cell
      cell.appendChild(img);
    }
  };
}
// Call the function to load images

function rcToString(r,c){
  //console.log("My config "+config[0])
  if(Math.floor(r/3)==0){
    if(Math.floor(c/6)==0) return listOfAllTiles[config[0]][r%3][c%6];
    else return listOfAllTiles[config[1]][r%3][c%6];
  } else if (Math.floor(r/3)==1){
    if(Math.floor(c/6)==0) return listOfAllTiles[config[2]][r%3][c%6];
    else return listOfAllTiles[config[3]][r%3][c%6];
  } else{
    if(Math.floor(c/6)==0) return listOfAllTiles[config[4]][r%3][c%6];
    else return listOfAllTiles[config[5]][r%3][c%6];
  }
}

// Add this code after defining the canvas and context variables

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
      
        cell.onclick = function () {
          cellClicked(`${row},${col}`);
          //on_starter(`${row},${col}`);
          // row//3 col//2
        };
      
      //cell.addEventListener("click",interact);
      cell.style.backgroundColor = "#80808000";
      hover(cell, row, col);
      column.appendChild(cell);
    }
    box.appendChild(column);
  }
}

function clearBox(elementID) {
  var box = document.getElementById(elementID);
  while (box.firstChild) {
    box.removeChild(box.firstChild);
  }
}

function hover(cell, r,c) {
  cell.addEventListener("mouseenter", function () {
    // Set background color with RGBA (red, green, blue, alpha) values only on hover
    // Example RGBA color (light blue with 50% opacity)
    var classesArray = Array.from(cell.classList);
    if (classesArray.includes("neg"))
      this.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
    else if(looking==false)this.style.backgroundColor = "rgba(0, 255, 0, 0.4)";
  });

  cell.addEventListener("mouseleave", function () {
    // Reset background color when mouse leaves
    if(looking==false || cell!=currentHex) this.style.backgroundColor = "rgba(128, 128, 128, 0)"; // Restore initial background color on mouse leave
  });
  cell.title = rcToString(r,c);
}

function custom_hover(cell, val) {
  //console.log(cell);
  cell.addEventListener("mouseenter", function () {
    if (val) this.style.backgroundColor = "rgba(255, 0, 0, 0.4)";
    else if(looking==false) this.style.backgroundColor = "rgba(0, 255, 0, 0.4)";
  });

  cell.addEventListener("mouseleave", function () {
    this.style.backgroundColor = "rgba(128, 128, 128, 0)";
  });
  cell.title = "cell";
}
