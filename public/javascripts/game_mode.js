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


document.getElementById("back").addEventListener("click",(e)=>{
    let what = sessionStorage.getItem("cryptid-game-action");
    if(what == "local"){
        window.location.href = "/create-room";
    }
    else if(what == "create"){
        window.location.href = "/custom-room";
    }
    else if(what == "play"){
        window.location.href = "/home";
    }
    else{
        window.location.href = "/home";
    }
});

