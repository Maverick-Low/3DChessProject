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

    // Setting up rooms for each pair of players
    let roomNo = 1;
    let noOfPlayers = 1;

    // Keep track of number of players
    for(let i in SOCKET_LIST) {
        noOfPlayers++;
        if(noOfPlayers % 2) {
            roomNo++;
        } 
    }

    // Generate unique sockets for each player
    socket.id = Math.random();
    socket.roomNo = roomNo;
    SOCKET_LIST[socket.id] = socket;
    socket.join("room" + roomNo);

    // Check for disconnects
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        noOfPlayers--;
        delete SOCKET_LIST[socket.id];
    });

    console.log('Joined room:', roomNo);
    // console.log('socket.roomNo:', socket.roomNo);
    // console.log('room: ', socket.rooms);
    // console.log('size:', io.sockets.adapter.rooms.get('room1').size);
    // console.log(io.sockets.adapter.rooms.size);
    // console.log(socket.id + ' connected');
    // console.log('noOfPlayers: ', noOfPlayers);

    
    // Receive move from a socket
    socket.on('move', function(data) {

        // Send move to OTHER sockets
        for(let i in SOCKET_LIST) {
            const otherSocket = SOCKET_LIST[i];
            if(!(otherSocket === socket) && (otherSocket.roomNo === socket.roomNo)) { 
                otherSocket.emit('receivedMove', data);
            }
        }
    });

});