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




