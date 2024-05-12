console.log("Waiting scripts started succesfully");
const username=sessionStorage.getItem("cryptid-game-username");
const goal=sessionStorage.getItem("cryptid-game-action");
const code=sessionStorage.getItem("cryptid-game-room-number");
const mode=sessionStorage.getItem("cryptid-game-mode");
console.log(`Username:${username}`);
console.log(`Goal:${goal}`);
console.log(`Room number:${code}`);
console.log(`Game mode:${mode}`);

//const username="temporary";
//const goal="play";
//const code=0;
//const mode = "intro";

//set the username in players joined
// Establish a connection to the server

//send a matchid from server after creation
//set goal to join
//write to sessionstorage
//switch to play
//initialize io
//reconnect to matchid
//make sure the matchid search is gonna work for rejoining 

let met = document.getElementById("myname");
console.log(typeof met);
console.log(met);
console.log("what the fuck")
met.textContent=username;
const socket = io();
let players=1;
let match_id=-1;

socket.on("identity", (identity) => {
    console.log("Socket connected:", identity);
    
    if (goal=="create"){
        socket.emit("create",{username:username,mode:mode});
    }
    else if(goal=="join"){
        socket.emit("join",{username:username,code:code});
        
    }
    else if(goal=="play"){
        socket.emit("play",{username:username,mode:mode});
        document.getElementById("join_code").textContent="";
    }
});

socket.on("create-res",(response)=>{
    console.log(response);
    match_id=response.id;
    document.getElementById("join_code").textContent=`Joining code: ${response.id}`;
});


socket.on("enable-start",()=>{
    console.log("Let the games begin");
    if (goal=="create"){
        let tem=document.createElement("button");
        tem.textContent="Start Game";
        tem.id="start";
        tem.addEventListener("click",()=>{
            console.log("clicked");
            socket.emit("start",{id:match_id,action:goal});
            
        });
        document.body.appendChild(tem);
    }
    if (goal=="play"){
        let tem=document.createElement("button");
        tem.textContent="Start Game";
        tem.id="start";
        tem.addEventListener("click",()=>{
            console.log("clicked");
            socket.emit("start",{id:match_id,action:goal});
        });
        document.body.appendChild(tem);
    }
});

socket.on("start-match",()=>{
    let him=document.getElementById("start");
    if (him && him.parentNode) {
        him.parentNode.removeChild(him);
    }
    console.log('starting');
    countdown(5);
});

function countdown(n){
    document.getElementById("counter").textContent=`Match starts in ${n}`;
    setTimeout(()=>{
        if(n<=0){
            window.location.href="/game";
        }
        else{
            //set up an html element to display the countdown
            countdown(n-1);
        }
    },1000);
}

socket.on("newplayer",(data)=>{
    players++;
    console.log("new player");
    console.log(data);
    if (data.name==username){
        return;
    }
    let temp = document.getElementById("players");
    let p=document.createElement("p");
    p.textContent=data.name;
    temp.appendChild(p);
    console.log("appended");
});

socket.on("player_lost",(data)=>{
    console.log(data);
    let par=document.getElementById("players");
    for (let i=par.children.length-1;i>=0;i--){
        if (par.children[i].tagName=="P"&&par.children[i].textContent==data.username){
            par.removeChild(par.children[i]);
        }
    }
});

socket.on("found",(data)=>{
    console.log("found match");
    console.log(data);
    match_id=data.identity;
    if (goal=="join"){
        document.getElementById("join_code").textContent=`Match ID: ${code}`;
    }
});
socket.on("others",(data)=>{
    console.log("waht")
    console.log(data);
    for (let i=0;i<data.others.length;i++){
        if (data.others[i]==username){continue;}
        let som=document.createElement("p");
        som.textContent=data.others[i];
        document.getElementById("players").appendChild(som);
    }
    match_id=data.identity;
    if (code!=null){
        
        document.getElementById("join_code").textContent=`Match ID: ${code}`;
    }
});
socket.on("not-found",()=>{
    //invalid code, alert player
    document.getElementById("join_code").textContent=`Invalid Joining Code`;
});


socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
});

socket.on("error", (error) => {
    console.error("Socket error:", error);
});
//socket.emit("play",{username:username,mode:mode});