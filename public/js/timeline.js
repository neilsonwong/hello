function Timeline() {
	this.date = null;
	this.acc = 0;
	this.offset = -1;
	this.playlist;
	this.playlists = {};
	this.urlSet = new Set();
	this.stopped = true;
	this.graphs = {};
	this.fullSongMode = false;
	this.divergence = 0;
	this.overline = $(".overline");
	this.resizeFunctions = [];
	this.animations = [];
	this.animations.push(this.animateLine.bind(this));
	this.alive = true;
	this.ready = false;
	this.mode = null;
}

Timeline.prototype.init = function(audioMaster, offset){
	this.audioDevice = audioMaster;
	this.offset = offset || 0;

	this.getPlayList(() => {
		this.preloadImage(offset);
		this.setPlayMode("chronological", offset || 0, () => {
			this.ready = true;
			requestAnimationFrame(this.animate.bind(this));
		});
	});

	this.initYearbox();
	$(window).resize(this.onResize.bind(this));
}

Timeline.prototype.exit = function(){
	//stop a few things mainly
	//stop resize listeners
	console.log("exit timeline")
	$(window).off("resize", Timeline.onResize);

	//stop audio playing
	if (!this.stopped){
		this.pause();
		this.stop();
	}

	//stop animations
	this.alive = false;
}

Timeline.prototype.setFullSongMode = function(mode){
	this.fullSongMode = mode;
	return this.fullSongMode;
};

Timeline.prototype.toggleFullSongMode = function(){
	this.fullSongMode = !this.fullSongMode;
	return this.fullSongMode;
};

Timeline.prototype.toggleFullSong = function(){
	let origUrl = this.currentUrl();
	this.stop();
	++this.divergence;
	this.elapsed = Date.now() - this.playPauseTime;

	if (this.toggleFullSongMode()){
		$("#btn-tl-repeat").addClass("activated");
		this.load(this.currentUrl(), () => {
			this.swapAudioTrack(origUrl, this.currentUrl());
		});
	}
	else {
		$("#btn-tl-repeat").removeClass("activated");
		//no point of swapping audio since we already have loaded the whole song lol

		//bit hacky but will work
		this.stopped = false;
		this.addInfo();

		//fix play pause time

		this.playPauseTime = Date.now();
		if (this.elapsed > 0){
			this.playPauseTime = Date.now() - this.elapsed;
			this.elapsed = 0;
		}

		this.progressWeek(this.current().duration);
	}
};

Timeline.prototype.start = function(){
	if (this.bufferingAudio){
		console.log("still buffering");
		return;
	}
	this.stopped = false;
	this.addInfo();
	this.play();
	this.progressWeek(this.current().duration);
}

Timeline.prototype.progressWeek = function(duration, step, divergence){
	//if we are done with this week, go to the next
	if (this.stopped){
		//if we are stopped
		return;
	}

	if (divergence !== undefined && this.divergence !== divergence){
		//this is a recursive call but we have diverged, don't do anything
		return;
	}

	let total = this.current().duration;
	let elapsed = Date.now() - this.playPauseTime;
	if (elapsed >= total){
		console.log("next week!");
		this.acc = 0;
		this.next();
		return;
	}

	//figure out how much we need to step by, cuz first call
	if (!step){
		step = duration / 7;
	}
	let wait = duration < step ? 0 : duration - step;

	//update date
	setTimeout((function(wait, step, divergence) {
		this.incDate();
		this.progressWeek(wait, step, divergence);
	}).bind(this, wait, step, this.divergence), step);
}

Timeline.prototype.incDate = function(){
	if (this.stopped){
		return;
	}
	this.date.setDate(this.date.getDate()+1);
	this.updateDate();
}

Timeline.prototype.regressWeek = function(){
	//this current should be regressed already
	//set date to 1 day before 
	this.date = new Date(this.current().week *1000);
	this.acc = 0;
	this.progressWeek(this.current().duration);
};

Timeline.prototype.updateDate = function(){
	$(".dateBox").html([
		this.date.getDate(),
		// "<span class=\"heavy\">" +
        (this.date.getMonth()+1),
		// "</span>",
		this.date.getFullYear()
	].join("."));
	$("#yearbox a").removeClass("active");
	$("#year"+this.date.getFullYear()).addClass("active");
};

Timeline.prototype.loadSurrounding = function(callback){
	console.log("load surrounding called")
	//turn on buffering mode
	this.bufferingMode(true);

	let small = Math.max(0, this.offset - 3);
	let big = Math.min(this.playlist.length, this.offset + 4);

	if (this.fullSongMode){
		small = Math.max(0, this.offset - 1);
		big = Math.min(this.playlist.length, this.offset + 2);
	}

	let tbl = [];
	for(let i = small; i < big; ++i){
		tbl.push(this.getMp3Url(i));
	}

	this.load(tbl, () => {
		this.bufferingMode(false);
		if (callback){
			console.log("calling callback from loadSur")
			return callback();
		}
	});
};

Timeline.prototype.load = function(url, callback){
	console.log("load called")
	if (!Array.isArray(url)){
		url = [url];
	}

	//build new array of songs that have not been loaded
	url = url.filter((u) => {
		if (this.urlSet.has(u)){
			console.log("already loaded " + u);
			return false;
		}
		console.log("loading " + u);
		this.urlSet.add(u);
		return true;
	});

	this.audioDevice.load(url, () => {
		url.forEach( e =>  {
			console.log("loaded " + e);
		});

		if (callback){
			console.log("calling callback from load")
			return callback();
		}
	});
};

Timeline.prototype.bufferingMode = function(onOff){
	if (onOff){
		this.bufferingAudio = onOff;
		//cannot start
		//when buffering cannot press next / back buttons
		$("#btn-tl-prev").addClass("buffering");
		$("#btn-tl-next").addClass("buffering");


		//cannot progress unbuffered songs
	}
	else {
		this.bufferingAudio = onOff;
		//enable next / back buttons visually
		$("#btn-tl-prev").removeClass("buffering");
		$("#btn-tl-next").removeClass("buffering");
	}
};

Timeline.prototype.play = function(){
	//set to pause button
	setPlayPauseUI("playing");
	this.audioDevice.playResume(this.currentUrl());
	this.playPauseTime = Date.now();
	if (this.elapsed > 0){
		this.playPauseTime = Date.now() - this.elapsed;
		this.elapsed = 0;
	}
};

Timeline.prototype.pause = function(){
	//set to play button
	setPlayPauseUI("paused");
	this.audioDevice.stopPlaying(this.currentUrl());
	// this.audioDevice.stopPlaying(this.currentFullUrl());
};

Timeline.prototype.swapAudioTrack = function(origUrl, swapUrl){
	this.audioDevice.instantSwap(origUrl, swapUrl);
};

Timeline.prototype.manualPlayPause = function(){
	if (this.debouncing){
		return;
	}
	this.divergence++;
	if (this.stopped){
		this.start();
	}
	else {
		let elapsed = Date.now() - this.playPauseTime;
		this.pause();
		this.stop();
		this.elapsed = elapsed;
		console.log("saving elapsed as " + this.elapsed);
		//timeout playpause til music stops
		this.debouncing = true;
		setTimeout(() => {
			this.debouncing = false;
		} , 1100);
	}
}

Timeline.prototype.next = function(){
	if (this.bufferingAudio){
		console.log("waiting for buffering to finish");
		return setTimeout(this.next.bind(this), 500);
	}
	//actions to stop current
	let sameSong = this.currentUrl() === this.nextUrl();
	if (!sameSong){
		this.pause();
	}
	++this.offset;
	this.acc = 0;

	//check if we are done
	if (this.offset >= this.playlist.length){
		this.stop();
		return;
	}
	
	//stuff to do to init next
	this.addInfo();
	this.loadSurrounding();
	this.play();
	this.progressWeek(this.current().duration);
}

Timeline.prototype.prev = function(){
	if (this.bufferingAudio){
		console.log("waiting for buffering to finish");
		return setTimeout(this.prev.bind(this), 500);
	}
	let sameSong = this.currentUrl() === this.prevUrl();
	if (!sameSong){
		this.pause();
	}
	--this.offset;

	if (this.offset < 0){
		this.offset = 0;
	}

	this.addInfo();
	this.loadSurrounding();
	this.play();
	this.regressWeek();
}

Timeline.prototype.jump = function(index){
	//actions to stop current
	let sameSong = this.currentUrl() === this.getMp3Url(index);
	if (!sameSong){
		this.pause();
	}
	this.divergence++;
	this.offset = index;
	this.acc = 0;

	//check if we are done
	if (this.offset >= this.playlist.length){
		this.stop();
		return;
	}
	
	//stuff to do to init next
	this.addInfo();
	this.loadSurrounding(() => {
		this.play();
		this.progressWeek(this.current().duration);
	});
};

Timeline.prototype.manualNext = function(){
	if (this.bufferingAudio){
		return;
	}
	this.divergence++;
	this.next();
};

Timeline.prototype.manualPrev = function(){
	if (this.bufferingAudio){
		return;
	}
	this.divergence++;
	this.prev();
};

Timeline.prototype.current = function(){
	return this.playlist[this.offset];
}

Timeline.prototype.getMp3Url = function(i){
	return this.fullSongMode ? this.playlist[i].url : "/cut/" + (this.playlist[i].url).substring(5);
};

Timeline.prototype.getFullMp3Url = function(i){
	return this.playlist[i].url;
};

Timeline.prototype.currentUrl = function(){
	return this.getMp3Url(this.offset);
};

Timeline.prototype.currentFullUrl = function(){
	return this.getFullMp3Url(this.offset);
};

Timeline.prototype.nextUrl = function(){
	if (this.offset >= this.playlist.length){
		return null;
	}
	return this.getMp3Url(this.offset+1);
}

Timeline.prototype.prevUrl = function(){
	if (this.offset <= 0){
		return this.getMp3Url(0);
	}
	return this.getMp3Url(this.offset-1);
}

Timeline.prototype.stop = function(){
	this.stopped = true;
}

Timeline.prototype.getPlayList = function(callback){
	$.get("onsen/playlist", (data) => {
		console.log(data);
		this.playlists["chronological"] = data;
		this.playlists["top"] = data.map(addIndex).filter(filterTop);
		this.playlists["loved"] = data.map(addIndex).filter(filterLoved).map(doubleDuration);

		this.playlist = this.playlists["chronological"];

		if (callback){
			return callback();
		}
	});

	function filterTop(song){
		return song.totalPlayCount > 500;
	}

	function filterLoved(song){
		return song.loved;
	}
	function doubleDuration(song){
		song.duration = song.duration * 2;
		return song;
	}
	function addIndex(song, idx){
		song.origIndex = idx;
		return song;
	}
}

Timeline.prototype.addBarGraph = function(bg, property){
	this.graphs[property] = bg;
}

Timeline.prototype.addInfo = function(){
	Object.keys(this.graphs).forEach((property) => {
		let val = this.current()[property];
		let count = this.current().count;
		if (val !== undefined){
			this.graphs[property].add(val, count);
		}
	});
	this.updateSongMetaData();
}

Timeline.prototype.updateSongMetaData = function(){
	$("#np-title").html(this.current().title);
	$("#np-artist").html(this.current().artist);
	$("#np-weekPlayCount").html("<span class=\"heavy\">" + this.current().playCount + "</span>" + "<span class=\"light\"> plays this week</span>");
	$("#np-totalPlayCount").html("<span class=\"heavy\">" + this.current().totalPlayCount + "</span>" +"<span class=\"light\"> all time plays</span>");
	let leWeek = new Date(this.current().week*1000);
	this.date = leWeek;
	let dateString = [
		leWeek.getDate(),
        leWeek.getMonth()+1,
		leWeek.getFullYear()
	].join(".");
	$("#np-week").html("<span class=\"light\">week of </span>" + "<span class=\"heave\">" + dateString + "</span>");
	this.updateDate();

	//get bg image
	let url = "/onsen/cover/"+ (this.current().origIndex || this.offset);
	$("#bg-cover").css("background-image", "url(\"" + url + "\")" ); 
	$("#bg-blur").css("background-image", "url(\"" + url + "\")" ); 

	//preload next image
	this.preloadImage(this.offset+1);

	//set line colours
	let lineColour = this.current().colour === "" ? "#333" : this.current().colour;
	this.overline.css("background-color", lineColour);
	$(".songColour").css("background-color", lineColour);
	$(".songColourBorder").css("border-color", lineColour);
};

Timeline.prototype.preloadImage = function(offset){
	if (offset < this.playlist.length){
		let img = new Image();
		img.src = [location.protocol,
			'//', 
			location.host, 
			"/onsen/cover/", 
			((this.playlist[offset].origIndex) || (this.offset))].join("");
		console.log("preloading " + img.src);
	}
};

Timeline.prototype.attachObject = function(){
	for (let i = 0; i < arguments.length; ++i){
		if (arguments[i]["onResize"] !== undefined){
			this.resizeFunctions.push(arguments[i].onResize.bind(arguments[i]));
		}
		if (arguments[i]["onAnimate"] !== undefined){
			this.animations.push(arguments[i].onAnimate.bind(arguments[i]));
		}
	}
}

Timeline.prototype.onResize = function(){
	this.width = $(window).width();
	this.height = $(window).height();

	this.resizeFunctions.forEach((x) => x());
};

Timeline.prototype.animate = function(){
	this.animations.forEach((x) => x());
	if (this.alive){
		requestAnimationFrame(this.animate.bind(this));
	}
}

Timeline.prototype.animateLine = function(){
	//set width
	if (!this.stopped){
		let total = this.current().duration;
		let elapsed = Date.now() - this.playPauseTime;
		let progress = elapsed / total;

		//set colour
		this.overline.css("transform", ["scaleX(", progress, ") translate3d(0,0,0)"].join(""));
	}
}

Timeline.prototype.jumpToYear = function(year){
	let lastDay = new Date(year, 0, 1, 0, 0, 0) - 1;
	let i, firstWeek;
	for(i = 0; i < this.playlist.length; ++i){
		if ((this.playlist[i].week * 1000) > lastDay){
			firstWeek = i;
			console.log("jumping to " + firstWeek)
			this.jump(firstWeek);
			return;
		}
	}
};

Timeline.prototype.jumpRandom = function(){
	let newIndex = Math.round(Math.random() * this.playlist.length-1);
	this.jump(newIndex);
};

Timeline.prototype.setPlayMode = function(mode, offset, callback){
	if (mode === this.mode){
		console.log("same mode");
		console.log(mode);
		return;
	}

	if (typeof offset === "function"){
		offset = 0;
		callback = offset;
	}

	//kill playing things
	this.pause();
	this.stop();

	//change mode
	this.mode = mode;
	console.log("set mode: " + mode);

	switch(mode){
		case "loved":
			this.setFullSongMode(true);
			break;
		case "top":
			this.setFullSongMode(false);
			break;
		default:
			this.setFullSongMode(false);
	}

	//swap playlist
	setPlayModeUI(mode);
	this.playlist = this.playlists[mode];
	this.offset = offset;
	this.acc = 0;

	this.date = new Date(this.current().week *1000);
	this.updateDate();
	this.loadSurrounding(() => {
		if (callback){
			callback();
		}
	});
};

Timeline.prototype.initYearbox = function initYearbox(){
	let $yearbox = $("#yearbox");
	let curDate = new Date();
	console.log(curDate.getFullYear());
	for (let i = 2011; i <= curDate.getFullYear(); ++i){
		let $link = $("<a>", {id: "year"+i, html: i}).on("click", this.jumpToYear.bind(this, i));
		$yearbox.append($link);
	}
}

function setPlayModeUI(mode) {
	$(".onsen-extra button").removeClass("active");
	switch(mode){
		case "loved":
			$("#btn-loved-onsen").addClass("active");
			break;
		case "top":
			$("#btn-top-onsen").addClass("active");
			break;
		default:
			$("#btn-time-onsen").addClass("active");
	}
}

function setPlayPauseUI(mode) {
	let $btn = $("#btn-tl-playpause");
	if (mode === "paused"){
		$btn.attr("data-playing", "paused");
		$btn.find("i").first().html("play_arrow");
	}
	else {
		$btn.attr("data-playing", "playing");
		$btn.find("i").first().html("pause");
	}
}
