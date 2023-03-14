var express = require('express');
var app = express();
var serv = require('http').Server(app);
var path = require('path');
// var Chess = require('Rook');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')))
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')))

// Start of server
serv.listen(2000);
console.log('Server started at localhost:2000');

var SOCKET_LIST = {};
var io = require('socket.io') (serv, {});

io.sockets.on('connection', function(socket) {
    console.log("Socket connection");

    // Generate unique sockets for each player
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    // Receive message 'xx'
    socket.on('xx', function(data) {
        console.log('Received:' + data.object);
    });

    // Send message 'serverMsg'
    socket.emit('serverMsg', {msg: 'RawrXD'});
});