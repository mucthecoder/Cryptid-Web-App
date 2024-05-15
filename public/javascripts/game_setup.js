console.log("Waiting scripts started succesfully");
const username=sessionStorage.getItem("cryptid-game-username");
const goal=sessionStorage.getItem("cryptid-game-action");
const code=sessionStorage.getItem("cryptid-game-room-number");
const mode=sessionStorage.getItem("cryptid-game-mode");
const num_players = sessionStorage.getItem("cryptid-num-players");
const match_id = sessionStorage.getItem("cryptid-match-id");
let my_colour=sessionStorage.getItem("cryptid-my-colour");
let who=null;
let colors=["red", "green", "orange", "blue", "purple"];
console.log(`Username:${username}`);
console.log(`Goal:${goal}`);
console.log(`Room number:${code}`);
console.log(`Game mode:${mode}`);
console.log(`Number of Players:${num_players}`);
var socket = null;
if (goal=="local"){
    //local game
    sessionStorage.removeItem("cryptid-game-map-code");
    //remove it becaused you changed the way the map is set up for online games

}
else{
    socket = io();
    let temp=sessionStorage.getItem("cryptid-game-map-code");
    fetch(`../maps/${mode}/${temp}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        who=data;
    })
    .catch((error) => console.error("Error fetching JSON:", error));
    socket.on("identity", (identity) => {
        console.log("Received identity:", identity);
        socket.emit("reconnect",{username:username,colour:my_colour,action:goal,identity:match_id});
    });

    socket.on("another",(data)=>{
        console.log("another");
        console.log(data);
    });

    socket.on("others",(data)=>{
        console.log("others");
        console.log(data);
    });

    socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
    });
    socket.on("searcher",(data)=>{
        console.log(data);
        
    });

    socket.on("inits",(data)=>{
        console.log(data);

    });

    socket.on("quest",(data)=>{
        console.log(data);
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
    

}
function on_search(where){
    console.log("Searching");
    socket.emit("search",{colour:my_colour,name:username,cell:where});
}

function on_starter(where){
    console.log("starting negations");
    socket.emit("starter",{colour:my_colour,name:username,match:match_id,cell:where,why:goal});
}
function on_question(where,who){
    console.log("starting negations");
    socket.emit("question",{colour:my_colour,name:username,cell:where,target:who});
}

function on_response(where,what){
    console.log(`Responding: ${what}`);
    socket.emit("response",{colour:my_colour,name:username,match:match_id,cell:where,answer:what});
}

function on_cellClicked(cellClass,colour) {
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

