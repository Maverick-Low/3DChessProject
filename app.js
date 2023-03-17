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
var lobbies = new Array();
var count = 0;

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
    // ---------------------------------------- Set up rooms for pairs of players  ---------------------------------------- //
    // let roomNo = 1;
    // let noOfPlayers = 1;

    // // Keep track of number of players
    // for(let i in SOCKET_LIST) {
    //     noOfPlayers++;
    //     if(noOfPlayers % 2) {
    //         roomNo++;
    //     } 
    // }

    // socket.roomNo = roomNo;
    // socket.join("room" + roomNo);
    // console.log('Joined room:', roomNo);
    // console.log('socket.roomNo:', socket.roomNo);
    // console.log('room: ', socket.rooms);
    // console.log('size:', io.sockets.adapter.rooms.get('room1').size);
    // console.log(io.sockets.adapter.rooms.size);
    // console.log(socket.id + ' connected');
    // console.log('noOfPlayers: ', noOfPlayers);

    
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
    socket.emit('lobby', lobbies);  

    // Create a room
    socket.on('createRoom', function(roomNo) {
        const room = 'room' + roomNo;
        socket.join(room);
        lobbies.push(room);
    });

    // Join room
    socket.on('joinRoom', function(room) {
        socket.join(room);
    });


    // Update list of rooms
    socket.on('updateRoomList', function(roomID) {
        const newRoom = 'room' + roomID;
        socket.broadcast.emit('refreshRooms', newRoom);    
    });
});