function Visualizer(audioContext, options) {
    this.audioCtx = audioContext;
    this.analyser = audioContext.createAnalyser();
    this.visualizer = document.querySelector('.visualizer');
    this.binCount = 0;
    this.barWidth = 20;
    this.screenHeight = 500;
    this.screenWidth = 1920;
    this.dataArray = [];
}

Visualizer.prototype.get = function() {
    return this.analyser;
};

Visualizer.prototype.run = function() {
    this.clear();

    this.analyser.fftSize = 256;
    this.binCount = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.binCount);

    this.init();

    this.AnimationTimer = setInterval(this.getData.bind(this, 50 + (60 - this.fps)));
}

Visualizer.prototype.clear = function() {
    this.visualizer.innerHTML = '';
};

Visualizer.prototype.init = function() {
    this.numOfBars = 64;
    this.volumeModifier = 1;
    this.setupElements();
}

Visualizer.prototype.setupElements = function() {
    this.visualizer.innerHTML = '';
    console.log(this.numOfBars);

    for (var i = 0; i < this.numOfBars; i++) {
        var bar = document.createElement('div'),
            barWrapper = document.createElement('div');

        bar.className = 'bar';
        barWrapper.className = 'bar-wrapper';
        barWrapper.style.left = i*24 + "px";

        barWrapper.appendChild(bar);
        this.visualizer.appendChild(barWrapper);
    }

    this.bars = document.getElementsByClassName('bar');
};

Visualizer.prototype.getData = function() {
    this.onWaveform(this.getWaveform());
}

Visualizer.prototype.getWaveform = function() {
    var spectrum = [];
    var waveformLength = this.dataArray.length;
    var value;

    this.analyser.getByteFrequencyData(this.dataArray);
    
    for (var i = 0; i < waveformLength; i++) {
        value = this.dataArray[i];

        value = value - 128;
        value = value / 128;

        spectrum.push(value);
    }

    return spectrum;
};

Visualizer.prototype.onWaveform = function(waveform) {
    var sampleAvgs = sampleArray(waveform, this.numOfBars, this.volumeModifier);
    var bars = this.bars;

    for (var j = 0; j < this.numOfBars; j++) {
        var magnitude = 1 - (Math.floor(sampleAvgs[j]*1000)/1000);

        bars[j].parentNode.style[prefix.css + 'transform'] = ["scaleY(", magnitude, ") translate3d(0,0,0)"].join("");
        // bars[j].parentNode.style['height'] = this.dataArray[j]/2 + "px";
    }
};

function sampleArray(arrayToSample, numOfSamples, modifier, decimalDigits) {
    var arrayMiddle = arrayToSample.length/ 2,
        sampleLength = Math.floor((arrayMiddle) / numOfSamples),
        sampleAvgs = [],
        precision,
        sample;

    modifier = modifier || 1;
    decimalDigits = decimalDigits || 10;

    precision = Math.pow(10, decimalDigits);

    for (var j = 0; j < numOfSamples; j++) {
        sample = 0;
                
        for (var i = 0; i < sampleLength; i++) {
            sample += Math.abs(arrayToSample[(j * sampleLength) + i]);
            sample += Math.abs(arrayToSample[(j * sampleLength) + i + (arrayMiddle)]);
        }
                
        sample /= sampleLength*2;
                
        sampleAvgs.push(Math.round(sample * modifier * precision) / precision);
    }
    
    return sampleAvgs;
}


var prefix = (function () {
  var styles = window.getComputedStyle(document.documentElement, ''),
    pre = (Array.prototype.slice
      .call(styles)
      .join('') 
      .match(/-(moz|webkit|ms)-/) || (styles.OLink === '' && ['', 'o'])
    )[1],
    dom = ('WebKit|Moz|MS|O').match(new RegExp('(' + pre + ')', 'i'))[1];
  return {
    dom: dom,
    lowercase: pre,
    css: '-' + pre + '-',
    js: pre[0].toUpperCase() + pre.substr(1)
  };
})();

/*
Visualizer.prototype.visualize = function visualize() {
    var self = this;
    var WIDTH = "1920px"; //this.canvas.width;
    var HEIGHT = "300px"; //this.canvas.height;

    this.analyser.fftSize = 2048;
    var bufferLength = this.analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);

    //
    this.canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    function draw() {

        drawVisual = requestAnimationFrame(draw);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        canvasCtx.lineWidth = 2;
        canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

        canvasCtx.beginPath();

        var sliceWidth = canvas.width * 1.0 / bufferLength;
        var x = 0;

        for (var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * canvas.height / 2;

            if (i === 0) {
                canvasCtx.moveTo(x, y);
            }
            else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }
    }


    draw();
}
*/