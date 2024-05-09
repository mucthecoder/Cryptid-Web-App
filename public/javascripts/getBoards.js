async function getAllJsons(pressed) {
    try {
        const directoryPath = '/maps/'+pressed;
        const response = await fetch(directoryPath);
        
        if (!response.ok) {
            throw new Error('Failed to fetch directory contents. Status: ' + response.status);
        }
        return response;
    } catch (err) {
        console.error("Error accessing directory:", err);
        return [];
    }
}
