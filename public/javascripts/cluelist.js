 // Fetch the JSON data from the external file
 fetch('../maps/dictionary.json')
 .then(response => response.json())
 .then(data => {
     // Get the div element where the checklist will be added
     const checklistDiv = document.getElementById('cluelist');

     // Iterate over the JSON data and create a checkbox for each item
     for (const key in data) {
         if (data.hasOwnProperty(key)) {
             // Create a label element
             const label = document.createElement('label');
             label.htmlFor = key;
             label.innerText = data[key];

             // Create a checkbox element
             const checkbox = document.createElement('input');
             checkbox.type = 'checkbox';
             checkbox.id = key;
             checkbox.name = key;

             // Append the checkbox and label to the div
             checklistDiv.appendChild(checkbox);
             checklistDiv.appendChild(label);
             
             // Add a line break for spacing
             checklistDiv.appendChild(document.createElement('br'));
         }
     }
 })
 .catch(error => console.error('Error fetching the JSON data:', error));
