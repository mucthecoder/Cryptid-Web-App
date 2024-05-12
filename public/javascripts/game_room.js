function create(){
    sessionStorage.setItem("cryptid-game-action","create");
    if (sessionStorage.getItem("cryptid-num-players")!=null){
        sessionStorage.removeItem("cryptid-num-players")
    }
    window.location.href="/game-mode";
}
function join(){
    sessionStorage.setItem("cryptid-game-action","join");
    window.location.href="/join-room";
}
function browse(){
    console.log("coming soon");
    alert("Coming soon...");
}
