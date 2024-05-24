function goBack(){
    window.history.back();
}

function upload(){
    const fileInput = document.getElementById('fileInput');


    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        const reader = new FileReader();

        reader.onload = function(event) {
            const fileContent = event.target.result;

            try {
                const jsonData = JSON.parse(fileContent);
                console.log('Parsed JSON data:', jsonData);
                sessionStorage.setItem('cryptid-custom-map', JSON.stringify(jsonData));
                window.location.href="/play-custom";
            } 
            catch (error) {
                console.error('Error parsing JSON:', error);
                alert("Invalid JSON file");
            }
        };

        reader.readAsText(file);
    } else {
        console.log('No file selected.');
        alert("No File Selected");
    }
}
