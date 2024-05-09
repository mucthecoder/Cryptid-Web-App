function create(){
    sessionStorage.setItem("cryptid-game-action","create");
    window.location.href="/create-room";
}
function join(){
    sessionStorage.setItem("cryptid-game-action","join");
    window.location.href="/join-room";
}
function browse(){
    
}
