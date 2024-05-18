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
let search_array=[];
let u=document.getElementById("clues");
//this should be done if it's a local game
if (goal=="local"){
  for (let i=0;i<turnList.length;i++){
    let k=document.createElement("div");
    k.textContent=`Player ${i+1} Clue`
    k.addEventListener("click",()=>{
      something(i);
      
    });
    if (i<turnList.length-1){
      k.className="clue";
    }
    else{
      k.className="clue-final";
    }
    k.style.backgroundColor=turnList[i];
    u.appendChild(k);
  }
}
images = [];
turn = 0;
var initTurn = document.getElementsByClassName(turnList[turn]);
initTurn[0].style.backgroundColor="red";
let q=false;
let questioned="";
let questioner="";
let uhm="";
let bq=0;
var search_turn=0;
let search_count=0;
let searcher = "me";
let searching=false;
let questioning=false;

let on_round=0;

function something(w) {
  document.getElementById("clue-show").textContent = clues[w];
  if (w>=turnList.length-1) {
    document.getElementsByClassName("clue-final")[0].textContent="Hide Clue";
    document.getElementsByClassName("clue-final")[0].addEventListener("click",()=>{
      un_something(w);
    },{ once:true});
  }
  else{
    document.getElementsByClassName("clue")[w].textContent=`Hide clue`;
    document.getElementsByClassName("clue")[w].addEventListener("click",()=>{
      un_something(w);
    },{ once:true});
  }
}

function un_something(w) {
  document.getElementById("clue-show").textContent = `Press to show Clue`;
  if (w >= turnList.length-1) {
    document.getElementsByClassName("clue-final")[0].textContent=`Player ${w+1} Clue`;
    document.getElementsByClassName("clue-final")[0].addEventListener("click", () => {
      something(w);
    },{once:true});
  }
  else{
    document.getElementsByClassName("clue")[w].textContent=`Player ${w+1} Clue`;
    document.getElementsByClassName("clue")[w].addEventListener("click", () => {
      something(w);
    },{once:true});
  }
}

function nothing(what){
  console.log("stupid");
}

function cellClicked(cellClass) {
  var cells = document.getElementsByClassName(cellClass);
  var cell = cells[0];
  if (finished){
    console.log("Game is finished");
    return;
  }
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
  else if (wrong){
    console.log("false")
    console.log(`questioner:${questioner},turn:${turnList[turn]}`);
    var shapeDiv = createPiece("square");
    var classesArray = Array.from(cell.classList);
    var classToAdd = turnList[turn];
    
    if (!classesArray.includes("c"+classToAdd) && !classesArray.includes("neg")) {
      cell.classList.add("c"+turnList[turn]);
      cell.classList.add("neg");
      cell.classList.add("nred");
      //processTurn();
      cell.appendChild(shapeDiv);
    }
    wrong=false;
    if (questioning){done_question();}
    if (searching){done_search();}
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
    create_search();
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
function add_piece(what,where){
  let e=document.getElementsByClassName(`cell ${where}`)[0];
  e.replaceChildren(what);
  console.log(`Replaced ${what.tagName} at ${where}`)
}
function replace_with(what,where){
  let e=document.getElementsByClassName(`cell ${where}`)[0];
  for (let i=e.children.length-1;i>=0;i--){
    if (e.children[i].tagName=="DIV"&&e.children[i].style.backgroundColor=="black"){
      e.removeChild(e.children[i]);
    }
  }
  e.appendChild(what);
}

function search_mark(where){
  let he=createPiece("circle");
  append_piece(he,where);
}
function create_search(){
  search_array=[];
  let e=document.getElementsByClassName(`cell ${uhm}`)[0];
  console.log(e.tagName);
  
  for (let i=0;i<e.children.length;i++){
    if (e.children[i].tagName=="DIV"){
      search_array.push(e.children[i].style.backgroundColor);
    }
  }
    
  
  console.log(search_array);
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
      questioner=turnList[turn];
      console.log(`${questioned}, questioned by ${questioner}`);
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
    wrong=true;
    let h=createPiece("square");
    let r=document.getElementsByClassName(uhm)[0];
    r.addEventListener("mouseenter",()=>{
      r.style.backgroundColor="rgba(255, 0, 0, 0.4)";
    });
    r.onclick=nothing;
    h.style.backgroundColor=questioned;
    document.getElementById("butts").replaceChildren();
    replace_with(h,uhm);
    //done_question();
    console.log("it is i");
  });

  let two=document.createElement("span");
  two.style.width="40px";

  let three=document.createElement("button");
  three.className="circs";
  three.style.backgroundColor=questioned;
  three.addEventListener("click",()=>{
    console.log("accepting");
    let h=createPiece("circle");
    h.className="yep"
    h.style.backgroundColor=questioned;
    document.getElementById("butts").replaceChildren();
    replace_with(h,uhm);
    if (searching){done_search();}
    if (questioning){done_question();}
    
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
    wrong=true;
    let h=createPiece("square");
    let r=document.getElementsByClassName(uhm)[0];
    r.addEventListener("mouseenter",()=>{
      r.style.backgroundColor="rgba(255, 0, 0, 0.4)";
    });
    r.onclick=nothing;
    h.style.backgroundColor=turnList[search_turn]; 
    console.log("odd");
    document.getElementById("butts").replaceChildren();
    replace_with(h,uhm);
    console.log("after denying and replacing");
    
    //done_search();
    
  });

  let two=document.createElement("span");
  two.style.width="40px";

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

function start_question(){
  bq=turn;
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
  search_array=[];
  
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
  console.log("Processing turn");
  turn++;
  if (turn == turnList.length) {
    turn = 0;
    round++;
  }
  var prev = turn - 1;
  if (prev == -1) prev = turnList.length-1;
  //console.log(turn);
  var currentTurn = document.getElementsByClassName(turnList[turn]);
  currentTurn[0].style.backgroundColor = turnList[turn];
  var prevTurn = document.getElementsByClassName(turnList[prev]);
  prevTurn[0].style.backgroundColor = "";
}

function process_search_turn() {
  search_count++;
  console.log(`search count:${search_count}`);
  if (search_count==turnList.length){
    for(let i=0;i<turnList.length;i++){
      document.getElementsByClassName(turnList[i])[0].style.backgroundColor = "";
    }
    //console.log(`${searcher} wins:${search_count}`);
    document.getElementsByClassName(searcher)[0].style.backgroundColor = searcher;
    index = turnList.findIndex(car => car==searcher);
    finish_game(`Player ${index+1}`,searcher);
    return;
  }
  document.getElementById("butts").replaceChildren();
  search_turn++;
  //if turnlist[search] is not inside search array 
  //skip that mf so searchturn++
  if (inside(turnList[search_turn],search_array)){
    search_turn++;
    search_count++;
  }
  if (search_turn == turnList.length) {
    search_turn = 0;
  }
  
  let pre = search_turn - 1;
  if (pre == -1) pre = turnList.length-1;
  let currTurn = document.getElementsByClassName(turnList[search_turn]);
  currTurn[0].style.backgroundColor = turnList[search_turn];
  let preTurn = document.getElementsByClassName(turnList[pre]);
  preTurn[0].style.backgroundColor = "";
  load_possible_responses();
}

function finish_game(who,wha){
  console.log(`${who} wins!!!`);
  let s=document.createElement("h1");
  s.className="finisher";
  s.style.color=wha;
  s.textContent=`${who} wins!!!`;
  finished=true;
  document.getElementById("butts").replaceChildren(s);
}