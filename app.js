let express = require("express");
let app = express();
let favicon = require('serve-favicon');
let ms = require('mediaserver');

app.use(favicon(__dirname + '/public/favicon.ico'));

app.set("view engine", "ejs");

//statics
app.use(express.static('public'))
app.use('/mp3', express.static('mp3'));

app.get('/', function(req, res){
    res.render("pages/index");
});

app.get('/about', function(req, res){
    res.render("pages/about");
});

app.get('/onsen', function(req, res){
    res.render("pages/onsen");
});

app.get('/blog', function(req, res){
    res.render("pages/blog");
});

// app.get(encodeURI('/mp3/01 三日月.mp3'), function(req, res){
//     console.log("mikazuki");
//     ms.pipe(req, res, __dirname + "/mp3/01 三日月.mp3");
// });

// app.get(encodeURI('/mp3/02.Over the clouds.mp3'), function(req, res){
//     console.log("mikazuki");
//     ms.pipe(req, res, __dirname + "/mp3/02.Over the clouds.mp3");
// });

app.listen(4000);