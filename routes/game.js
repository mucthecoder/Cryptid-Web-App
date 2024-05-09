var express = require('express');
var router = express.Router();
var path = require('path');
const custom_lobbies = [];
const lobbies = [];
const curr_ind=0;
let curr_players=0;
let next_custom=0;
function lobby(){
    this.players=[];
    this.player_sockets=[];
    this.lobby_id=-1;
    this.mode ="temp";
    this.started=false;
}

router.get('/', function(req, res, next) {
  const filePath = path.join(__dirname, "../public/play.html");
  res.sendFile(filePath);
});

// module.exports = function(io){
//     io.of('/game').on('connection', (socket) => {
//         console.log('User connected');
//         //socket.emit("new_player");
//         //socket.emit("identity",{found:"found"});
//         io.to("/game").emit("identity",{found:"found"});
//         socket.on("create",(what)=>{
//             let some = new lobby();
//             some.players.push(what.username);
//             some.player_sockets.push(socket.id);
//             some.lobby_id=next_custom;
//             some.mode=what.mode;
//             next_custom++;
//             custom_lobbies.push(some);
//             io.to(socket.id).emit("create-res",{id:some.lobby_id});
//         });

//         socket.on("join",(data)=>{
//             const index = custom_lobbies.findIndex(car => car.lobby_id == data.code);
//             if (index==-1){
//                 io.to(socket.id).emit("not-found");
//             }
//             else{
//                 custom_lobbies[index].player_sockets.push(socket.id);
//                 custom_lobbies[index].players.push(data.username);
//                 for (let i=0;i<custom_lobbies[index].player_sockets.length;i++){
//                     io.to(custom_lobbies[index].player_sockets[i]).emit("new_player",{name:data.username});
//                 }
//                 io.to(socket.id).emit("found",{others:custom_lobbies[index].players});
//             }
//         });

//         socket.on("play",(data)=>{
//             const index = lobbies.findIndex(car => car.mode==data.mode&&car.started == false);
//             if (index==-1){
//                 let temp = new lobby();
//                 temp.lobby_id=curr_ind;
//                 temp.player_sockets.push(socket.id);
//                 temp.players.push(data.username);
//                 temp.mode=data.mode;
//                 lobbies.push(temp);
//                 socket.to(socket.id).emit("found",{data:"uhmm what"});
//                 console.log("well what");
//                 //console.log(lobbies);
//             }
//             else{
//                 lobbies[index].player_sockets.push(socket.id);
//                 lobbies[index].players.push(data.username);
//                 console.log("I am the one");
//                 //console.log(lobbies);
//                 for (let i=0;i<lobbies[index].player_sockets.length;i++){
//                     console.log(`sending to ${lobbies[index].player_sockets[i]}`);
//                     io.to(lobbies[index].player_sockets[i]).emit("newplayer",{name:data.username});
//                 }
//                 if (lobbies[index].players.length == 5){
//                     //full, so start
//                     for (let i=0;i<lobbies[index].player_sockets.length;i++){
//                         io.to(lobbies[index].player_sockets[i]).emit("start-game");
//                     }
//                     lobbies[index].started=true;
//                 }
//             }

//         });

//         socket.on('disconnect', () => {
//             console.log('User disconnected');
//         });
//     });

//     return router;
// };
module.exports=router;
