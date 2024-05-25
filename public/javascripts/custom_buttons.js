//These are the buttons in play.html, whhich will be removed when the pages leading to play.html work
var currentNumber = '0';
var getText = '0';

//console.log(getAllJsons(currentText));
const jsonDataString = sessionStorage.getItem('cryptid-custom-map');
var who={};
var main_obj = {};
let colors = ["red", "green", "orange", "blue", "purple"];
if (jsonDataString) {
    try {
        const jsonData = JSON.parse(jsonDataString);
        drawIt(jsonData);
        console.log('Retrieved JSON data from sessionStorage:', jsonData);
    } catch (error) {
        console.error('Error parsing JSON:', error);
        alert("Invalid JSON: " + error.message);
        window.location.href="/upload-custom";
    }
} else {
    console.log('No JSON data found in sessionStorage.');
}


document.querySelectorAll(".legendImg").forEach(function(element) {
    element.addEventListener("click", function() {
        openModal("tiles/legend.png");
    });
});
  
document.getElementById("rules").addEventListener("click", function() {
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

function leave(){
    window.history.back();
}
  