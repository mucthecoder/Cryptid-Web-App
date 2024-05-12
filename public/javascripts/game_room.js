function create(){
    sessionStorage.setItem("cryptid-game-action","create");
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
