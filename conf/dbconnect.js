const mongoose = require("mongoose");

const connect = async () => {
    try {
        const dbpass = "Qwertyui1";
        const dbuser = "neyon71133";
        const response = await mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.zbdv8in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`);
        
        console.log("MongoDB connected successfully");
        return response;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw new Error("Failed to connect to MongoDB");
    }
}

module.exports = connect;
