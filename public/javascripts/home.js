function online_play(){
    sessionStorage.setItem("cryptid-game-action","play");
    window.location.href="/game-mode";
}

function local_play(){
    sessionStorage.setItem("cryptid-game-action","local");
    window.location.href="/game-mode";
}

function custom(){
    window.location.href="/custom-room";
}




