function Timeline() {
	this.date = null;
	this.acc = 0;
	this.offset = -1;
	this.playlist = [];
	this.urlSet = new Set();
	this.stopped = false;
	this.graphs = {};
	this.fullSongMode = false;
	this.secondaryAudioDevice = null;
}

Timeline.prototype.init = function(audioMaster){
	this.audioDevice = audioMaster;
    $(window).resize(Timeline.onResize);

	this.date = new Date(2011, 9, 22);
	this.updateDate();

	this.offset = 0;

	this.getPlayList(() => {
		this.loadSurrounding();
	});
}

Timeline.toggleFullSongMode = function(){
	let tmp = this.audioDevice;
	if (this.secondaryAudioDevice){
		//swap audio devices
		this.audioDevice = secondaryAudioDevice;
		this.secondaryAudioDevice = tmp;
	}
	else {
		console.log("no secondary audio device exists");
		return null;
	}
	this.fullSongMode = !this.fullSongMode;
	return this.fullSongMode;
}

Timeline.prototype.start = function(){
	this.stopped = false;
	this.addInfo();
	this.playPause();
	this.progressWeek(this.current().duration);
}

Timeline.prototype.progressWeek = function(duration, step){
	//if we are done with this week, go to the next
	if (this.stopped){
		//if we are stopped
		return;
	}

	if (this.acc > 7){
		console.log("next week!");
		this.acc = 0;
		this.next();
		return;
	}

	//figure out how much we need to step by
	if (!step){
		step = duration / 7;
	}
	let wait = duration < step ? 0 : duration - step;

	//update date
	this.updateDate();
	setTimeout(this.progressWeek.bind(this, wait, step), step);
}

Timeline.prototype.updateDate = function(days){
	days = days || 1;
	this.date.setDate(this.date.getDate()+days);
	$(".dateBox").html([
		this.date.getDate(),
        this.date.getMonth()+1,
		this.date.getFullYear()
	].join("."));
	++this.acc;
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

Timeline.prototype.playPause = function(){
	this.audioDevice.playPause(this.currentUrl());
}

Timeline.prototype.manualPlayPause = function(){
	if (this.stopped){
		this.start();
	}
	else {
		this.audioDevice.playPause(this.currentUrl());
		this.stop();
	}
}

Timeline.prototype.next = function(){
	//actions to stop current
	if (!this.currentUrl()){
		++this.offset;
		return this.next();
	}
	this.audioDevice.playPause(this.currentUrl());
	++this.offset;

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
	this.audioDevice.playPause(this.currentUrl());
	this.progressWeek(this.current().duration);
}

Timeline.prototype.prev = function(){
	if (this.offset === 0){
		return;
	}
	this.audioDevice.playPause(this.currentUrl());
	this.loadSurrounding();
	--this.offset;
	this.audioDevice.playPause(this.currentUrl());
}

Timeline.prototype.current = function(){
	return this.playlist[this.offset];
}

Timeline.prototype.getMp3Url = function(i){
	return this.fullSongMode ? this.playlist[i].url : "/cut/" + (this.playlist[i].url).substring(5);
};

Timeline.prototype.currentUrl = function(){
	return this.getMp3Url(this.offset);
};

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
};


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