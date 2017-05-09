function Visualizer(audioContext){
	this.audioCtx = audioContext;
	this.analyser = audioContext.createAnalyser();
	this.canvas = document.querySelector('.visualizer');
	this.canvasCtx = this.canvas.getContext("2d");
}

Visualizer.prototype.get = function(){
	return this.analyser;
};

Visualizer.prototype.visualize = function visualize() {
	var self = this;
    var WIDTH = this.canvas.width;
    var HEIGHT = this.canvas.height;

    var visualSetting = "sinewave";
    console.log(visualSetting);

    if (visualSetting == "sinewave") {
        this.analyser.fftSize = 2048;
        var bufferLength = this.analyser.frequencyBinCount; // half the FFT value
        var dataArray = new Uint8Array(bufferLength); // create an array to store the data

        this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        function draw(){

            console.log("drawing");

            drawVisual = requestAnimationFrame(draw);

            self.analyser.getByteTimeDomainData(dataArray); // get waveform data and put it into the array created above

            self.canvasCtx.fillStyle = 'rgb(200, 200, 200)'; // draw wave with canvas
            self.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            self.canvasCtx.lineWidth = 2;
            self.canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

            self.canvasCtx.beginPath();

            var sliceWidth = WIDTH * 1.0 / bufferLength;
            var x = 0;

            for (var i = 0; i < bufferLength; i++) {

                var v = dataArray[i] / 128.0;
                var y = v * HEIGHT / 2;

                if (i === 0) {
                    self.canvasCtx.moveTo(x, y);
                }
                else {
                    self.canvasCtx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            self.canvasCtx.lineTo(self.canvas.width, self.canvas.height / 2);
            self.canvasCtx.stroke();
        };

        draw();

    }
    else if (visualSetting == "off") {
        this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
        this.canvasCtx.fillStyle = "red";
        this.canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    }
}
