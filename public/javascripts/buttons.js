//These are the buttons in play.html, whhich will be removed when the pages leading to play.html work
var currentText='intro';
var currentNumber = '0';
var getText = '0';

//console.log(getAllJsons(currentText));

async function initialize() {
    try {
        const returningJSON = await getAllJsons(currentText);
        const {randomJsonFile} = await returningJSON.json();
        drawIt('maps/' + currentText + '/' + randomJsonFile);
    } catch (error) {
        console.error("Error initializing:", error);
    }
}

initialize(); 

document.getElementById("legendImg").addEventListener("click", function() {
    openModal("tiles/legend.png");
});
  
document.getElementById("rulesImg").addEventListener("click", function() {
    openModal("tiles/refrules.png");
});
  
document.getElementById("closeModal").addEventListener("click", function() {
    closeModal();
});
  
function openModal(imageSrc) {
    document.getElementById("modalImg").src = imageSrc;
    document.getElementById("modal").style.display = "block";
}
  
function closeModal() {
    document.getElementById("modal").style.display = "none";
}


  