function Timeline() {
	this.date = null;
	this.acc = 0;
	this.offset = -1;
	this.playlist = [];
	this.urlSet = new Set();
	this.stopped = false;
	this.graphs = {};
	this.fullSongMode = false;
	this.divergence = 0;
	this.overline = $(".overline");
}

Timeline.prototype.init = function(audioMaster){
	this.audioDevice = audioMaster;
    $(window).resize(Timeline.onResize);

	this.date = new Date(2011, 9, 22);
	this.updateDate();

	this.offset = 19;

	this.getPlayList(() => {
		this.loadSurrounding();
		requestAnimationFrame(this.animateLine.bind(this));
	});
}

Timeline.prototype.toggleFullSongMode = function(){
	this.fullSongMode = !this.fullSongMode;
	return this.fullSongMode;
};

Timeline.prototype.start = function(){
	this.stopped = false;
	this.addInfo();
	this.playPause();
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
		console.log("diverged");
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
		// this.date = new Date(this.current().week *1000 - 86400000);
		this.date = new Date(this.current().week *1000);
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
        this.date.getMonth()+1,
		this.date.getFullYear()
	].join("."));
}

Timeline.prototype.loadSurrounding = function(){
	let small = Math.max(0, this.offset - 3);
	let big = Math.min(this.playlist.length, this.offset + 4);
	for(let i = small; i < big; ++i){
		this.load(this.getMp3Url(i));
	}
}

Timeline.prototype.load = function(url, callback){
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
			return callback();
		}
	});
}

Timeline.prototype.playPause = function(noAction){
	if (noAction !== true){
		console.log("hit play pause");
		this.audioDevice.playPause(this.currentUrl());
	}
	this.playPauseTime = Date.now();
	if (this.elapsed > 0){
		console.log(this.playPauseTime);
		this.playPauseTime = Date.now() - this.elapsed;
		console.log(this.playPauseTime);
		this.elapsed = 0;
	}
}

Timeline.prototype.manualPlayPause = function(){
	this.divergence++;
	if (this.stopped){
		this.start();
	}
	else {
		let elapsed = Date.now() - this.playPauseTime;
		this.playPause();
		this.stop();
		this.elapsed = elapsed;
		console.log("saving elapsed as " + this.elapsed);
	}
}

Timeline.prototype.next = function(){
	//actions to stop current
	let sameSong = this.currentUrl() === this.nextUrl();
	this.playPause(sameSong);
	++this.offset;
	this.acc = 0;

	// console.log(this.offset);
	// console.log(this.playlist.length);
	
	//check if we are done
	if (this.offset >= this.playlist.length){
		this.stop();
		return;
	}
	
	//stuff to do to init next
	this.addInfo();
	this.loadSurrounding();
	this.playPause(sameSong);
	this.progressWeek(this.current().duration);
}

Timeline.prototype.prev = function(){
	let sameSong = this.currentUrl() === this.nextUrl();
	this.playPause(sameSong);
	--this.offset;

	if (this.offset < 0){
		this.offset = 0;
	}

	this.addInfo();
	this.loadSurrounding();
	this.playPause(sameSong);
	this.regressWeek();
}

Timeline.prototype.manualNext = function(){
	this.divergence++;
	this.next();
};

Timeline.prototype.manualPrev = function(){
	this.divergence++;
	this.prev();
};

Timeline.prototype.current = function(){
	return this.playlist[this.offset];
}

Timeline.prototype.getMp3Url = function(i){
	return this.fullSongMode ? this.playlist[i].url : "/cut/" + (this.playlist[i].url).substring(5);
};

Timeline.prototype.currentUrl = function(){
	return this.getMp3Url(this.offset);
};

Timeline.prototype.nextUrl = function(){
	if (this.offset >= this.playlist.length){
		return null;
	}
	return this.getMp3Url(this.offset+1);
}

Timeline.prototype.prevUrl = function(){
	if (this.offset <= 0){
		return null;
	}
	return this.getMp3Url(this.offset-1);
}

Timeline.prototype.stop = function(){
	this.stopped = true;
	console.log("we done");
}

Timeline.prototype.getPlayList = function(callback){
	$.get("onsen/playlist", (data) => {
		console.log(data);
		this.playlist = data;
		if (callback){
			return callback();
		}
	});
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
	$("#np-weekPlayCount").html(this.current().playCount);
	$("#np-totalPlayCount").html(this.current().totalPlayCount);
	$("#np-week").html("week of " + (new Date(this.current().week*1000)).toISOString().substring(0, 10));
};

Timeline.prototype.animateLine = function(){
	//set width
	if (!this.stopped){
		let total = this.current().duration;
		let pageWidth = $(window).width();
		let elapsed = Date.now() - this.playPauseTime;
		let progress = pageWidth * (elapsed / (total));

		//set colour
		this.overline.css("background-color", "blue");
		this.overline.css("width", progress + "px");
	}
    requestAnimationFrame(this.animateLine.bind(this));
}

Timeline.onResize = function(){
	console.log("resizing");
	Timeline.resizeFunctions.forEach((x) => x());
};

Timeline.resizeFunctions = [];

Timeline.addResizeFunctions = function(){
	for (let i = 0; i < arguments.length; ++i){
		if (arguments[i]["onResize"] !== undefined){
			console.log("adding resize");
			Timeline.resizeFunctions.push(arguments[i].onResize.bind(arguments[i]));
		}
	}
};