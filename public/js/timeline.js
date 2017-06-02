function Timeline() {
	this.date = null;
	this.offset = -1;
	this.loadOffset = -1;
	this.playlist = [];
	this.urlSet = new Set();
}

Timeline.prototype.init = function(audioMaster){
	this.date = new Date(2011, 10, 1);
	this.updateDate();
	this.offset = 0;
	this.audioDevice = audioMaster;
	this.getPlayList();
	this.loadOffset = 3;
	timeline.load(this.playlist.slice(0, 3).map(v => v.url));
}

Timeline.prototype.start = function(){
	this.play();
	this.progressWeek(this.current().duration);
}

Timeline.prototype.progressWeek = function(duration){
	let stepTime = duration / 7;
	for (let i = 1; i < 8; ++i){
		setTimeout(this.updateDate.bind(this), stepTime*i);
	}
	setTimeout(this.next.bind(this), duration);
}

Timeline.prototype.updateDate = function(days){
	days = days || 1;
	this.date.setDate(this.date.getDate()+days);
	$(".dateBox").html([
		this.date.getDate(),
        this.date.getMonth()+1,
		this.date.getFullYear()
	].join("/"));
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

Timeline.prototype.play = function(){
	this.audioDevice.playPause(this.current().url);
}

Timeline.prototype.next = function(){
	this.audioDevice.playPause(this.current().url);
	++this.offset;
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

Timeline.prototype.getPlayList = function(){
	this.playlist = STUB_urls;
	this.loadOffset = 0;
}

function tl_start(){
	timeline.start();
}

function audio_playPause(){
	timeline.play();
}

function audio_prev(){
	timeline.prev();
}

function audio_next(){
	timeline.next();
}

function audio_loadNext(){
    timeline.load(this.playlist[this.loadOffset++].url);
}

var STUB_urls = [
	{
		url: encodeURI('/mp3/01 三日月.mp3'),
		count: 20,
		duration: 7000,
		img: null
	},
	{
	    url: encodeURI('/mp3/02.Over the clouds.mp3'),
		count: 25,
		duration: 7000,
		img: null
	},
	{
		url: encodeURI('/mp3/01 三日月.mp3'),
		count: 20,
		duration: 7000,
		img: null

	},
	{
	    url: encodeURI('/mp3/02.Over the clouds.mp3'),
		count: 25,
		duration: 7000,
		img: null
	},
	{
		url: encodeURI('/mp3/01 三日月.mp3'),
		count: 20,
		duration: 7000,
		img: null

	},
	{
	    url: encodeURI('/mp3/02.Over the clouds.mp3'),
		count: 25,
		duration: 7000,
		img: null
	},
	{
		url: encodeURI('/mp3/01 三日月.mp3'),
		count: 20,
		duration: 7000,
		img: null

	},
	{
	    url: encodeURI('/mp3/02.Over the clouds.mp3'),
		count: 25,
		duration: 7000,
		img: null
	},
];