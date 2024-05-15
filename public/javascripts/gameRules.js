//should implement the game rules and let us play, ideally
let num=sessionStorage.getItem("cryptid-num-players");
round = 0;
turnList = ["red", "green", "orange", "blue","purple"];
for (let i=turnList.length-1;i>num-1;i--){
  let g=turnList[i]
  console.log(g);
  let t=document.getElementsByClassName(g)[0];
  t.parentNode.removeChild(t);
  turnList.splice(i,1);
}
images = [];
turn = 0;
var initTurn = document.getElementsByClassName(turnList[turn]);
initTurn[0].style.backgroundColor="red";
let q=false;
let questioned="";
let uhm="";
let bq=0;
var search_turn=0;
let search_count=0;
let searcher = "me";
let searching=false;
let questioning=false;


function nothing(){
  console.log("stupid");
}

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
  else if(searching||questioning){
    console.log("Can't do that during a search");
  }
  else{
    uhm=cellClass;
    let e=document.getElementsByClassName(cellClass)[0];
    load_possible_actions();
    
  }
  
}

function load_possible_actions(){
  let one=document.createElement("button");
  one.className="actions";
  one.textContent="Question";
  one.addEventListener("click",()=>{
    console.log("Questioning");
    bq=turn;
    questioning=true;
    question_mark(uhm);
    load_question_options();
  });

  let two=document.createElement("span");
  two.style.width="10px";

  let three=document.createElement("button");
  three.className="actions";
  three.textContent="Search";
  three.addEventListener("click",()=>{
    console.log("Searching");
    bq=turn;
    searcher=turnList[turn];
    search_turn=turn;
    search_count=0;
    searching=true;
    search_mark(uhm);
    start_search();
    process_search_turn();

  });

  let four=document.getElementById("butts");
  four.replaceChildren();
  four.appendChild(one);
  four.appendChild(two);
  four.appendChild(three);

}

function inside(what,where){
  for (let i=0;i<where.length;i++){
    if (where[i]==what){
      return true;
    }
  }
  return false;
}

function append_piece(what,where){
  let e=document.getElementsByClassName(`cell ${where}`)[0];
  e.appendChild(what);
  console.log(`Appended ${what} to ${where}`)
}
function replace_with(what,where){
  let e=document.getElementsByClassName(`cell ${where}`)[0];
  e.replaceChildren(what);
  console.log(`Replaced ${what.tagName} at ${where}`)
}
function search_mark(where){
  let he=createPiece("circle");
  append_piece(he,where);
}
function start_search(){
  console.log("starting search");
  for (let i=0;i<turnList.length;i++){
    document.getElementsByClassName(turnList[i])[0].style.backgroundColor = "";
  }

}
//not suppose to replace structures
function question_mark(where){
  var he = document.createElement("div");
  he.style.width = "15px"; 
  he.style.height = "15px";
  he.classList.add("circle");
  he.style.borderRadius = "50%";
  he.style.backgroundColor="black";
  replace_with(he,where);
}
//shows options for questioning
function load_question_options(){
  let h=document.getElementById("butts");
  h.replaceChildren();
  for (let i=0;i<turnList.length;i++){
    if (turnList[turn]==turnList[i]){
      continue;
    }
    let r=document.createElement("div");
    r.className="circs";
    r.style.backgroundColor=turnList[i];
    r.textContent=`Player${i+1}`;
    r.addEventListener("click",()=>{
      questioned=r.style.backgroundColor;
      console.log(`${questioned}, questioned`);
      document.getElementById("butts").replaceChildren();
      load_possible_answers();
      start_quest();
    });
    let s=document.createElement("span");
    s.style.width="5px";
    h.appendChild(r);
    if (i<turnList.length-1){
      h.appendChild(s);
    }
  }
}

function change_turn(){
  let pn = document.getElementsByClassName(turnList[turn]);
  pn[0].style.backgroundColor = "";
  document.getElementsByClassName(questioned).style.backgroundColor=questioned;
}

function load_possible_answers(){
  let one=document.createElement("button");
  one.className="squares";
  one.style.backgroundColor=questioned;
  one.addEventListener("click",()=>{
    console.log("denying");
    let h=createPiece("square");
    let r=document.getElementsByClassName(uhm)[0];
    r.addEventListener("mouseenter",()=>{
      r.style.backgroundColor="rgba(255, 0, 0, 0.4)";
    });
    r.onclick=nothing;
    h.style.backgroundColor=questioned;
    replace_with(h,uhm);
    done_question();
  });

  let two=document.createElement("span");
  two.style.width="10px";

  let three=document.createElement("button");
  three.className="circs";
  three.style.backgroundColor=questioned;
  three.addEventListener("click",()=>{
    console.log("accepting");
    let h=createPiece("circle");
    h.className="yep"
    h.style.backgroundColor=questioned;
    replace_with(h,uhm);
    done_question();
    
  });

  let four=document.getElementById("butts");
  four.replaceChildren();
  four.appendChild(one);
  four.appendChild(two);
  four.appendChild(three);
}

function load_possible_responses(){
  let one=document.createElement("button");
  one.className="squares";
  one.style.backgroundColor=turnList[search_turn];
  one.addEventListener("click",()=>{
    console.log("denying");
    let h=createPiece("square");
    let r=document.getElementsByClassName(uhm)[0];
    r.addEventListener("mouseenter",()=>{
      r.style.backgroundColor="rgba(255, 0, 0, 0.4)";
    });
    r.onclick=nothing;
    h.style.backgroundColor=turnList[search_turn];
    replace_with(h,uhm);
    done_search();
    
  });

  let two=document.createElement("span");
  two.style.width="10px";

  let three=document.createElement("button");
  three.className="circs";
  three.style.backgroundColor=turnList[search_turn];
  three.addEventListener("click",()=>{
    console.log("accepting");
    let h=createPiece("circle");
    let r=document.getElementsByClassName(uhm)[0];
    r.addEventListener("mouseenter",()=>{
      r.style.backgroundColor="rgba(0, 255, 0, 0.4)";
    });
    h.style.backgroundColor=turnList[search_turn];
    append_piece(h,uhm);
    process_search_turn();
    
  });

  let four=document.getElementById("butts");
  four.replaceChildren();
  four.appendChild(one);
  four.appendChild(two);
  four.appendChild(three);
}

function start_quest(){
  for (let i=0;i<turnList.length;i++){
    document.getElementsByClassName(turnList[i])[0].style.backgroundColor = "";
  }
  //document.getElementsByClassName(questioned)[0].style.backgroundColor=questioned;
}
function done_question(){
  // for (let i=0;i<turnList.length;i++){
  //   document.getElementsByClassName(turnList[i])[0].style.backgroundColor = "";
  // }
  questioning=false;
  processTurn();
  document.getElementById("butts").replaceChildren();
  
}
function done_search(){
  for (let i=0;i<turnList.length;i++){
    document.getElementsByClassName(turnList[i])[0].style.backgroundColor = "";
  }
  processTurn();
  document.getElementById("butts").replaceChildren();
  searching=false;
  
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
  if (turn == turnList.length) {
    turn = 0;
    round++;
  }
  var prev = turn - 1;
  if (prev == -1) prev = turnList.length-1;
  var currentTurn = document.getElementsByClassName(turnList[turn]);
  currentTurn[0].style.backgroundColor = turnList[turn];
  var prevTurn = document.getElementsByClassName(turnList[prev]);
  prevTurn[0].style.backgroundColor = "";
}

function process_search_turn() {
  search_count++;
  if (search_count==turnList.length){
    console.log(`${searcher} wins`);
    return;
  }
  document.getElementById("butts").replaceChildren();
  search_turn++;
  if (search_turn == turnList.length) {
    search_turn = 0;
  }
  let pre = search_turn - 1;
  if (pre == -1) pre = 4;
  let currTurn = document.getElementsByClassName(turnList[search_turn]);
  currTurn[0].style.backgroundColor = turnList[search_turn];
  let preTurn = document.getElementsByClassName(turnList[pre]);
  preTurn[0].style.backgroundColor = "";
  load_possible_responses();
}
