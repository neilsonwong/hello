//audio functions for ma page
//abstraction for pause play functionality, can inject other audioNodes in for processing
function Audio (audioContext){
    this.context = audioContext;
    this.soundBuffers = {};
    this.sounds = {};
    this.loading = 0;
    this.audioNodes = [];
}

Audio.prototype.load = function(sounds, done){
    //we should support arrays or strings
    if (!Array.isArray(sounds)){
        //if it's not an array... it is now an array lol
        sounds = [sounds];
    }

    //add a semaphore
    this.loading += sounds.length;

    var doneLoading = function (bufferList, urls) {
        var addSoundToBuffer = function (url, i){
            this.soundBuffers[url] = bufferList[i];
            this.loading--;
            if (this.loading === 0 && done){
                return done();
            }
        }.bind(this);

        urls.forEach(addSoundToBuffer);
    }.bind(this);

    var bufferLoader = new BufferLoader(this.context, sounds, doneLoading);
    bufferLoader.load();
};

Audio.prototype.inject = function(audioNode){
    this.audioNodes.push(audioNode);
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
};

Audio.prototype.start = function(url, oldPause){
    //add sound
    var sound = this.context.createBufferSource();
    sound.buffer = this.soundBuffers[url];

    //attach nodes to sound
    var i;
    for (i = 0; i < this.audioNodes.length; ++i){
        sound.connect(this.audioNodes[i]);
    }
    sound.connect(this.context.destination);    //speaker output
    
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
};
Audio.prototype.play = Audio.prototype.start;

Audio.prototype.resume = function play(url) {
    //if sounds expired or unmade, bind it to the correct buffer
    this.start(url, this.sounds[url].pausePoint);
};

Audio.prototype.pause = function pause(url, offset) {
    var sound = this.sounds[url];
    sound.stop(0);
    sound.pausePoint = Date.now() - sound.startedAt;
};


