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
var allRooms = new Array(); // An array of objects containing: roomID, noOfPlayers, host, guest

io.sockets.on('connection', function(socket) {

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
    
    socket.on('swapColor', function() {
        const [roomID] = socket.rooms;
        const currentRoom = allRooms.find((room) => room.roomID === roomID);

        if(currentRoom.guest) {
            const indexHost = currentRoom.host;
            const indexGuest = currentRoom.guest;
            const hostSocket = SOCKET_LIST[indexHost];
            const guestSocket = SOCKET_LIST[indexGuest];
            guestSocket.emit('colorChanged');
            hostSocket.emit('colorChanged');
        }
    });

    // Send move to OTHER sockets in the same room
    socket.on('move', function(data) {
        // Argument data is an object with a move and room
        const currentRoom = allRooms.find((room) => room.roomID === data.room);
        
        if(currentRoom.guest) {
            const index = socket.id === currentRoom.host? currentRoom.guest : currentRoom.host;
            const otherSocket = SOCKET_LIST[index];
            otherSocket.emit('receivedMove', data);
        }
    });

    // ---------------------------------------- Handling rooms for sockets ---------------------------------------- //

    // Create a room
    socket.on('createRoom', function(roomID) {
        // Clients can only join 1 lobby
        if(socket.rooms.size < 1) {
            allRooms.push({roomID: roomID, noOfPlayers: 1, host: socket.id, guest: null});
        }
        
    });
    
    // Join room and update noOfPlayers in that room
    socket.on('joinRoom', function(roomID) {
        const roomJoined = allRooms.find((room) => room.roomID === roomID);
        if(roomJoined.noOfPlayers < 2) {
            roomJoined.guest = socket.id;
            roomJoined.noOfPlayers++;
        }
    });

    // Update list of rooms
    socket.on('updateRoomList', function() {
        socket.emit('fetchRooms', allRooms);  
    });

    // Leave room and remove room from array if host
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