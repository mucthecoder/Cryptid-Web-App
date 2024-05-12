const socketIO = require('socket.io');

const custom_lobbies = [];
const lobbies = [];
const curr_ind=0;

let next_custom=0;

class lobby {
    constructor() {
        this.players = [];
        this.player_sockets = [];
        this.lobby_id = -1;
        this.mode = "temp";
        this.started = false;
        this.finished=false;
        this.num_players=0;
    }
}

function configureSocketIO(server) {
    const io = socketIO(server);
    
    io.on('connection', (socket) => {
        console.log('User connected');
        //socket.emit("new_player");
        //socket.emit("identity",{found:"found"});
        io.to(socket.id).emit("identity",{connected:"connected"});
        //check if it's a return
        socket.on("create",(what)=>{
            let some = new lobby();
            some.players.push(what.username);
            some.player_sockets.push(socket.id);
            some.lobby_id=next_custom;
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
                    io.to(custom_lobbies[index].player_sockets[i]).emit("newplayer",{name:data.username});
                }
                custom_lobbies[index].player_sockets.push(socket.id);
                custom_lobbies[index].players.push(data.username);
                if (custom_lobbies[index].players.length == 3){
                    //full, so start
                    for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                        io.to(custom_lobbies[index].player_sockets[i]).emit("enable-start");
                    }
                    
                }
                io.to(socket.id).emit("others",{identity:custom_lobbies[index].lobby_id,others:custom_lobbies[index].players});
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
                io.to(socket.id).emit("found",{data:"uhmm what",identity:temp.lobby_id});
                console.log("well what");
                //console.log(lobbies);
            }
            else{
                lobbies[index].player_sockets.push(socket.id);
                lobbies[index].players.push(data.username);
                console.log("I am the one");
                //console.log(lobbies);
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    console.log(`sending to ${lobbies[index].player_sockets[i]}`);
                    io.to(lobbies[index].player_sockets[i]).emit("newplayer",{name:data.username});
                }
                io.to(socket.id).emit("others",{identity:lobbies[index].lobby_id,others:lobbies[index].players});
                if (lobbies[index].players.length == 3){
                    //full, so start
                    for (let i=0;i<lobbies[index].player_sockets.length;i++){
                        io.to(lobbies[index].player_sockets[i]).emit("enable-start");
                    }
                    
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

        socket.on("reconnect",(data)=>{
            if (data.action=="join"||data.action=="create"){
                let index = custom_lobbies.findIndex(car => car.lobby_id == data.identity);
                for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
                    io.to(custom_lobbies[index].player_sockets[i]).emit("another",{name:data.username});
                }
                custom_lobbies[index].player_sockets.push(socket.id);
                custom_lobbies[index].players.push(data.username);
                io.to(socket.id).emit("others",{others:custom_lobbies[index].players});
            }
            else if(data.action=="play"){
                let index = lobbies.findIndex(car => car.lobby_id == data.identity);
                for (let i=0;i<lobbies[index].player_sockets.length;i++){
                    io.to(lobbies[index].player_sockets[i]).emit("another",{name:data.username});
                }
                lobbies[index].player_sockets.push(socket.id);
                lobbies[index].players.push(data.username);
                io.to(socket.id).emit("others",{others:lobbies[index].players});
            }
        });

        socket.on('disconnect', () => {
            console.log(`user disconnected:${socket.id}`);
            for (let i=0;i<lobbies.length;i++){
                for (let j=0;j<lobbies[i].player_sockets.length;j++){
                if (lobbies[i].player_sockets[j]==socket.id){
                    let temp_name=lobbies[i].players[j];
                    lobbies[i].player_sockets.splice(j,1);
                    lobbies[i].players.splice(j,1);
                    for (let z=0;z<lobbies[i].player_sockets.length;z++){
                    io.to(lobbies[i].player_sockets[z]).emit("player_lost",{username:temp_name});
                    }
                }

                }
            }
            for (let i=0;i<custom_lobbies.length;i++){
                for (let j=0;j<custom_lobbies[i].player_sockets.length;j++){
                if (custom_lobbies[i].player_sockets[j]==socket.id){
                    let temp_name=custom_lobbies[i].players[j];
                    custom_lobbies[i].player_sockets.splice(j,1);
                    custom_lobbies[i].players.splice(j,1);
                    for (let z=0;z<custom_lobbies[i].player_sockets.length;z++){
                    io.to(custom_lobbies[i].player_sockets[z]).emit("player_lost",{username:temp_name});
                    }
                }

                }
            }
        });
    });

    return io;
}

module.exports = configureSocketIO;