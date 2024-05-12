console.log("starting");
const username=localStorage.getItem("cryptid-username");
//localStorage.setItem("knk-username",username);
// Establish a connection to the server
const socket = io();

socket.on("identity", (identity) => {
    console.log("Received identity:", identity);
    socket.emit("username",username);
});


socket.on("connect_error", (error) => {
    console.error("Connection error:", error);
});

socket.on("error", (error) => {
    console.error("Socket error:", error);
});