let i=2;

function next(){
    let shape="";
    let colour="";
    if (i>=main_obj.length-1){
        let g=document.getElementById("auto");
        g.textContent="Auto";
        g.parentNode.removeChild(g);
        g=document.getElementById("next");
        g.textContent="Restart";
        g.onclick=function(){
            restart();
        }
    }
    if (main_obj[i].action=="negate"){
        shape="square";
        colour=main_obj[i].player;
        document.getElementById("notifier").textContent=`${capitalizeFirstLetter(main_obj[i].player)} negated ${main_obj[i].cell}`;
    }
    if (main_obj[i].action=="search"){
        shape="circle";
        colour=main_obj[i].player;
        document.getElementById("notifier").textContent=`${capitalizeFirstLetter(main_obj[i].player)} began a search on ${main_obj[i].cell}`;
    }
    if (main_obj[i].action=="question"){
        shape="circle";
        colour="black";
        document.getElementById("notifier").textContent=`${capitalizeFirstLetter(main_obj[i].player)} questioned ${capitalizeFirstLetter(main_obj[i].questioned)} on ${main_obj[i].cell}`;
    }
    if (main_obj[i].action=="answer"&&main_obj[i].answer=="Y"){
        shape="circle";
        colour=main_obj[i].player;
        document.getElementById("notifier").textContent=`${capitalizeFirstLetter(main_obj[i].player)} answered YES on ${main_obj[i].cell}`;
    }
    if (main_obj[i].action=="answer"&&main_obj[i].answer=="N"){
        shape="square";
        colour=main_obj[i].player;
        document.getElementById("notifier").textContent=`${capitalizeFirstLetter(main_obj[i].player)} answered NO on ${main_obj[i].cell}`;
    }
    h=createPiece(shape);
    h.style.backgroundColor=colour;
    replace_with(h,main_obj[i].cell);
    i++;
}
function auto() { 
    document.getElementById("auto").onclick=function(){}
    if (i <= main_obj.length - 1) {
        setTimeout(() => {
            next();
            auto();
        }, 2000);
    }
    else{
        let g=document.getElementById("auto");
        g.textContent="Auto";
        g.parentNode.removeChild(g);
        g=document.getElementById("next");
        g.textContent="Restart";
        g.onclick=function(){
            restart();
        }
    }
}
function restart(){
    for (let j=2;j<main_obj.length;j++){
        let e=document.getElementsByClassName(`cell ${main_obj[j].cell}`)[0];
        for (let i=e.children.length-1;i>=0;i--){
            if (e.children[i].tagName=="DIV"&&e.children[i].style.backgroundColor==main_obj[j].player){
                e.removeChild(e.children[i]); 
            }
        }
    }
    i=2;
    let g = document.createElement("button");
    g.textContent="Auto";
    g.id="auto";
    g.className="actions";
    g.onclick=auto;
    document.getElementById("butts").appendChild(g);
    g=document.getElementById("next");
    g.textContent="Next";
    g.onclick=next;
}

function undo(){

}
function replace_with(what,where){
    let e=document.getElementsByClassName(`cell ${where}`)[0];
    for (let i=e.children.length-1;i>=0;i--){
      if (e.children[i].tagName=="DIV"&&e.children[i].style.backgroundColor=="black"){
        e.removeChild(e.children[i]);
        
      }
    }
    e.style.backgroundColor="rgba(0,0,255,0.4)";
    setTimeout(()=>{e.style.backgroundColor="rgba(0,0,255,0.0)";},1000);
    e.appendChild(what);
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function createPiece(shape) {
    var shapeDiv = document.createElement("div");
    shapeDiv.style.width = "20%"; // Adjust width as needed
    shapeDiv.style.aspectRatio= "1/1"; // Adjust height as needed
    shapeDiv.style.height = "20%";
    if (shape == "square") {
      shapeDiv.classList.add("square");
    } 
    else {
      shapeDiv.classList.add("circle");
      shapeDiv.style.borderRadius = "50%";
    }
    return shapeDiv;
}