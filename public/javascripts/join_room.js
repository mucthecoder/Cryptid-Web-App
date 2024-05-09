function join(){
    let temp = document.getElementById("room_number");
    let word = temp.value;
    localStorage.setItem("cryptid-game-action","join");
    localStorage.setItem("cryptid-game-room-number",word);
    //have to check if room number is valid
    window.location.href="/waiting";

}