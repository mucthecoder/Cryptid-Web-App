const jsonDataString = sessionStorage.getItem('jsonData');
var who={};
var main_obj={};
let colors=["red", "green", "orange", "blue", "purple"];
if (jsonDataString) {
  const jsonData = JSON.parse(jsonDataString);
    who=jsonData[0];
    main_obj=jsonData;
  console.log('Retrieved JSON data from sessionStorage:', jsonData);
} else {
  console.log('No JSON data found in sessionStorage.');
}
var currentNumber = '0';
var getText = '0';

for (let i=0;i<main_obj[1].rules.length;i++){
    let y=document.createElement("div");
    y.className="single-clue";
    y.textContent=main_obj[1].rules[i];
    y.style.backgroundColor=colors[i];
    document.getElementById("clue-list").appendChild(y);
}

drawIt();



  