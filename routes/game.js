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

const userController = require("../controllers/userController");

const verify = userController.verifyUserData;

router.get('/', verify, function(req, res, next) {
  const filePath = path.join(__dirname, "../public/play.html");
  res.sendFile(filePath);
});


module.exports=router;
