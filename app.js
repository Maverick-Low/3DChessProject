var express = require('express');
var app = express();
var serv = require('http').Server(app);
var path = require('path');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));
app.use('/build/', express.static(path.join(__dirname, 'node_modules/three/build')));
app.use('/jsm/', express.static(path.join(__dirname, 'node_modules/three/examples/jsm')));
app.use('/gsap/', express.static(path.join(__dirname, 'node_modules/gsap')));

// Start of server
serv.listen(2000);
console.log('Server started at localhost:2000');

var SOCKET_LIST = new Array();
var io = require('socket.io') (serv, {});
var allRooms = new Array();
var numberOfSockets = 0;

io.sockets.on('connection', function(socket) {

    numberOfSockets++;
    // Check for disconnects
    socket.on('disconnect', function() {
        console.log(socket.id + ' disconnected');
        delete SOCKET_LIST[socket.id];
    });

    // Generate unique sockets for each player
    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    console.log(socket.id + ' connected');
    // console.log(socketsRooms);
    // console.log('got5: ',io.sockets.adapter.rooms.get(5));
    // const clients = io.sockets.adapter.rooms.get(5);
    // const numClients = clients ? clients.size : 0;
    // console.log(numClients);
    
    // ---------------------------------------- Handling online game ---------------------------------------- //
    
    socket.on('swapColor', function(hostIsWhite) {
        console.log('isWhite:', hostIsWhite);
        socket.emit('colorChanged', hostIsWhite);
    });

    // Send move to OTHER sockets in the same room
    socket.on('move', function(data) {

        for(let i in SOCKET_LIST) {
            const otherSocket = SOCKET_LIST[i];
            const sameRoom = otherSocket.rooms.has(data.room);
            if(!(otherSocket === socket) && sameRoom) { 
                otherSocket.emit('receivedMove', data);
                break;
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
            allRooms.push({roomID: roomID, noOfPlayers: 1, host: socket.id});
        }
        
    });
    
    // Join room and update noOfPlayers in that room
    socket.on('joinRoom', function(roomID) {
        // const roomJoined = allRooms.find(theRoom => theRoom.roomID === roomID)
        const room = io.sockets.adapter.rooms.get(roomID);

        let roomSize = room? room.size : 0;
        if(roomSize < 2) {
            console.log('joined room:   ', roomID);
            socket.join(roomID);
            roomSize = room? room.size : 0;
            const currentAllRoom = allRooms.find((x) => x.roomID == roomID);
            currentAllRoom.noOfPlayers = roomSize;
        }
    });

    // Update list of rooms
    socket.on('updateRoomList', function() {
        socket.emit('fetchRooms', allRooms);  
    });

    // Leave room and remove room from array
    socket.on("leaveRoom", function(room) {
        socket.leave(room);
        const roomLeft = allRooms.find(theRoom => theRoom.roomID === room)
        if(socket.id === roomLeft.host) {
            const index = allRooms.indexOf(roomLeft);
            allRooms.splice(index, 1);
        }
        else {
            roomLeft.noOfPlayers--;
        }
    });

    // Function for testing
    socket.on('test', function() {
        console.log(SOCKET_LIST[socket.id]);

        // for(room in socket.rooms) {
        //     socket.leave(socket.rooms(room));
        // }
    });

});