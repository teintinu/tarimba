var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

io.on('connection', function (socket) {
    console.log('Um usuário se conectou ao servidor');

    socket.broadcast.emit('welcome', "Um usuário entrou na sala");

    socket.on('disconnect', function () {
        socket.broadcast.emit('bye', "Um usuário saiu da sala");
    });

    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});
