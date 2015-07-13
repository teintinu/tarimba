var express = require('express'),
app = express();

app.use(express.static(__dirname + '/www'));

app.get('/', function(req, res){
    res.send('index.html');
});
app.listen('3000');
console.log('server iniciado em localhost:3000');


