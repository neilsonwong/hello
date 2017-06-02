function Timeline() {
	this.date = null;
	this.offset = -1;
	this.urlList = [];
}

Timeline.prototype.init = function(audioMaster){
	this.date = new Date(2011, 10, 1);
	this.offset = 0;
	this.audioDevice = audioMaster;
	setInterval(this.updateDate.bind(this), 1000);
}

Timeline.prototype.updateDate = function(){
	this.date.setDate(this.date.getDate()+1);
	$(".dateBox").html([
		this.date.getDate(),
        this.date.getMonth()+1,
		this.date.getFullYear()
	].join("/"));
}

Timeline.prototype.load = function(url, callback){
	this.audioDevice.load(url, () => {
		this.urlList.push(url);
		console.log("loaded " + url);
		if (callback){
			return callback();
		}
	});
}

Timeline.prototype.play = function(){
	this.audioDevice.play(this.urlList[this.offset]);
}

Timeline.prototype.next = function(){
	this.audioDevice.pause(this.urlList[this.offset]);
	++this.offset;
	this.audioDevice.play(this.urlList[this.offset]);
}

Timeline.prototype.prev = function(){
	this.audioDevice.pause(this.urlList[this.offset]);
	--this.offset;
	this.audioDevice.play(this.urlList[this.offset]);
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
    timeline.load(STUB_urls[glob_stub_url++]);
}

var STUB_urls = [
    encodeURI('/mp3/01 三日月.mp3'),
    encodeURI('/mp3/02.Over the clouds.mp3')
];

var glob_stub_url = 0;