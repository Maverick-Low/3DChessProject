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
var socketsRooms = new Array(); // An array of objects to keep track of all the rooms that the client has not yet loaded into their lobby list

io.sockets.on('connection', function(socket) {
    
    // Check for disconnects
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        delete SOCKET_LIST[socket.id];

        // Delete socketsRoom object for that socket
        const socketDC = socketsRooms.find((x) => x.socketID == socket.id);
        const index = socketsRooms.indexOf(socketDC);
        if (index !== -1) {
            socketsRooms.splice(index, 1);
        }
    });

    // Generate unique sockets for each player
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    socketsRooms.push({socketID: socket.id, newRooms: new Array()});
    console.log(socket.id + ' connected');
    // console.log(socketsRooms);
    // console.log('got5: ',io.sockets.adapter.rooms.get(5));
    // const clients = io.sockets.adapter.rooms.get(5);
    // const numClients = clients ? clients.size : 0;
    // console.log(numClients);
    
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
        // Clients can only join 1 lobby
        if(socket.rooms.size < 1) {
            socket.join(roomID);
            allRooms.push({roomID: roomID, noOfPlayers: 1});

            // Adding new rooms to an array for each socket so they can refresh and these rooms will be displayed
            for(let i in SOCKET_LIST) {
                const currentSocket = SOCKET_LIST[i];
                const socketObject = socketsRooms.find((x) => x.socketID == currentSocket.id);
                if(!socketObject.newRooms.includes(roomID)) {
                    const room = io.sockets.adapter.rooms.get(roomID);
                    const roomSize = room? room.size : 0;
                    socketObject.newRooms.push({roomID: roomID, noOfPlayers: roomSize});
                }
            }
        }
        
    });
    
    // Join room
    socket.on('joinRoom', function(roomID) {
        const room = io.sockets.adapter.rooms.get(roomID);
        let roomSize = room? room.size : 0;
        if(roomSize < 2 && socket.rooms.size === 0) {
            socket.join(roomID);
            roomSize = room? room.size : 0;
            const currentAllRoom = allRooms.find((x) => x.roomID == roomID);
            currentAllRoom.noOfPlayers = roomSize;
        }
    });

    // Update list of rooms
    socket.on('updateRoomList', function() {
        const socketObject = socketsRooms.find((x) => x.socketID == socket.id);
        socket.emit('refreshRooms', socketObject.newRooms, allRooms);
        socketObject.newRooms = [];
    });
});