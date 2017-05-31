function Visualizer(audioContext, options) {
    this.audioCtx = audioContext;
    this.analyser = audioContext.createAnalyser();
    this.visualizer = document.querySelector('.visualizer');
    this.binCount = 0;
    this.screenHeight = $(window).height();
    this.screenWidth = $(window).width();
    this.dataArray = [];
    this.fps = 60;
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
    this.barWidth = Math.floor(this.screenWidth / (this.numOfBars)) - 1;
    this.barMaxHeight = Math.floor(this.screenHeight / 3);
    this.volumeModifier = 1;
    this.setupElements();
}

Visualizer.prototype.setupElements = function() {
    this.visualizer.innerHTML = '';
    let w = this.barWidth + "px";
    let h = this.barMaxHeight + "px";
    console.log(this.numOfBars);
    console.log(w);
    console.log(h);

    this.visualizer.style.height = h;

    for (var i = 0; i < this.numOfBars; i++) {

        // var bar = document.createElement('div'),
        //     barWrapper = document.createElement('div');

        // bar.className = 'bar';
        // barWrapper.className = 'bar-wrapper';
        // barWrapper.style.left = i*24 + "px";

        // barWrapper.appendChild(bar);
        // this.visualizer.appendChild(barWrapper);

        let nbar = document.createElement('div');
        nbar.className = 'nbar';
        nbar.style.width = w;
        nbar.style.height = h;
        this.visualizer.appendChild(nbar);
    }

    this.bars = document.getElementsByClassName('nbar');
};

Visualizer.prototype.getData = function() {
    this.onWaveform(this.getWaveform());
}

Visualizer.prototype.getWaveform = function() {
    var spectrum = [];
    var waveformLength = this.dataArray.length;
    var value;

    this.analyser.getByteFrequencyData(this.dataArray);
    // return this.dataArray;
    
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

        bars[j].style[prefix.css + 'transform'] = ["scaleY(", magnitude, ") translate3d(0,0,0)"].join("");
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