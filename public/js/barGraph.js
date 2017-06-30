function BarGraph(container, options){
	this.data = {};
	this.extra = {};
	this.dataIndices = [];
	this.container = container;
	this.screenHeight = $(window).height();
	this.screenWidth = $(window).width();
	this.numOfBars = 12;
	this.sortRight = (options && options.sortRight) || false;
	this.setupBars();
}

BarGraph.prototype.setupBars = function(){
	this.barWidth = ((this.screenWidth / 3) / this.numOfBars) - 10;
	this.barMaxHeight = Math.floor(this.screenHeight / 4);

	let w = this.barWidth + "px";
	let h = this.barMaxHeight + "px";

	let bar, barWrapper, wrapper, val, tooltip;

	function fn(e) {
		let $tt = $(this.getElementsByClassName("barTooltip"));
		let windowWidth = $(window).width();
		let fakeElementWidth = Math.max($tt.width(), 100);
		if (e.pageX + fakeElementWidth > windowWidth - 50){
			$tt.css("right", (windowWidth - e.pageX + 10) + "px");
			$tt.css("left", "");
		}
		else {
			$tt.css("left", e.pageX + 10 +"px");
			$tt.css("right", "");
		}
		$tt.css("top", e.pageY + "px");
	}

	for (let i = 0; i < this.numOfBars; i++) {
		barWrapper = document.createElement("div");
		bar = document.createElement("div");
		val = document.createElement("div");
		tooltip = document.createElement("div");

		barWrapper.className = "barWrap";
		barWrapper.style.height = 0;

		bar.className = "bar";
		bar.style.width = w;
		bar.style.height = h;
		bar.style["transform"] = ["scaleY(0) translate3d(0,0,0)"];

		val.className = "barVal";
		val.style.width = w;

		tooltip.className = "barTooltip";

		barWrapper.appendChild(bar);
		barWrapper.appendChild(val);
		barWrapper.appendChild(tooltip);
		this.container.appendChild(barWrapper);

		//bind tooltip events
		barWrapper.addEventListener("mousemove", fn, false);

	}
	this.bars = this.container.getElementsByClassName("bar");
	this.wrappers = this.container.getElementsByClassName("barWrap");
	this.vals = this.container.getElementsByClassName("barVal");
	this.tooltips = this.container.getElementsByClassName("barTooltip");
};

BarGraph.prototype.onResize = function(){
	this.screenHeight = $(window).height();
	this.screenWidth = $(window).width();
	this.barWidth = ((this.screenWidth / 3) / this.numOfBars) - 10;
	this.barMaxHeight = Math.floor(this.screenHeight / 4);

	let w = this.barWidth + "px";
	let h = this.barMaxHeight + "px";

	$(this.container).find(".bar").css("width",w).css("height", h);
	$(this.container).find(".barVal").css("width",w);
	$(this.container).css("height", h);
	this.redraw();
};

BarGraph.prototype.add = function(item, change, extras){
	let sum = change;

	//add to data indexes
	if (!(item in this.data)){
		log.info("pushing " + item);
		this.dataIndices.push(item);
	}

	if (extras !== undefined){
		for (let extra in extras){
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
	let vals = this.vals;
	let tooltips = this.tooltips;
	let wrappers = this.wrappers;
	let index, key, val, magnitude, shiftUp, wrapHeight;

	for (let j = 0; j < this.numOfBars; j++) {
		index = this.sortRight ? this.numOfBars -1 - j : j;
		key = this.dataIndices[index];
		val = this.data[key];
		magnitude = (val / this.data[this.dataIndices[0]]) || 0;
		shiftUp = (-1)*(1-magnitude) * this.barMaxHeight;
		wrapHeight = magnitude * this.barMaxHeight;

		bars[j].style["transform"] = ["scaleY(", magnitude, ") translate3d(0,0,0)"].join("");
		bars[j].style["opacity"] = 1 - index * 0.075;

		vals[j].style["transform"] = ["translateY(", shiftUp, "px)"].join("");
		vals[j].innerHTML = val || "";

		tooltips[j].innerHTML = val ? key + "<br />" + val : "" ;

		wrappers[j].style["height"] = val ? wrapHeight + "px" : "0";

		$(bars[j])
			.attr("data-key", key)
			.attr("data-value", val);

		//check if image data is included
		
	}
};