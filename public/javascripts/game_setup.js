console.log("Waiting scripts started succesfully");
const username=sessionStorage.getItem("cryptid-game-username");
const goal=sessionStorage.getItem("cryptid-game-action");
const code=sessionStorage.getItem("cryptid-game-room-number");
const mode=sessionStorage.getItem("cryptid-game-mode");
const num_players = sessionStorage.getItem("cryptid-num-players");
const match_id = sessionStorage.getItem("cryptid-match-id");
let my_colour=sessionStorage.getItem("cryptid-my-colour");
let who=null;
let her="";
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
    

    socket.on("inits",(data)=>{
        console.log(data);
        //{colour:data.colour,name:data.name,cell:data.cell,why:data.why});
        let h=createPiece("square");
        let r=document.getElementsByClassName(data.cell)[0];
        r.addEventListener("mouseenter",()=>{
            r.style.backgroundColor="rgba(255, 0, 0, 0.4)";
         });
        r.onclick=nothing;
        h.style.backgroundColor=data.colour;
        replace_with(h,data.cell);
        processTurn();

    });

    socket.on("quest",(data)=>{
        console.log(data);
        //{colour:data.colour,name:data.name,cell:data.cell,target:data.target}
        question_mark(data.cell);
        start_quest();
        questioned=data.target;
        her=data.cell;
        questioning=true;
        if (data.target==my_colour){
            on_load_possible_answers();
        }
    });
    socket.on("res",(data)=>{
        console.log("res");
        console.log(data);
        //{colour:data.colour,name:data.name,cell:data.cell,why:data.why}
        if(data.answer=="no"){
            let h=createPiece("square");
            let r=document.getElementsByClassName(`cell ${data.cell}`)[0];
            r.addEventListener("mouseenter",()=>{
                r.style.backgroundColor="rgba(255, 0, 0, 0.4)";
            });
            r.onclick=nothing;
            h.style.backgroundColor=questioned;
            replace_with(h,her);
        }
        else if(data.answer=="yes"){
            let h=createPiece("circle");
            let r=document.getElementsByClassName(`cell ${data.cell}`)[0];
            r.addEventListener("mouseenter",()=>{
                r.style.backgroundColor="rgba(0, 255, 0, 0.4)";
            });
            r.onclick=nothing;
            h.style.backgroundColor=questioned;
            replace_with(h,her);
        }
        done_question();
    });
    socket.on("resp",(data)=>{
        console.log("resp");
        console.log(data);
        //{colour:data.colour,name:data.name,cell:data.cell,why:data.why}
        if(data.answer=="no"){
            let h=createPiece("square");
            let r=document.getElementsByClassName(`cell ${data.cell}`)[0];
            r.addEventListener("mouseenter",()=>{
                r.style.backgroundColor="rgba(255, 0, 0, 0.4)";
            });
            r.onclick=nothing;
            h.style.backgroundColor=data.colour;
            replace_with(h,her);
            done_search();
        }
        else if(data.answer=="yes"){
            let h=createPiece("circle");
            let r=document.getElementsByClassName(`cell ${data.cell}`)[0];
            r.addEventListener("mouseenter",()=>{
                r.style.backgroundColor="rgba(0, 255, 0, 0.4)";
            });
            h.style.backgroundColor=data.colour;
            append_piece(h,her);
            on_process_search_turn();
        }
        
    });

    socket.on("searcher",(data)=>{
        console.log("from searcher");
        console.log(data);
        //{colour:data.colour,name:data.name,cell:data.cell,why:data.why}
        searcher=data.colour;
        search_turn=turn;
        search_count=0;
        searching=true;
        her=data.cell;
        on_search_mark(data.cell,searcher);
        start_search();
        on_process_search_turn();
    });

    socket.on("error", (error) => {
        console.error("Socket error:", error);
    });
    

}

function on_search_mark(where,damn){
    let he=createPiece("circle");
    he.style.backgroundColor=damn;
    append_piece(he,where);
}

function on_search(where){
    console.log("Searching");
    socket.emit("search",{colour:my_colour,name:username,cell:where,why:goal,match:match_id});
}

function on_starter(where){
    if (round<2&&turnList[turn]==my_colour){
        //console.log("starting negations");
        socket.emit("starter",{colour:my_colour,name:username,match:match_id,cell:where,why:goal});
    }
    else{
        her=where;
        on_load_possible_actions();
    }
}
function on_question(where,who){
    console.log("starting negations");
    socket.emit("question",{colour:my_colour,name:username,match:match_id,cell:where,target:who,why:goal});
}

function on_response(where,what){
    console.log(`Responding: ${what} to ${where}`);
    socket.emit("response",{colour:my_colour,name:username,match:match_id,cell:where,answer:what,why:goal});
}
function on_answer(where,what){
    console.log(`Responding: ${what}`);
    socket.emit("answer",{colour:my_colour,name:username,match:match_id,cell:where,answer:what,why:goal});
}

function on_cellClicked(cellClass,colour) {
    if (colour==my_colour){
        
    }
    if (round < 2) {
      on_starter(cellClass);
    }


}

function on_load_possible_actions(){
    let one=document.createElement("button");
    one.className="actions";
    one.textContent="Question";
    one.addEventListener("click",()=>{
      console.log("Questioning");
      bq=turn;
      questioning=true;
      
      on_load_question_options();
    });
  
    let two=document.createElement("span");
    two.style.width="10px";
  
    let three=document.createElement("button");
    three.className="actions";
    three.textContent="Search";
    three.addEventListener("click",()=>{
      console.log("Searching");
      bq=turn;
      console.log(her);
      on_search(her);
      document.getElementById("butts").replaceChildren();
  
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

function on_load_question_options(){
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
        on_question(her,questioned);
        // on_load_possible_answers()
        //start_quest();
      });
      let s=document.createElement("span");
      s.style.width="5px";
      h.appendChild(r);
      if (i<turnList.length-1){
        h.appendChild(s);
      }
    }
}

function on_load_possible_answers(){
    let one=document.createElement("button");
    one.className="squares";
    one.style.backgroundColor=questioned;
    one.addEventListener("click",()=>{
      console.log("denying");
      on_answer(her,"no");
    //    let h=createPiece("square");
    //   let r=document.getElementsByClassName(uhm)[0];
    //   r.addEventListener("mouseenter",()=>{
    //     r.style.backgroundColor="rgba(255, 0, 0, 0.4)";
    //   });
    //   r.onclick=nothing;
    //   h.style.backgroundColor=questioned;
    //   replace_with(h,uhm);
    //   done_question();
    });
  
    let two=document.createElement("span");
    two.style.width="10px";
  
    let three=document.createElement("button");
    three.className="circs";
    three.style.backgroundColor=questioned;
    three.addEventListener("click",()=>{
      console.log("accepting");
      on_answer(her,"yes");
    //   let h=createPiece("circle");
    //   h.className="yep"
    //   h.style.backgroundColor=questioned;
    //   replace_with(h,uhm);
    //   done_question();
      
    });
  
    let four=document.getElementById("butts");
    four.replaceChildren();
    four.appendChild(one);
    four.appendChild(two);
    four.appendChild(three);
}

function on_load_possible_responses(){
    let one=document.createElement("button");
    one.className="squares";
    one.style.backgroundColor=turnList[search_turn];
    one.addEventListener("click",()=>{
      console.log("denying");
      on_response(her,"no");
    //   let h=createPiece("square");
    //   let r=document.getElementsByClassName(uhm)[0];
    //   r.addEventListener("mouseenter",()=>{
    //     r.style.backgroundColor="rgba(255, 0, 0, 0.4)";
    //   });
    //   r.onclick=nothing;
    //   h.style.backgroundColor=turnList[search_turn];
    //   replace_with(h,uhm);
    //   done_search();
      
    });
  
    let two=document.createElement("span");
    two.style.width="10px";
  
    let three=document.createElement("button");
    three.className="circs";
    three.style.backgroundColor=turnList[search_turn];
    three.addEventListener("click",()=>{
      console.log("accepting");
      on_response(her,"yes");
    //   let h=createPiece("circle");
    //   let r=document.getElementsByClassName(uhm)[0];
    //   r.addEventListener("mouseenter",()=>{
    //     r.style.backgroundColor="rgba(0, 255, 0, 0.4)";
    //   });
    //   h.style.backgroundColor=turnList[search_turn];
    //   append_piece(h,uhm);
    //   process_search_turn();
      
    });
  
    let four=document.getElementById("butts");
    four.replaceChildren();
    four.appendChild(one);
    four.appendChild(two);
    four.appendChild(three);
}
function on_process_search_turn() {
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
    if (pre == -1) pre = turnList.length-1;
    let currTurn = document.getElementsByClassName(turnList[search_turn]);
    currTurn[0].style.backgroundColor = turnList[search_turn];
    let preTurn = document.getElementsByClassName(turnList[pre]);
    console.log(preTurn);
    console.log(turnList[pre]);
    preTurn[0].style.backgroundColor = "";
    if (turnList[search_turn]==my_colour){
        on_load_possible_responses();
    }
}
