function BarGraph(container, options){
	this.data = {};
	this.extra = {};
	this.dataIndices = [];
	this.container = container;
	this.screenHeight = $(window).height();
    this.screenWidth = $(window).width();
    this.numOfBars = 12;
	this.sortRight = (options && options.sortRight) || false;
	console.log(this.sortRight);
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
        bar.style[prefix.css + 'transform'] = ["scaleY(0) translate3d(0,0,0)"];
	    this.container.appendChild(bar);
	}
	this.bars = this.container.getElementsByClassName('bar');
}

BarGraph.prototype.onResize = function(){
    console.log("resizing")
    this.screenHeight = $(window).height();
    this.screenWidth = $(window).width();
    this.barWidth = ((this.screenWidth / 3) / this.numOfBars) - 10;
    this.barMaxHeight = Math.floor(this.screenHeight / 4);

    let w = this.barWidth + "px";
    let h = this.barMaxHeight + "px";

    $(this.container).find(".bar").css("width",w).css("height", h);
    $(this.container).css("height", h);
};

BarGraph.prototype.add = function(item, change, extras){
	let sum = change;

	//add to data indexes
	if (!(item in this.data)){
		console.log("pushing " + item)
		this.dataIndices.push(item);
	}

	if (extras !== undefined){
		for (extra in extras){
			this.extras[item][extra] = extras[extra];
		}
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
	let bars = this.bars;
	let index, key, val, magnitude;

	for (let j = 0; j < this.numOfBars; j++) {
		index = this.sortRight ? this.numOfBars -1 - j : j;
		key = this.dataIndices[index];
		val = this.data[key];
		magnitude = (val / this.data[this.dataIndices[0]]) || 0;
        bars[j].style[prefix.css + 'transform'] = ["scaleY(", magnitude, ") translate3d(0,0,0)"].join("");
        $(bars[j])
        	.attr("data-key", key)
        	.attr("data-value", val);

        //check if image data is included
        
    }
};