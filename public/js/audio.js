//audio functions for ma page
//abstraction for pause play functionality, can inject other audioNodes in for processing
function Audio (audioContext){
    this.context = audioContext;
    this.soundBuffers = {};
    this.gainNodes = {};
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
                console.log("cb1")
                return done();
            }
        }.bind(this);

        urls.forEach(addSoundToBuffer);
        if (urls.length === 0 && this.loading === 0 && done){
            console.log("cb2")
            return done();
        }
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
        this.fadeIn(url, this.start.bind(this, url));
    }
    //pause
    else if (sound.startedAt && sound.pausePoint === -1){
        // this.pause(url);
        this.fadeOut(url);
    }
    //resume
    else if (sound.pausePoint > 0){
        this.fadeIn(url, this.resume.bind(this, url));
    }
};

Audio.prototype.playResume = function(url){
    var sound = this.sounds[url];
    // start
    if (!sound){
        this.fadeIn(url, this.start.bind(this, url));
    }
    //resume
    else if (sound.pausePoint > 0){
        this.fadeIn(url, this.resume.bind(this, url));
    }
};

Audio.prototype.stopPlaying = function(url){
    var sound = this.sounds[url];
    if (sound && sound.startedAt && sound.pausePoint === -1){
        this.fadeOut(url);
    }
};

Audio.prototype.instantSwap = function(playingUrl, swapUrl){
    this.pause(playingUrl);
    this.start(swapUrl, this.sounds[playingUrl].pausePoint);
};

Audio.prototype.start = function(url, oldPause){
    console.log("starting " + url + " " + oldPause);
    //add sound
    var sound = this.context.createBufferSource();
    var gainNode = this.context.createGain ? this.context.createGain() : this.context.createGainNode();
    sound.buffer = this.soundBuffers[url];

    //attach nodes to sound
    var i;
    for (i = 0; i < this.audioNodes.length; ++i){
        sound.connect(this.audioNodes[i]);
    }
    sound.connect(gainNode);
    // sound.connect(this.context.destination);    //speaker output
    gainNode.connect(this.context.destination);
    
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
    this.gainNodes[url] = gainNode;
};
Audio.prototype.play = Audio.prototype.start;

Audio.prototype.resume = function play(url) {
    //if sounds expired or unmade, bind it to the correct buffer
    this.start(url, this.sounds[url].pausePoint);
};

Audio.prototype.fadeIn = function fadeIn(url, startFn, time) {
    if (time === undefined){
        time = 1500;
    }
    startFn();
    var i;
    for (i = 0; i < time; i += 50){
        let gain = i / time;
        setTimeout(() => {
            this.gainNodes[url].gain.value = gain;
        }, i);
    }
}

Audio.prototype.fadeOut = function fadeOut(url, time) {
    if (time === undefined){
        time = 1500;
    }
    var i;
    for (i = 0; i < time; i += 50){
        let gain = (time - i) / time;
        setTimeout(() => {
            this.gainNodes[url].gain.value = gain;
        }, i);
    }
    setTimeout(this.pause.bind(this, url), time);
}

Audio.prototype.pause = function pause(url) {
    var sound = this.sounds[url];
    if (sound){
        sound.stop(0);
        sound.pausePoint = Date.now() - sound.startedAt;
    }
};