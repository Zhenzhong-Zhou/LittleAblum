const express = require("express");
const app = express();
const router = require('./controller/router');
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(3001);
console.log("Server is running 3001");

// Set modules engine
app.set("view engine", "ejs");

// Router Middleware
// Static Page
app.use(express.static("./public"));
app.use(express.static("./uploads"));

// Get Home Page
app.get('/', router.showIndex);
// Get Different Album's Router
app.get('/:albumName', router.showAlbum);
// Get Upload Router
app.get('/upload', router.showUpload);
// Do Post Action to Upload
app.post('/upload', router.doPost);


// The Last Middleware: 404 Page
app.use((req, res) => {
    res.render("404");
});

io.sockets.on('connection', (socket) => {
    // Connect
    connections.push(socket);
    console.log('Connected: %s sockets connected', socket.id, connections.length);

    // Disconnect
    socket.on('disconnect', () => {
        users.splice(users.indexOf(socket.username), 1);
        updateUserNames();
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected', socket.id, connections.length);
    });

    // Send Message
    socket.on('send message', (data) => {
        console.log(data);
        io.sockets.emit('new message', {msg: data, user: socket.username})
    });

    // New User
    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUserNames();
    });

    function updateUserNames() {
        io.sockets.emit('get users', users);
    }
});