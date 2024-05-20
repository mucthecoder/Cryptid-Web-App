const socketIO = require('socket.io');
const fs=require("fs");
const path=require("path");
const custom_lobbies = [];
const lobbies = [];
const curr_ind=0;

let next_custom=0;

class lobby {
    constructor() {
        this.players = [];
        this.player_sockets = [];
        this.colors=["red", "green", "orange", "blue", "purple"];
        this.colours=[];
        this.lobby_id = -1;
        this.mode = "intro";
        this.started = false;
        this.finished=false;
        this.num_players=0;
        this.mapCode="empty";
        this.turn=0;
        this.round=0;
        this.creator="";
    }
}


function code_gen(number) {
    let base36String = number.toString(36);
    const fixedPattern = 'uniqueid';
    const combinedString = fixedPattern + base36String;
    const paddedString = combinedString.slice(-8);

    return paddedString;
}
function inside(arr,val){
    for (let i=0;i<arr.length;i++){
        // console.log(`${arr[i]} vs ${val}`);
        if (arr[i]==val){
            return true;
        }
    }
    return false;
}

function configureSocketIO(server) {
    const io = socketIO(server);
    
    io.on('connection', (socket) => {
        console.log('User connected');
        //socket.emit("new_player");
        //socket.emit("identity",{found:"found"});
        io.to(socket.id).emit("identity",{connected:"connected"});
        //check if it's a return

        //#################################################################
        //setup stuff
        socket.on("create",(what)=>{
            let some = new lobby();
            some.players.push(what.username);
            some.player_sockets.push(socket.id);
            some.lobby_id=code_gen(next_custom);
            some.mode=what.mode;
            next_custom++;
            custom_lobbies.push(some);
            io.to(socket.id).emit("create-res",{id:some.lobby_id});
        });

        socket.on("join",(data)=>{
            const index = custom_lobbies.findIndex(car => car.lobby_id == data.code);
            if (index==-1){
                console.log("not found");
                console.log(data);
                io.to(socket.id).emit("not-found");
            }
            else{
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("newplayer",{name:data.username,avail:custom_lobbies[index].players});
                }
                custom_lobbies[index].player_sockets.push(socket.id);
                custom_lobbies[index].players.push(data.username);
                if (custom_lobbies[index].players.length >= 3){
                    const directoryPath = path.join(__dirname, `../public/maps/${custom_lobbies[index].mode}`);
                    fs.readdir(directoryPath, function(err, files) {
                        if (err) {
                          console.log('Error reading directory');
                        }
                    
                        const jsonFiles = files.filter(file => file.endsWith('.json'));
                    
                        if (jsonFiles.length === 0) {
                          console.log('No JSON files found');
                        }
                        const randomJsonFile = jsonFiles[Math.floor(Math.random() * jsonFiles.length)];
                    
                        custom_lobbies[index].mapCode=randomJsonFile;
                        
                        //full, so start
                        for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                            io.to(custom_lobbies[index].player_sockets[i]).emit("enable-start",{map_code:custom_lobbies[index].mapCode,mode:custom_lobbies[index].mode});
                        }
                    });
                    
                }
                io.to(socket.id).emit("others",{identity:custom_lobbies[index].lobby_id,others:custom_lobbies[index].players,avail:custom_lobbies[index].players});
            }
        });

        socket.on("play",(data)=>{
            const index = lobbies.findIndex(car => car.mode==data.mode&&car.started == false);
            if (index==-1){
                let temp = new lobby();
                temp.lobby_id=curr_ind;
                temp.player_sockets.push(socket.id);
                temp.players.push(data.username);
                temp.mode=data.mode;
                lobbies.push(temp);
                io.to(socket.id).emit("found",{data:"new lobby",identity:temp.lobby_id});
                console.log("creating new lobby");
                //console.log(lobbies);
            }
            else{
                lobbies[index].player_sockets.push(socket.id);
                lobbies[index].players.push(data.username);
                console.log("I am the one");
                //console.log(lobbies);
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    console.log(`sending to ${lobbies[index].player_sockets[i]}`);
                    io.to(lobbies[index].player_sockets[i]).emit("newplayer",{name:data.username,avail:lobbies[index].players});
                }
                io.to(socket.id).emit("others",{identity:lobbies[index].lobby_id,others:lobbies[index].players,avail:lobbies[index].players});
                if (lobbies[index].players.length == 3){
                    const directoryPath = path.join(__dirname, `../public/maps/${lobbies[index].mode}`);
                    fs.readdir(directoryPath, function(err, files) {
                        if (err) {
                          console.log('Error reading directory');
                        }
                    
                        const jsonFiles = files.filter(file => file.endsWith('.json'));
                    
                        if (jsonFiles.length === 0) {
                          console.log('No JSON files found');
                        }
                        const randomJsonFile = jsonFiles[Math.floor(Math.random() * jsonFiles.length)];
                    
                        lobbies[index].mapCode=randomJsonFile;
                        //full, so start
                        for (let i=0;i<lobbies[index].player_sockets.length;i++){
                            io.to(lobbies[index].player_sockets[i]).emit("enable-start",{map_code:lobbies[index].mapCode,mode:lobbies[index].mode});
                        }
                    });
                    
                }
            }

        });
        socket.on("start",(data)=>{
            console.log(data.id);
            if (data.action=="create"){
                
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.id);
                console.log(index);
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("start-match");
                }
                custom_lobbies[index].num_players=custom_lobbies[index].players.length;
                custom_lobbies[index].started=true;
            }
            else if(data.action=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.id);
                console.log(index);
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("start-match");
                }
                lobbies[index].num_players=lobbies[index].players.length;
                lobbies[index].started=true;
            }
        });
        //#################################################################
        //playing stuff
        socket.on("well",()=>{console.log("socketing from another file works");});
        socket.on("starter",(data)=>{
            console.log(`Starting: ${data.cell}`);
            //const index = lobbies.findIndex(car => car.mode==data.mode&&car.started == false);
            if (data.why=="join"||data.why=="create"){
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                custom_lobbies[index].turn++;
                if (custom_lobbies[index].turn>=custom_lobbies[index].players.length){
                    custom_lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("inits",{colour:data.colour,name:data.name,cell:data.cell,why:data.why});
                }
            }
            else if (data.why=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                lobbies[index].turn++;
                if (lobbies[index].turn>=lobbies[index].players.length){
                    lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("inits",{colour:data.colour,name:data.name,cell:data.cell,why:data.why});
                }
            }
            
        });
        socket.on("sacrifice",(data)=>{
            console.log(`sacrificing: ${data.cell}`);
            //const index = lobbies.findIndex(car => car.mode==data.mode&&car.started == false);
            if (data.why=="join"||data.why=="create"){
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                custom_lobbies[index].turn++;
                if (custom_lobbies[index].turn>=custom_lobbies[index].players.length){
                    custom_lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("sac",{colour:data.colour,name:data.name,cell:data.cell,why:data.why});
                }
            }
            else if (data.why=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                lobbies[index].turn++;
                if (lobbies[index].turn>=lobbies[index].players.length){
                    lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("sac",{colour:data.colour,name:data.name,cell:data.cell,why:data.why});
                }
            }
            
        });
        socket.on("search",(data)=>{
            console.log(`Searching: ${data.cell}`);
            if (data.why=="join"||data.why=="create"){
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                custom_lobbies[index].turn++;
                if (custom_lobbies[index].turn>=custom_lobbies[index].players.length){
                    custom_lobbies[index].turn=0;
                }
                //skeptical
                console.log("here");
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    console.log("sending to appropriate people");
                    io.to(custom_lobbies[index].player_sockets[i]).emit("searcher",{colour:data.colour,name:data.name,cell:data.cell,why:data.why});
                }
            }
            else if (data.why=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                lobbies[index].turn++;
                if (lobbies[index].turn>=lobbies[index].players.length){
                    lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("searcher",{colour:data.colour,name:data.name,cell:data.cell,why:data.why});
                }
            }
        });

        socket.on("wrong",(data)=>{
            console.log(`Searching: ${data.cell}`);
            if (data.why=="join"||data.why=="create"){
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                custom_lobbies[index].turn++;
                if (custom_lobbies[index].turn>=custom_lobbies[index].players.length){
                    custom_lobbies[index].turn=0;
                }
                //skeptical
                console.log("here");
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("wrong",{colour:data.colour,name:data.name,cell:data.cell,why:data.why});
                }
            }
            else if (data.why=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                lobbies[index].turn++;
                if (lobbies[index].turn>=lobbies[index].players.length){
                    lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("wrong",{colour:data.colour,name:data.name,cell:data.cell,why:data.why});
                }
            }
        });

        socket.on("question",(data)=>{
            console.log(`Questioning: ${data.cell}`);
            //{colour:my_colour,name:username,match:match_id,cell:where,target:who,why:goal}
            if (data.why=="join"||data.why=="create"){
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                custom_lobbies[index].turn++;
                if (custom_lobbies[index].turn>=custom_lobbies[index].players.length){
                    custom_lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("quest",{colour:data.colour,name:data.name,cell:data.cell,target:data.target});
                }
            }
            else if (data.why=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                lobbies[index].turn++;
                if (lobbies[index].turn>=lobbies[index].players.length){
                    lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("quest",{colour:data.colour,name:data.name,cell:data.cell,target:data.target});
                }
            }
        });

        socket.on("response",(data)=>{
            console.log(`Responding: ${data.cell}`);
            if (data.why=="join"||data.why=="create"){
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                custom_lobbies[index].turn++;
                if (custom_lobbies[index].turn>=custom_lobbies[index].players.length){
                    custom_lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("resp",{colour:data.colour,name:data.name,cell:data.cell,answer:data.answer});
                }
            }
            else if (data.why=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                lobbies[index].turn++;
                if (lobbies[index].turn>=lobbies[index].players.length){
                    lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("resp",{colour:data.colour,name:data.name,cell:data.cell,answer:data.answer});
                }
            }
        });

        socket.on("answer",(data)=>{
            console.log(`Answering: ${data.cell}`);
            if (data.why=="join"||data.why=="create"){
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                custom_lobbies[index].turn++;
                if (custom_lobbies[index].turn>=custom_lobbies[index].players.length){
                    custom_lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("res",{colour:data.colour,name:data.name,cell:data.cell,answer:data.answer});
                }
            }
            else if (data.why=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                lobbies[index].turn++;
                if (lobbies[index].turn>=lobbies[index].players.length){
                    lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("res",{colour:data.colour,name:data.name,cell:data.cell,answer:data.answer});
                }
            }
        });

        socket.on("skip",(data)=>{
            console.log("skipping");
            console.log(data);
            if (data.why=="join"||data.why=="create"){
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                custom_lobbies[index].turn++;
                if (custom_lobbies[index].turn>=custom_lobbies[index].players.length){
                    custom_lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("skipper",{colour:data.colour,name:data.name});
                }
            }
            else if (data.why=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                lobbies[index].turn++;
                if (lobbies[index].turn>=lobbies[index].players.length){
                    lobbies[index].turn=0;
                }
                //skeptical
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("skipper",{colour:data.colour,name:data.name});
                }
            }

        });

        socket.on("winner",(data)=>{
            console.log("skipping");
            console.log(data);
            //{colour:who,match:match_id,why:goal});
            if (data.why=="join"||data.why=="create"){
                const index = custom_lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                custom_lobbies[index].finished=true;
                custom_lobbies[index].turn++;
                if (custom_lobbies[index].turn>=custom_lobbies[index].players.length){
                    custom_lobbies[index].turn=0;
                }
                //skeptical
                
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("win",{colour:data.colour,name:data.name});
                }
            }
            else if (data.why=="play"){
                const index = lobbies.findIndex(car => car.lobby_id==data.match);
                //skeptical
                lobbies[index].finished=true;
                lobbies[index].turn++;
                if (lobbies[index].turn>=lobbies[index].players.length){
                    lobbies[index].turn=0;
                }
                //skeptical
                
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("win",{colour:data.colour,name:data.name});
                }
            }

        });

        //#################################################################
        //connection stuff
        socket.on("reconnect",(data)=>{
            console.log("reconnect called");
            if (data.action=="join"||data.action=="create"){
                let index = custom_lobbies.findIndex(car => car.lobby_id == data.identity);
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("another",{name:data.username,avail:custom_lobbies[index].players});
                }
                custom_lobbies[index].player_sockets.push(socket.id);
                custom_lobbies[index].players.push(data.username); 
                if (!inside(custom_lobbies[index].colours,data.colour)){
                    custom_lobbies[index].colours.push(data.colour);
                    
                }
                console.log(custom_lobbies[index].colours);
                console.log(custom_lobbies[index].players);

                io.to(socket.id).emit("others",{others:custom_lobbies[index].players,avail:custom_lobbies[index].players});
            }
            else if(data.action=="play"){
                let index = lobbies.findIndex(car => car.lobby_id == data.identity);
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("another",{name:data.username,avail:lobbies[index].players});
                }
                lobbies[index].player_sockets.push(socket.id);
                lobbies[index].players.push(data.username);
                if (!inside(lobbies[index].colors,data.colour)){
                    lobbies[index].colours.push(data.colour);
                }
                console.log(lobbies[index].colours);
                console.log(lobbies[index].players);
                io.to(socket.id).emit("others",{others:lobbies[index].players,avail:lobbies[index].players});
            }
        });
        

        socket.on('disconnect', () => {
            console.log(`user disconnected:${socket.id}`);
            let h=-1;
            for (let i=0;i<lobbies.length;i++){
                for (let j=0;j<lobbies[i].player_sockets.length;j++){
                    if (lobbies[i].player_sockets[j]==socket.id){
                        let temp_name=lobbies[i].players[j];
                        lobbies[i].player_sockets.splice(j,1);
                        lobbies[i].players.splice(j,1);
                        if (lobbies[i].players==0&&lobbies[i].finished){
                            console.log("ready to delete");
                            h=i;
                        }
                        for (let z=0;z<lobbies[i].player_sockets.length;z++){
                            io.to(lobbies[i].player_sockets[z]).emit("player_lost",{username:temp_name,avail:lobbies[i].players});
                        }
                    }

                }
            }
            if (h!=-1){
                lobbies.splice(h,1);
            }
            for (let i=0;i<custom_lobbies.length;i++){
                for (let j=0;j<custom_lobbies[i].player_sockets.length;j++){
                    if (custom_lobbies[i].player_sockets[j]==socket.id){
                        let temp_name=custom_lobbies[i].players[j];
                        custom_lobbies[i].player_sockets.splice(j,1);
                        custom_lobbies[i].players.splice(j,1);
                        if (custom_lobbies[i].players==0&&custom_lobbies[i].finished){
                            console.log("ready to delete");
                            h=i;
                        }
                        for (let z=0;z<custom_lobbies[i].player_sockets.length;z++){
                            io.to(custom_lobbies[i].player_sockets[z]).emit("player_lost",{username:temp_name,avail:custom_lobbies[i].players});
                        }
                    }

                }
            }
            if (h!=-1){
                custom_lobbies.splice(h,1);
            }
        });
    });

    return io;
}

module.exports = configureSocketIO;