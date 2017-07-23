"use strict";

let express = require("express");
let app = express();
let favicon = require("serve-favicon");
let path = require("path");
let config = require("./config");
let utils = require("./utils");
let Onsen = require("onsenbackend")(
	config.lastfmAPIKey,
	config.lastfmUsername,
	config.beginningOfTime,
	config.localMusicDir,
	config.onsenDataLocation);
let weekly = [];

app.use(favicon(__dirname + "/public/favicon.ico"));

app.set("view engine", "ejs");

//statics
app.use(express.static("public"));
app.use("/mp3", express.static("mp3"));
app.use("/cut", express.static("cut_mp3"));

app.get("/", function(req, res){
	res.render("pages/index", {
		page: "home",
		title: "hello" 
	});
});

app.get("/about", function(req, res){
	res.render("pages/index", {
		page: "about",
		title: "about" 
	});
});

app.get("/onsen", function(req, res){
	res.render("pages/index", {
		page: "onsen",
		title: "音線"
	});
});

app.get("/lovelive", function(req, res){
	res.render("pages/index", {
		page: "lovelive",
		title: "love live" 
	});
});

app.get("/blog", function(req, res){
	res.render("pages/index", {
		page: "blog",
		title: "rin's blog" 
	});
});

app.get('/ow', function(req, res){
    res.render("pages/index", {
        page: "owtraining",
        title: "overwatch training" 
    });
});

app.get('/ow', function(req, res){
    res.render("pages/index", {
        page: "owtraining",
        title: "overwatch training" 
    });
});

let renderPartials = function(req, res){
	console.log("getting partial " + req.params.page);
	res.render("partials/"+req.params.page, {
		page: req.params.page,
		title: req.params.page
	});
};

app.get("/partial/", function(req, res){
	req.params.page = "home";
	renderPartials(req, res);
});

app.get("/partial/:page", renderPartials);

app.get("/onsen/playlist", function(req, res){
	res.set({ "content-type": "application/json; charset=utf-8" });
	Onsen.getWeekly(() => {
		res.sendFile(path.join(config.onsenDataLocation, "weekly.json"));
	});
});

app.get("/onsen/cover/:weekid", function(req, res){
	if (req.params.weekid >= weekly.length){
		try {
			weekly = require(path.join(config.onsenDataLocation, "weekly"));
		}
		catch(e){
			console.log("couldn't find weekly");
			return;
		}
	}
	let artist = weekly[req.params.weekid].artist;
	let title = weekly[req.params.weekid].title;
	let hashed = utils.hash(artist + " - " + title);
	utils.matchFile(path.join(__dirname, "public", "images", "covers"), hashed)
		.then(cover => {
			if (cover === null){
				// send default
				res.sendFile(__dirname + "/public/images/default.png");
			}
			else {
				res.sendFile(cover);
			}
		});
});

// app.get('/onsen/cutcut', function(req, res){
//     onsen.cutsongs(() => {
//         console.log("songs have been cut");
//     })
// });

// app.get('/onsen/copycopy', function(req, res){
//     Onsen.copyWeeklyToNewFolder("/home/rin/musicStorage", () => {
//         console.log("songs have been moved");
//     })
// });

app.listen(4000);
