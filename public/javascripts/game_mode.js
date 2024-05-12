function switch_page (url){
    if (url==0){
        sessionStorage.setItem("cryptid-game-mode","intro");
    }
    if (url==1){
        sessionStorage.setItem("cryptid-game-mode","normal");
    }
    window.location.href="/waiting";
}
console.log(sessionStorage.getItem("temp","play"));

