function create(){
    window.location.href="/game-mode";
}
function players(n){
    sessionStorage.setItem("cryptid_num_players",n);
    window.location.href="game";
}
    
