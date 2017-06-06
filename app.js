let express = require("express");
let app = express();
let favicon = require('serve-favicon');
let ms = require('mediaserver');
let path = require('path');
let config = require('./config');
let Onsen = require("onsenbackend")(
    config.lastfmAPIKey,
    config.lastfmUsername,
    config.beginningOfTime,
    config.localMusicDir,
    config.onsenDataLocation);

app.use(favicon(__dirname + '/public/favicon.ico'));

app.set("view engine", "ejs");

//statics
app.use(express.static('public'))
app.use('/mp3', express.static('mp3'));

app.get('/', function(req, res){
    res.render("pages/index", {
        page: "home",
        title: "hello" 
    });
});

app.get('/about', function(req, res){
    res.render("pages/index", {
        page: "about",
        title: "about" 
    });
});

app.get('/onsen', function(req, res){
    res.render("pages/onsen");
});

app.get('/blog', function(req, res){
    res.render("pages/blog");
});

app.get('/partial/:page', function(req, res){
	res.render("partials/"+req.params.page, {
		page: req.params.page,
		title: req.params.page
	});
});

app.get('/onsen/playlist', function(req, res){
    res.set({ 'content-type': 'application/json; charset=utf-8' });
    Onsen.getWeekly(() => {
        res.sendFile(path.join(config.onsenDataLocation, "weekly.json"));
    });
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