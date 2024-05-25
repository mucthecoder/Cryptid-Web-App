//should implement the game rules and let us play, ideally

currentHex=null;
looking=false;

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
  game_start(turnList[0]);
}
else{
  let k=document.createElement("div");
  k.textContent=`View My Clue`;
  k.className="master-clue";
  k.style.backgroundColor=my_colour;
  //well();
  //document.getElementById("clues").appendChild(k);
  on_game_start(turnList[0]);
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
function well(){
  let bhari=turnList.findIndex(car=>car==my_colour);
  console.log(bhari);
  document.getElementById("clue-show").textContent=clues[bhari];
}

function do_it(){
  //console.log("calling do it");
  let bhari=turnList.findIndex(car=>car==my_colour);
  console.log(bhari);
  document.getElementById("clue-show").textContent=clues[bhari];
  document.getElementsByClassName("master-clue")[0].textContent="Hide My Clue";
  document.getElementsByClassName("master-clue")[0].addEventListener("click", () => {
    undo_it();
  },{once:true});
}

function undo_it(){
  //console.log("calling undo it");
  document.getElementById("clue-show").textContent = `Press to show Clue`;
  document.getElementsByClassName("master-clue")[0].textContent="View My Clue";
  document.getElementsByClassName("master-clue")[0].addEventListener("click", () => {
    do_it();
  },{once:true});
}
function nothing(what){
  console.log("stupid");
}

function splitting(clue_word, count){
  // let clue = "The habitat is within two spaces of a blue shack";
  let words = clue_word.split(" ");
  let result = [];

  // Push the first 8 words as individual elements
  for (let i = 0; i < count; i++) {
    result.push(words[i]);
  }

  // Combine the remaining words into the last element
  result.push(words.slice(count).join(" "));

  return result;
}


function cellClicked(cellClass) {
  var cells = document.getElementsByClassName(cellClass);
  var cell = cells[0];
  if (finished){
    console.log("Game is finished");
    return;
  }

  if (round < 2) {
// ================================================================================================================================
// ================================================================================================================================
// ================================================================================================================================
// ================================================================================================================================
  // console.log("============================================================");
  // Helper function to check adjacent cells
  function checkAdjacent(r, c,withinFeature) {
    if (r < 0 || r > 8 || c < 0 || c > 11) return false;
    let cell = document.getElementsByClassName(`${r},${c}`)[0];
    // console.log(cell, withinFeature,cell.getAttribute("title").toLowerCase().includes(withinFeature));
    // cell.style.backgroundColor = "black";
    return cell && cell.getAttribute("title").toLowerCase().includes(withinFeature);
  }

  // Define the six directions in a hexagonal grid (clockwise)
  const directionsU = [
    { dr: -1,  dc: 0  },
    { dr: 0 ,  dc: -1  }, 
    { dr: 1 ,  dc: -1  }, 
    { dr: 1 ,  dc: 0 },
    { dr: 1 ,  dc: 1 },
    { dr: 0 ,  dc: 1  },

    // for down U
    { dr:-2, dc:  0 },
    { dr:-1, dc: -1 }, 
    { dr:-1, dc: -2 }, 
    { dr: 0, dc: -2 },
    { dr: 1, dc: -2 },
    { dr: 2, dc: -1 },
    { dr: 2, dc:  0 },
    { dr: 2, dc:  1 }, 
    { dr: 1, dc:  2 }, 
    { dr: 0, dc:  2 },
    { dr:-1, dc:  2 },
    { dr:-1, dc:  1 },

    { dr: -3, dc: 0 },   // up 3
    { dr: -2, dc: -1 },  // up 2, left 1
    { dr: -1, dc: -2 },  // up 1, left 2
    { dr: 0, dc: -3 },   // left 3
    { dr: 1, dc: -3 },   // down 1, left 3
    { dr: 2, dc: -2 },   // down 2, left 2
    { dr: 3, dc: -1 },   // down 3, left 1
    { dr: 3, dc: 0 },    // down 3
    { dr: 3, dc: 1 },    // down 3, right 1
    { dr: 2, dc: 2 },    // down 2, right 2
    { dr: 1, dc: 3 },    // down 1, right 3
    { dr: 0, dc: 3 },    // right 3
    { dr: -1, dc: 3 },   // up 1, right 3
    { dr: -2, dc: 2 },   // up 2, right 2
    { dr: -3, dc: 1 },   // up 3, right 1
    { dr: -3, dc: -1 },  // up 3, left 1
    { dr: -2, dc: -2 },  // up 2, left 2
    { dr: -1, dc: -3 }   // up 1, left 3
  ];

  const directions = [
    { dr: -1,  dc: 0  },
    { dr: -1 ,  dc: -1  }, 
    { dr: 0 ,  dc: -1  }, 
    { dr: 1 ,  dc: 0 },
    { dr: 0 ,  dc: 1 },
    { dr: -1 ,  dc: 1  },
    // for down 
    { dr: -2 ,  dc:  0  },
    { dr: -2 ,  dc: -1  }, 
    { dr: -1 ,  dc: -2  }, 
    { dr:  0 ,  dc: -2  },
    { dr:  1 ,  dc: -2  },
    { dr:  1 ,  dc: -1  },
    { dr:  2 ,  dc:  0  },
    { dr:  1 ,  dc:  1  }, 
    { dr:  1 ,  dc:  2  }, 
    { dr:  0 ,  dc:  2  },
    { dr: -1 ,  dc:  2  },
    { dr: -2 ,  dc:  1  },

  ];

  const index = colors.findIndex(temp => temp == turnList[turn]);
  let clue = clues[index];
  let tag = document.getElementsByClassName(cellClass)[0];
  let hegot = tag.getAttribute("title");

  // Check if the title matches the clue
  if(clue.includes("The habitat is on ")){
    if (hegot.toLowerCase().includes(clue.split(" ")[4].toLowerCase())  || hegot.toLowerCase().includes(clue.split(" ")[6].toLowerCase())) {
      alert("Invalid move to insert on a negative");
      return;
    }
  }
  // Check if the clue involves being within one space of something
  if (clue.includes("The habitat is within one space of ")) {
    // console.log(splitting(clue,7));
    let withinFeature = splitting(clue,8)[7].toLowerCase();
    let r = Number(tag.classList[1].split(",")[0]);
    let c = Number(tag.classList[1].split(",")[1]);
    if (hegot.toLowerCase().includes(withinFeature)) {
      alert("Invalid move to insert on a negative");
      return;
    }
 
    let anyTrue = false;
    // console.log(document.getElementsByClassName(`${r},${c}`)[0]);

    // Check adjacent cells in each direction
    let to_use;
    if((c + 1)%2 == 0){
      to_use = directionsU;
    }
    else{
      to_use = directions;
    }
    for (let i = 0; i < 6; i++) {
      let dir = to_use[i];
      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }
    if (anyTrue) {
      alert("Invalid move to insert on a negative");
      return;
    }
   
  }
  // The habitat is within two spaces of a something
  if (clue.includes("The habitat is within two spaces of a ")) {
    // console.log(splitting(clue,8));
    let withinFeature = splitting(clue,8)[8].toLowerCase();
    let r = Number(tag.classList[1].split(",")[0]);
    let c = Number(tag.classList[1].split(",")[1]);
    if (hegot.toLowerCase().includes(splitting(clue,8)[8].toLowerCase())) {
      alert("Invalid move to insert on a negative");
      return;
    }

    let anyTrue = false;
    // console.log(document.getElementsByClassName(`${r},${c}`)[0]);

    // Check adjacent cells in each direction
    let to_use;
    if((c + 1)%2 == 0){
      to_use = directionsU;
    }
    else{
      to_use = directions;
    }
    for (let i = 0; i < 6; i++) {
      let dir = to_use[i];

      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }
    if (anyTrue) {
    alert("Invalid move to insert on a negative");
      return;
    }

   // Check adjacent cells up to 2 spaces away in each direction
    for (let i = 6; i < 18; i++) {
      let dir = to_use[i];
      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }
    if (anyTrue) {
    alert("Invalid move to insert on a negative");
      return;
    }
  }
  // The habitat is within two spaces of a something
  if (clue.includes("The habitat is within three spaces of a ")) {
    // console.log(splitting(clue,8));
    let withinFeature = splitting(clue,8)[8].toLowerCase();
    let r = Number(tag.classList[1].split(",")[0]);
    let c = Number(tag.classList[1].split(",")[1]);
    if (hegot.toLowerCase().includes(splitting(clue,8)[8].toLowerCase())) {
      alert("Invalid move to insert on a negative");
      return;
    }

    let anyTrue = false;
    // console.log(document.getElementsByClassName(`${r},${c}`)[0]);

    // Check adjacent cells in each direction
    let to_use;
    if((c + 1)%2 == 0){
      to_use = directionsU;
    }
    else{
      to_use = directions;
    }
    for (let i = 0; i < 6; i++) {
      let dir = to_use[i];

      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }
    if (anyTrue) {
    alert("Invalid move to insert on a negative");
      return;
    }
    // Check adjacent cells up to 2 spaces away in each direction
    for (let i = 6; i < 18; i++) {
      let dir = to_use[i];
      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }

    if (anyTrue) {
      alert("Invalid move to insert on a negative");
      return;
    }

  // Check adjacent cells up to 3 spaces away in each direction
  // for (let i = 18; i < 36; i++) {
  //   let dir = directionsU[i];//to_use[i];
  //   if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
  //     anyTrue = true;
  //     // break; // If any adjacent cell is true, no need to continue checking
  //   }
  // }

  // if (anyTrue) {
  //   alert("2.4 = Invalid move to insert on a negative");
  //   return;
  // }

  }

  // ========not=================

  // Check if the title matches the clue
  if(clue.includes("The habitat is not on ")){
    if (!hegot.toLowerCase().includes(clue.split(" ")[4].toLowerCase())  && !hegot.toLowerCase().includes(clue.split(" ")[6].toLowerCase())) {
      alert("Invalid move to insert on a negative");
      return;
    }
  }
  // Check if the clue involves being within one space of something
  if (clue.includes("The habitat is not within one space of ")) {
    // console.log(splitting(clue,7));
    let withinFeature = splitting(clue,8)[7].toLowerCase();
    let r = Number(tag.classList[1].split(",")[0]);
    let c = Number(tag.classList[1].split(",")[1]);
    if (!hegot.toLowerCase().includes(withinFeature)) {
      alert("Invalid move to insert on a negative");
      return;
    }
  
    let anyTrue = false;
    // console.log(document.getElementsByClassName(`${r},${c}`)[0]);

    // Check adjacent cells in each direction
    let to_use;
    if((c + 1)%2 == 0){
      to_use = directionsU;
    }
    else{
      to_use = directions;
    }
    for (let i = 0; i < 6; i++) {
      let dir = to_use[i];
      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }
    if (!anyTrue) {
      alert("Invalid move to insert on a negative");
      return;
    }
    
  }
  // The habitat is not within two spaces of a something
  if (clue.includes("The habitat is not within two spaces of a ")) {
    // console.log(splitting(clue,8));
    let withinFeature = splitting(clue,8)[8].toLowerCase();
    let r = Number(tag.classList[1].split(",")[0]);
    let c = Number(tag.classList[1].split(",")[1]);
    if (!hegot.toLowerCase().includes(splitting(clue,8)[8].toLowerCase())) {
      alert("Invalid move to insert on a negative");
      return;
    }

    let anyTrue = false;
    // console.log(document.getElementsByClassName(`${r},${c}`)[0]);

    // Check adjacent cells in each direction
    let to_use;
    if((c + 1)%2 == 0){
      to_use = directionsU;
    }
    else{
      to_use = directions;
    }
    for (let i = 0; i < 6; i++) {
      let dir = to_use[i];

      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }
    if (!anyTrue) {
      alert("Invalid move to insert on a negative");
      return;
    }

    // Check adjacent cells up to 2 spaces away in each direction
    for (let i = 6; i < 18; i++) {
      let dir = to_use[i];
      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }
    if (!anyTrue) {
      alert("Invalid move to insert on a negative");
      return;
    }
  }
  // The habitat is not within two spaces of a something
  if (clue.includes("The habitat is not within three spaces of a ")) {
    // console.log(splitting(clue,8));
    let withinFeature = splitting(clue,8)[8].toLowerCase();
    let r = Number(tag.classList[1].split(",")[0]);
    let c = Number(tag.classList[1].split(",")[1]);
    if (!hegot.toLowerCase().includes(splitting(clue,8)[8].toLowerCase())) {
      alert("Invalid move to insert on a negative");
      return;
    }

    let anyTrue = false;
    // console.log(document.getElementsByClassName(`${r},${c}`)[0]);

    // Check adjacent cells in each direction
    let to_use;
    if((c + 1)%2 == 0){
      to_use = directionsU;
    }
    else{
      to_use = directions;
    }
    for (let i = 0; i < 6; i++) {
      let dir = to_use[i];

      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }
    if (!anyTrue) {
    alert("Invalid move to insert on a negative");
      return;
    }
    // Check adjacent cells up to 2 spaces away in each direction
    for (let i = 6; i < 18; i++) {
      let dir = to_use[i];
      if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
        anyTrue = true;
        break; // If any adjacent cell is true, no need to continue checking
      }
    }

    if (!anyTrue) {
      alert("Invalid move to insert on a negative");
      return;
    }

  // Check adjacent cells up to 3 spaces away in each direction
  // for (let i = 18; i < 36; i++) {
  //   let dir = directionsU[i];//to_use[i];
  //   if (checkAdjacent(r + dir.dr, c + dir.dc,withinFeature)) {
  //     anyTrue = true;
  //     // break; // If any adjacent cell is true, no need to continue checking
  //   }
  // }

  // if (anyTrue) {
  //   alert("2.4 = Invalid move to insert on a negative");
  //   return;
  // }

  }



  // console.log("============================================================");
 // ================================================================================================================================
 // ================================================================================================================================
 // ================================================================================================================================
 // ================================================================================================================================

    var shapeDiv = createPiece("square");
    var classesArray = Array.from(cell.classList);
    var classToAdd = turnList[turn];
    negate(turnList[turn],cellClass);
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
    negate(turnList[turn],cellClass);
    wrong=false;
    
    if (questioning){done_question();}
    if (searching){done_search();}
  }
  else if(searching||questioning){
    console.log("Can't do that during a search");
  }
  else if(looking==false){
    uhm=cellClass;
    let e=document.getElementsByClassName(cellClass)[0];
    load_possible_actions();
    looking=true;
    currentHex=cell;
    currentHex.style.backgroundColor='rgba(0,0,0,0.7)';
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
    looking=true;
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
    looking=true;
    create_search();
    search_mark(uhm);
    start_search();
    process_search_turn();
    append_search(searcher,uhm);
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
  he.style.width = "20%"; 
  he.style.height = "20%";
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
      //document.getElementById("notifier").textContent=`${capitalizeFirstLetter(questioned)}, questioned by ${capitalizeFirstLetter(questioner)}`;
      append_question(questioner,questioned,uhm);
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
    append_answer(questioned,uhm,"N");
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
    append_answer(questioned,uhm,"Y");
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
    append_answer(turnList[search_turn],uhm,"N");
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
      if(looking==false)
      r.style.backgroundColor="rgba(0, 255, 0, 0.4)";
    });
    h.style.backgroundColor=turnList[search_turn];
    append_piece(h,uhm);
    append_answer(turnList[search_turn],uhm,"Y");
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
  looking=false;
  currentHex.style.backgroundColor='';
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
  looking=false;
  currentHex.style.backgroundColor='';
  search_array=[];
  
}

function createPiece(shape) {
  var shapeDiv = document.createElement("div");
  shapeDiv.style.width = "25%"; // Adjust width as needed
  shapeDiv.style.aspectRatio= "1/1"; // Adjust height as needed
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
  
  if (turnList[turn]==my_colour){
    document.getElementById("notifier").textContent=`Your Turn`;
  }
  else{
    document.getElementById("notifier").textContent=`${capitalizeFirstLetter(turnList[turn])}'s Turn`;
  }
  var currentTurn = document.getElementsByClassName(turnList[turn]);
  currentTurn[0].style.backgroundColor = turnList[turn];
  var prevTurn = document.getElementsByClassName(turnList[prev]);
  prevTurn[0].style.backgroundColor = "";
}
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function process_search_turn() {
  search_count++;
  console.log(`search count:${search_count}`);
  if (search_count==turnList.length){
    let gp=dest.replaceAll(" ","");
    let g=uhm.split(",");
    //g=g.split(",");
    g[0]=Number(g[0])+1;
    g[1]=Number(g[1])+1;
    let qu=`${g[0]},${g[1]}`;
    if (qu!=gp){
      console.log("you got it wrong");
    }
    if (qu==gp){
      console.log("you got it right");
    }
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
  if (search_count==turnList.length){
    let gp=dest.replaceAll(" ","");
    let g=uhm.split(",");
    //g=g.split(",");
    g[0]=Number(g[0])+1;
    g[1]=Number(g[1])+1;
    let qu=`${g[0]},${g[1]}`;
    if (qu!=gp){
      console.log("you got it wrong");
    }
    if (qu==gp){
      console.log("you got it right");
    }
    for(let i=0;i<turnList.length;i++){
      document.getElementsByClassName(turnList[i])[0].style.backgroundColor = "";
    }
    //console.log(`${searcher} wins:${search_count}`);
    
    document.getElementsByClassName(searcher)[0].style.backgroundColor = searcher;
    index = turnList.findIndex(car => car==searcher);
    finish_game(`Player ${index+1}`,searcher);
    return;
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
  console.log(game_progress);
  let uo="";
  if (my_colour==wha){
    uo=`YOU WIN!!!`;
  }
  else{
    uo=`${capitalizeFirstLetter(who)} wins!!!`;
  }
  let s=document.createElement("h1");
  s.className="finisher";
  s.style.color=wha;
  s.textContent=uo;
  finished=true;
  document.getElementById("notifier").replaceChildren(s);
  let f=document.createElement("button");
  f.className="actions";
  f.textContent="Download Game";
  f.onclick=save_game;
  document.getElementById("butts").replaceChildren(f);
}
function append_question(questioner,questioned,cell){
  let temp_event=new event(questioner,"question",cell);
  temp_event["questioned"]=questioned;
  if (questioned==my_colour){
    document.getElementById("notifier").textContent=`${capitalizeFirstLetter(questioner)} questioned You on ${cell}`;
  }
  if (questioner==my_colour){
    document.getElementById("notifier").textContent=`You questioned ${capitalizeFirstLetter(questioned)} on ${cell}`;
  }
  else{
    document.getElementById("notifier").textContent=`${capitalizeFirstLetter(questioner)} questioned ${capitalizeFirstLetter(questioned)} on ${cell}`;
  }
  game_progress.push(temp_event);
}
function append_search(searcher,cell){
  let temp_event=new event(searcher,"search",cell);
  if (searcher==my_colour){
    document.getElementById("notifier").textContent=`You began search on: ${cell}`;
  }
  else{
    document.getElementById("notifier").textContent=`${capitalizeFirstLetter(searcher)} began search on: ${cell}`;
  }
  game_progress.push(temp_event);
}

function save_game(){
  const jsonString = JSON.stringify(game_progress, null, 2);

  const blob = new Blob([jsonString], { type: "application/json" });

  const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "game.json";
    document.body.appendChild(link);

    link.click();
}

function append_answer(player,cell,answer){
  let temp_event=new event(player,"answer",cell);
  temp_event["answer"]=answer;
  game_progress.push(temp_event);
  if (answer=="N"||answer=="no"){
    answer="NO";
  }
  else if(answer=="Y"||answer=="yes"){
    answer="YES";
  }
  if (player==my_colour){
    document.getElementById("notifier").textContent=`You answered: ${answer}`;
  }
  else{
    document.getElementById("notifier").textContent=`${capitalizeFirstLetter(player)} answered: ${answer}`;
  }
}

function negate(player,cell){
  let temp_event=new event(player,"negate",cell);
  document.getElementById("notifier").textContent=`${capitalizeFirstLetter(player)} negated ${cell}`;
  game_progress.push(temp_event);
}
function game_start(player){
  if (player == my_colour){
    document.getElementById("notifier").textContent=`Game Starting: Your Turn`;
  }
  else{
    document.getElementById("notifier").textContent=`Game Starting: ${capitalizeFirstLetter(player)}'s Turn`;
  }
}

function on_game_start(player){
  if (player == my_colour){
    document.getElementById("notifier").textContent=`You are ${capitalizeFirstLetter(my_colour)}, Your Turn`;
  }
  else{
    document.getElementById("notifier").textContent=`You are ${capitalizeFirstLetter(my_colour)}, ${capitalizeFirstLetter(player)}'s Turn`;
  }
}

