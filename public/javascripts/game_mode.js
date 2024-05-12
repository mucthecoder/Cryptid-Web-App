function switch_page (url){
    let dummy=sessionStorage.getItem("cryptid-num-players");
    
    if (url==0){
        sessionStorage.setItem("cryptid-game-mode","intro");
    }
    if (url==1){
        sessionStorage.setItem("cryptid-game-mode","normal");
    }
    if (dummy!=null){
        window.location.href="/game";
    }
    else{
        window.location.href="/waiting";
    }
}
//console.log(sessionStorage.getItem("temp","play"));

