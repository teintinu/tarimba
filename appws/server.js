var WebSocketServer = require('ws').Server,
    http = require('http'),
    express = require('express'),
    app = express.createServer();

app.use(express.static(__dirname));
app.listen(10000);

var wss = new WebSocketServer({
    server: app
});

wss.broadcast = function broadcast(data) {
    wss.clients.forEach(function each(client) {
        client.send(data);
    });
};

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(payload) {
        if (payload.type == "chat" && payload.room == '1')
            ws.broadcast('received: ' + payload.message);
    });

    ws.send('something');
});
