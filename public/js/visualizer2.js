function Visualizer2(audioContext, options) {
    this.audioCtx = audioContext;
    this.analyser = audioContext.createAnalyser();
    this.visualizer = document.querySelector('.visualizer');
    this.canvasCtx = this.visualizer.getContext("2d");
    this.binCount = 0;
    this.screenHeight = $(window).height();
    this.screenWidth = $(window).width();
    console.log(this.screenWidth + ", " + this.screenHeight);
    this.dataArray = [];
    this.parent = null;
}

Visualizer2.prototype.get = function() {
    return this.analyser;
};

Visualizer2.prototype.run = function() {

    //if nothing shows up, up the fft size
    this.analyser.fftSize = 128;
    this.binCount = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.binCount);

    this.init();
}

Visualizer2.prototype.clear = function() {
    this.canvasCtx.clearRect(0, 0, this.boxWidth, this.boxHeight);
};

Visualizer2.prototype.init = function() {

    //if nothing shows up, down the numOfBars
    this.numOfBars = 128;
    this.boxWidth = this.screenWidth;
    this.boxHeight = Math.floor(this.screenHeight / 3);

    this.visualizer.width = this.boxWidth;
    this.visualizer.height = this.boxHeight;

    this.volumeModifier = 1;
    this.clear();
};

Visualizer2.prototype.onResize = function(){
    this.screenHeight = $(window).height();
    this.screenWidth = $(window).width();

    this.boxWidth = this.screenWidth / (this.numOfBars) - 1;
    this.boxHeight = Math.floor(this.screenHeight / 3);

    this.visualizer.width = this.boxWidth;
    this.visualizer.height = this.boxHeight;
};

Visualizer2.prototype.onAnimate = function() {
    this.analyser.getByteFrequencyData(this.dataArray);
    this.canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    this.clear();

    let barWidth = (this.boxWidth / this.binCount);
    let barHeight;
    let x = 0;

    for(let i = 0; i < this.binCount; ++i) {
        barHeight = this.dataArray[i];
        if (this.parent && this.parent.themeColour){
            this.canvasCtx.fillStyle = this.parent.themeColour;
        }
        else {
            this.canvasCtx.fillStyle = 'rgb(' + (barHeight+100) + ',50,50)';
        }

        this.canvasCtx.fillRect(
            x,
            this.boxHeight-barHeight/2,
            barWidth,
            barHeight/2
        );

        x += barWidth + 1;
    }
};