// const { response } = require("express");

function online_play(){
    sessionStorage.setItem("cryptid-game-action","play");
    if (sessionStorage.getItem("cryptid-num-players")!=null){
        sessionStorage.removeItem("cryptid-num-players")
    }
    window.location.href="/game-mode";
}


function local_play(){
    sessionStorage.setItem("cryptid-game-action","local");
    window.location.href="/create-room";
}

function custom(){
    window.location.href="/custom-room";
}

fetch('/users/getusername')
    .then((response)=>{
        return response.json();
    })
    .then((data)=>{
        localStorage.setItem("cryptid-game-username",data.username);
    })
    .catch((err)=>{
        console.log(err);
    });


