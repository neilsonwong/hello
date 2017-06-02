function BarGraph(container){
	this.data = {};
	this.dataIndices = [];
	this.container = container;
	this.screenHeight = $(window).height();
    this.screenWidth = $(window).width();
    this.numOfBars = 12;
	this.setupBars();
}

BarGraph.prototype.setupBars = function(){
    this.barWidth = ((this.screenWidth / 3) / this.numOfBars) - 10;
    this.barMaxHeight = Math.floor(this.screenHeight / 4);

    let w = this.barWidth + "px";
    let h = this.barMaxHeight + "px";

	let bar;
    for (let i = 0; i < this.numOfBars; i++) {
		bar = document.createElement('div');
		bar.className = "bar";
		bar.style.width = w;
		bar.style.height = h;
	    this.container.appendChild(bar);
	}
	this.bars = this.container.getElementsByClassName('bar');
}

Visualizer.prototype.onResize = function(){
    console.log("resizing")
    this.screenHeight = $(window).height();
    this.screenWidth = $(window).width();
    this.barWidth = this.screenWidth / (this.numOfBars) - 1;
    this.barMaxHeight = Math.floor(this.screenHeight / 3);

    let w = this.barWidth + "px";
    let h = this.barMaxHeight + "px";

    $(this.container).find(".bar").css("width",w).css("height", h);
    $(this.container).css("height", h);
};

BarGraph.prototype.add = function(item, change){
	let sum = change;

	//add to data indexes
	if (!(item in this.data)){
		console.log("pushing " + item)
		this.dataIndices.push(item);
	}

	//add item to data
	if (this.data[item])
		sum += this.data[item];

	this.data[item] = sum;

	this.dataIndices.sort((a, b) => {
		return this.data[b] - this.data[a];
	});

	this.redraw();
};

BarGraph.prototype.redraw = function(){
	console.log(this.dataIndices);
	console.log(this.data);

	let bars = this.bars;

	for (var j = 0; j < this.numOfBars; j++) {
		let magnitude = (this.data[this.dataIndices[j]] / this.data[this.dataIndices[0]]) || 0;
        bars[j].style[prefix.css + 'transform'] = ["scaleY(", magnitude, ") translate3d(0,0,0)"].join("");
    }
};