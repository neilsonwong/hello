function Timeline() {
	this.date = null;
	this.acc = 0;
	this.offset = -1;
	this.loadOffset = -1;
	this.playlist = [];
	this.urlSet = new Set();
	this.stopped = false;
	this.graphs = {};
}

Timeline.prototype.init = function(audioMaster){
	this.audioDevice = audioMaster;
    $(window).resize(Timeline.onResize);

	this.offset = 0;
	this.loadOffset = 3;

	this.getPlayList(() => {
		this.loadOffset = 3;
		console.log(this.playlist.slice(0, 3).map(v => v.url));
		timeline.load(this.playlist.slice(0, 3).map(v => v.url));
	});

	this.date = new Date(2011, 10, 23);
	this.updateDate();
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
	].join("/"));
	++this.acc;
}

Timeline.prototype.loadNext = function(){
	this.load(this.playlist[this.loadOffset++].url);
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
	this.audioDevice.playPause(this.current().url);
}

Timeline.prototype.manualPlayPause = function(){
	if (this.stopped){
		this.start();
	}
	else {
		this.audioDevice.playPause(this.current().url);
		this.stop();
	}
}

Timeline.prototype.next = function(){
	//actions to stop current
	this.audioDevice.playPause(this.current().url);
	++this.offset;

	console.log(this.offset);
	console.log(this.playlist.length);
	
	//check if we are done
	if (this.offset >= this.playlist.length){
		this.stop();
		return;
	}
	
	//stuff to do to init next
	this.addInfo();
	this.loadNext();
	this.audioDevice.playPause(this.current().url);
	this.progressWeek(this.current().duration);
}

Timeline.prototype.prev = function(){
	this.audioDevice.playPause(this.current().url);
	--this.offset;
	this.audioDevice.playPause(this.current().url);
}

Timeline.prototype.current = function(){
	return this.playlist[this.offset];
}

Timeline.prototype.stop = function(){
	this.stopped = true;
	console.log("we done");
}

Timeline.prototype.getPlayList = function(callback){
	$.get("onsen/playlist", (data) => {
		console.log(data);
		this.playlist = data;
		this.loadOffset = 0;
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
}

Timeline.prototype.updateSongMetaData = function(){
	/*
	"title": "everlasting song~harmonica edition",
	"artist": "YRL",
	"playCount": 1,
	"weeksAtTop": 1,
	"topWeek": "2011-10-16T12:00:00.000Z",
	"album": "everlasting song",
	*/
	console.log("write song metadata");
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