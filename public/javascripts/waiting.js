console.log("Waiting scripts started succesfully");
const username=localStorage.getItem("cryptid-game-username");
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

let met =document.getElementById("myname");
console.log(typeof met);
console.log(met);
console.log("what the fuck")
met.textContent=username;
const socket = io();
let players=1;

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
    document.getElementById("join_code").textContent=`Joining code: ${response.id}`;
});


socket.on("start-game",()=>{
    console.log("Let the games begin");
    let tem=document.createElement("button");
    tem.textContent="Start Game";
    tem.addEventListener("click",()=>{
        console.log("clicked");
        setTimeout(()=>{
            window.location.href="/game";
        },4000);
    });
    document.body.appendChild(tem);
});

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
    if (goal=="join"){
        document.getElementById("join_code").textContent=`Joining code: ${code}`;
    }
});
socket.on("others",(data)=>{
    for (let i=0;i<data.others.length;i++){
        if (data.others[i]==username){continue;}
        let som=document.createElement("p");
        som.textContent=data.others[i];
        document.getElementById("players").appendChild(som);
    }
    document.getElementById("join_code").textContent=`Joining code: ${code}`;
});
socket.on("not-found",()=>{
    //invalid code, alert player
    document.getElementById("join_code").textContent=`Joining code: Invalid`;
});


socket.on("play-res",(data)=>{
    //something
});

socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
});

socket.on("error", (error) => {
    console.error("Socket error:", error);
});
//socket.emit("play",{username:username,mode:mode});