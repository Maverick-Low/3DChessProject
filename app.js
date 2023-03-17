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
var allRooms = new Array();
var socketsRooms = new Array();

io.sockets.on('connection', function(socket) {
    
    // Check for disconnects
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        delete SOCKET_LIST[socket.id];
    });

    // Generate unique sockets for each player
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    socketsRooms.push({socketID: socket.id, newRooms: new Array()});
    console.log(socket.id + ' connected');
    
    // ---------------------------------------- Receive move from a socket ---------------------------------------- //
    socket.on('move', function(data) {

        // Send move to OTHER sockets
        for(let i in SOCKET_LIST) {
            const otherSocket = SOCKET_LIST[i];
            if(!(otherSocket === socket) && (otherSocket.roomNo === socket.roomNo)) { 
                otherSocket.emit('receivedMove', data);
            }
        }
    });

    // ---------------------------------------- Handling rooms for sockets ---------------------------------------- //

    // Send available lobbies on connect
    socket.emit('fetchRooms', allRooms);  

    // Create a room
    socket.on('createRoom', function(roomID) {
        const room = roomID;
        socket.join(room);
        allRooms.push(room);

        // Adding new rooms to an array for each socket so they can refresh and these rooms will be displayed
        for(let i in SOCKET_LIST) {
            const currentSocket = SOCKET_LIST[i];
            const socketObject = socketsRooms.find((x) => x.socketID == currentSocket.id);
            if(!socketObject.newRooms.includes(roomID)) {
                socketObject.newRooms.push(roomID);
            }
        }
    });
    

    // Join room
    socket.on('joinRoom', function(room) {
        socket.join(room);
    });

    // Update list of rooms
    socket.on('updateRoomList', function() {
        const socketObject = socketsRooms.find((x) => x.socketID == socket.id);
        socket.emit('refreshRooms', socketObject.newRooms);
        socketObject.newRooms = [];
    });
});