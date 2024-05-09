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

document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to the button
    const button = document.getElementById("difficulty");
    button.addEventListener("click", async function() {

        currentText= button.textContent;
        if(currentText=='intro') currentText='normal';
        else currentText='intro';
        button.textContent = currentText;
        // Call your function here
        try {
            const fileNames = await getAllJsons(currentText);
            drawIt('maps/' + currentText + '/' + fileNames[parseInt(currentNumber)]);
        } catch (error) {
            console.error("Error handling difficulty change:", error);
        }
        //console.log(getAllJsons(currentText));
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to the button
    const button = document.getElementById("number");
    button.addEventListener("click", async function() {

        currentNumber= button.textContent;
        if(currentText=='Intro') currentNumber=(parseInt(currentNumber)+1)%2193;
        else currentNumber=(parseInt(currentNumber)+1)%2224;
        button.textContent = ''+currentNumber;
        try {
            const fileNames = await getAllJsons(currentText);
            drawIt('maps/' + currentText + '/' + fileNames[parseInt(currentNumber)]);
        } catch (error) {
            console.error("Error handling difficulty change:", error);
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to the button
    const button = document.getElementById("customNumber");
    const input = document.getElementById("custom");
    button.addEventListener("click", function() {
        console.log("here");
        getText= input.value;
        console.log(getText);
        if(getText.length) drawIt2(getText);
    });
});

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
  