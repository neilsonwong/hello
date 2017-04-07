let express = require("express");
let app = express();
let favicon = require('serve-favicon');
let ms = require('mediaserver');

app.use(favicon(__dirname + '/public/favicon.ico'));

//statics
app.use(express.static('public'))
app.use('/mp3', express.static('mp3'));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/html/index.html");
});

app.get('/onsen', function(req, res){
    res.sendFile(__dirname + "/html/onsen.html");
});

// app.get(encodeURI('/mp3/01 三日月.mp3'), function(req, res){
//     console.log("mikazuki");
//     ms.pipe(req, res, __dirname + "/mp3/01 三日月.mp3");
// });

// app.get(encodeURI('/mp3/02.Over the clouds.mp3'), function(req, res){
//     console.log("mikazuki");
//     ms.pipe(req, res, __dirname + "/mp3/02.Over the clouds.mp3");
// });

app.listen(3000);