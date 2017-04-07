//audio functions for ma page
function Audio (){
    // init audio context so our page is ready
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();
    this.soundBuffers = {};
    this.sounds = {};
}

Audio.prototype.load = function(sounds){
    //we should support arrays or strings
    if (!Array.isArray(sounds)){
        //if it's not an array... it is now an array lol
        sounds = [sounds];
    }

    var doneLoading = function (bufferList, urls) {
        var addSoundToBuffer = function (url, i){
            this.soundBuffers[url] = bufferList[i];
        }.bind(this);

        urls.forEach(addSoundToBuffer);
    }.bind(this);

    var bufferLoader = new BufferLoader (this.context, sounds, doneLoading);
    bufferLoader.load();
};

Audio.prototype.playPause = function playPause(url) {
    var sound = this.sounds[url];
    // start
    if (!sound){
        this.start(url);
    }
    //pause
    else if (sound.startedAt && sound.pausePoint === -1){
        this.pause(url);
    }
    //resume
    else if (sound.pausePoint > 0){
        this.resume(url);
    }
}

Audio.prototype.start = function(url, oldPause){
    //add sound
    var sound = this.context.createBufferSource();
    sound.buffer = this.soundBuffers[url];
    sound.connect(this.context.destination);
    
    //start sound
    if (oldPause) {
        //we are resuming
        sound.startedAt = Date.now() - oldPause;
        sound.start(0, oldPause / 1000);
    }
    else {
        sound.startedAt = Date.now();
        sound.start(0);
    }
    sound.pausePoint = -1;
    this.sounds[url] = sound;
}

Audio.prototype.resume = function play(url) {
    //if sounds expired or unmade, bind it to the correct buffer
    this.start(url, this.sounds[url].pausePoint);
}

Audio.prototype.pause = function pause(url, offset) {
    sound = this.sounds[url];
    sound.stop(0);
    sound.pausePoint = Date.now() - sound.startedAt;
}


