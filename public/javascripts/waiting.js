console.log("Waiting scripts started succesfully");
const username=localStorage.getItem("cryptid-game-username");
const goal=sessionStorage.getItem("cryptid-game-action");
const code=sessionStorage.getItem("cryptid-game-room-number");
let mode=sessionStorage.getItem("cryptid-game-mode");
let map="";
let my_colour="black";
console.log(`Username:${username}`);
console.log(`Goal:${goal}`);
console.log(`Room number:${code}`);
console.log(`Game mode:${mode}`);
let colors=["red", "green", "orange", "blue", "purple"];
if (username==null){
    username="temporary";
}
if (goal==null){
    goal="play";
    mode="intro";
}
if (mode!=null){
    document.getElementById("mode").textContent=mode;
}

if (goal=="join"){
    let g=document.getElementById("starter");
    if (g) g.parentNode.removeChild(g);
}

let met = document.getElementById("myname");
// console.log(typeof met);
// console.log(met);

met.textContent=username;
console.log(`what:${username}`);
const socket = io();
let players=1;
let match_id=-1;
document.getElementById("nump").textContent=`Players: ${players}`;
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
    sessionStorage.setItem("cryptid-game-room-number",match_id);
    sessionStorage.setItem("cryptid-game-action","join");
    document.getElementById("join_code").textContent=`Joining code: ${response.id}`;
});


socket.on("enable-start",(data)=>{
    console.log("Let the games begin");
    console.log(data);
    map=data.map_code;
    mode=data.mode;
    sessionStorage.setItem("cryptid-game-mode",mode);
    sessionStorage.setItem("cryptid-game-map-code",map);
    if (goal=="create"){
        // let tem=document.createElement("button");
        // tem.textContent="Start Game";
        // tem.id="start";
        // tem.addEventListener("click",()=>{
        //     console.log("clicked");
        //     socket.emit("start",{id:match_id,action:goal});
            
        // });
        // document.body.appendChild(tem);

        let tem = document.getElementById("starter");
        tem.addEventListener("click",()=>{
            console.log("clicked");
            socket.emit("start",{id:match_id,action:goal});
        });
    }
    if (goal=="play"){
        // let tem=document.createElement("button");
        // tem.textContent="Start Game";
        // tem.id="start";
        // tem.addEventListener("click",()=>{
        //     console.log("clicked");
        //     socket.emit("start",{id:match_id,action:goal});
        // });
        // document.body.appendChild(tem);
        let tem = document.getElementById("starter");
        tem.addEventListener("click",()=>{
            console.log("clicked");
            socket.emit("start",{id:match_id,action:goal});
        });

    }
    if (goal=="join"){
        let tem = document.getElementById("starter");
        if (tem){
            tem.parentNode.replaceChildren();
        }
    }
});

socket.on("start-match",()=>{
    let him=document.getElementById("starter");
    if (him && him.parentNode) {
        him.parentNode.removeChild(him);
    }
    console.log('starting');
    sessionStorage.setItem("cryptid-match-id",match_id);
    sessionStorage.setItem("cryptid-my-colour",my_colour);
    sessionStorage.setItem("cryptid-num-players",players);
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
    
    console.log("new player");
    console.log(data);
    if (data.name==username){
        return;
    }
    let temp = document.getElementById("player");
    let p=document.createElement("div");
    p.textContent=data.name;
    p.className="inners";
    players++;
    p.style.backgroundColor=colors[players-1];
    temp.appendChild(p);
    document.getElementById("nump").textContent=`Players: ${players}`;
    console.log("appended");
    for (let i=0;i<data.avail.length;i++){
        update_colors(data.avail[i],colors[i]);
    }
});

socket.on("player_lost",(data)=>{
    console.log(data);
    players-=1;
    let par=document.getElementById("player");
    for (let i=par.children.length-1;i>=0;i--){
        console.log("here");
        console.log(par.children[i].tagName);
        console.log(par.children[i].textContent);
        if (par.children[i].tagName=="DIV"&&par.children[i].textContent==data.username){
            par.removeChild(par.children[i]);
            break;
        }
    }
    document.getElementById("nump").textContent=`Players: ${players}`;
    for (let i=0;i<data.avail.length;i++){
        update_colors(data.avail[i],colors[i]);
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
        players++;
        let som=document.createElement("div");
        som.className="inners";
        som.textContent=data.others[i];
        som.style.backgroundColor=colors[players-1];
        document.getElementById("player").appendChild(som);
        
        document.getElementById("nump").textContent=`Players: ${players}`;
    }
    match_id=data.identity;
    if (code!=null){
        
        document.getElementById("join_code").textContent=`Match ID: ${code}`;
    }
    for (let i=0;i<data.avail.length;i++){
        update_colors(data.avail[i],colors[i]);
    }
});

function update_colors(who,what){
    let par=document.getElementById("player");
    for (let i=par.children.length-1;i>=0;i--){
        if (par.children[i].tagName=="DIV"&&par.children[i].textContent==who){
            par.children[i].style.backgroundColor=what;
        }
        
    }
    if (who==username){
        my_colour=what;
    }
}
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