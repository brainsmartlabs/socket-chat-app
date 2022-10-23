const express = require("express");
const app = express();
const server = require('http').createServer(app);
const sock = require('socket.io');
const io = sock(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
}); 

server.listen(3300, () => {
    console.log("App listning at port 3300");
});

io.on("connection", (socket) => {
    console.log("new user is connected to the server");
    let name;

    socket.on("new user", (username) => {
        name = username;
        const str = '~' + name + ' has just joined';
        io.emit('new message', str);
    });

    socket.on('new message', (message) => {
        const str = name + " says:" + message;
        socket.broadcast.emit('new message', str);
    });

    socket.on("disconnect", () => {
        const str = '|' + name + " has left the chat room";
        io.emit('new message', str);
    });
});


