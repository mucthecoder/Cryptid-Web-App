let i=2;
let actionHistory = [];
let playing=false;

function next() {
    let shape = "";
    let colour = "";
    if (i >= main_obj.length - 1) {
        let g = document.getElementById("auto");
        g.textContent = "Auto";
        g.parentNode.removeChild(g);
        g = document.getElementById("next");
        g.textContent = "Restart";
        g.onclick = function() {
            restart();
        }
    }

    let action = main_obj[i];
    let notifierText = "";

    if (action.action == "negate") {
        shape = "square";
        colour = action.player;
        notifierText = `${capitalizeFirstLetter(action.player)} negated ${action.cell}`;
    }
    if (action.action == "search") {
        shape = "circle";
        colour = action.player;
        notifierText = `${capitalizeFirstLetter(action.player)} began a search on ${action.cell}`;
    }
    if (action.action == "question") {
        shape = "circle";
        colour = "black";
        notifierText = `${capitalizeFirstLetter(action.player)} questioned ${capitalizeFirstLetter(action.questioned)} on ${action.cell}`;
    }
    if (action.action == "answer" && action.answer == "Y") {
        shape = "circle";
        colour = action.player;
        notifierText = `${capitalizeFirstLetter(action.player)} answered YES on ${action.cell}`;
    }
    if (action.action == "answer" && action.answer == "N") {
        shape = "square";
        colour = action.player;
        notifierText = `${capitalizeFirstLetter(action.player)} answered NO on ${action.cell}`;
    }
    actionHistory.push({
        index: i,
        action: action,
        shape: shape,
        colour: colour,
        cellContent: document.getElementsByClassName(`cell ${action.cell}`)[0].innerHTML
    });

    let h = createPiece(shape);
    h.style.backgroundColor = colour;
    replace_with(h, action.cell);
    document.getElementById("notifier").textContent = notifierText;
    i++;
}

function undo() {
    if (actionHistory.length === 0) return;
    let lastAction = actionHistory.pop();
    document.getElementsByClassName(`cell ${lastAction.action.cell}`)[0].innerHTML = lastAction.cellContent;
    document.getElementById("notifier").textContent = "";
    i = lastAction.index;
}


function auto() { 
    if (i <= main_obj.length - 1 && playing) {
        setTimeout(() => {
            if (playing){
            next();}
            auto();
        }, 2000);
    } else if (i >= main_obj.length && !playing) { // Added condition to stop when reaching end
        let g = document.getElementById("auto");
        if (g) {
            g.textContent = "Auto";
            g.parentNode.removeChild(g);
            let nextButton = document.getElementById("next");
            if (nextButton) {
                nextButton.textContent = "Restart";
                nextButton.onclick = function() {
                    restart();
                }
            }
        }
    }
}

function toggle() {
    console.log("toggle called");
    playing = !playing; // Toggle the playing state
    console.log(playing);
    let autoButton = document.getElementById("auto");
    if (autoButton) {
        autoButton.textContent = playing ? "Pause" : "Play"; // Update button text
    }
    if (playing) {
        auto(); // Start auto-play if playing
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
    g.onclick=toggle;
    document.getElementById("butts").appendChild(g);
    g=document.getElementById("next");
    g.textContent="Next";
    g.onclick=next;
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