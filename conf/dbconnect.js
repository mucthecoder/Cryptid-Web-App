const mongoose = require("mongoose");
const dbpass = "Qwertyui1";
const dbuser = "neyon71133";
mongoose.connect(`mongodb+srv://${dbuser}:${dbpass}@cluster0.zbdv8in.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });