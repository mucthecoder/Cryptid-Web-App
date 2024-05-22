console.log("To replay loaded successfully");
function watch(){
    const fileInput = document.getElementById('fileInput');

  // Check if any file is selected
  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];

    const reader = new FileReader();

    reader.onload = function(event) {
      const fileContent = event.target.result;

      try {
        const jsonData = JSON.parse(fileContent);
        console.log('Parsed JSON data:', jsonData);
        sessionStorage.setItem('jsonData', JSON.stringify(jsonData));
        window.location.href="/replay";
      } 
      catch (error) {
        console.error('Error parsing JSON:', error);
        alert("Invalid JSON file");
      }
    };

    // Read the file as text
    reader.readAsText(file);
  } else {
    // No file selected
    console.log('No file selected.');
    alert("No File Selected");
  }
}
