var express = require('express');
var app = express();
var serv = require('http').Server(app);
var path = require('path');

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
    // Generate unique sockets for each player
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;

    console.log(socket.id + ' connected');

    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        delete SOCKET_LIST[socket.id];
    });

    // Receive move from a socket
    socket.on('move', function(data) {

        // Send move to other sockets
        for(let i in SOCKET_LIST) {
            const otherSocket = SOCKET_LIST[i];
            if(!(otherSocket === socket)) {
                console.log('sent to socket: ', i);
                otherSocket.emit('receivedMove', data);
            }
            
        }
    });

});