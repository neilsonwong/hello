$(function () {
	let origKeydown;
	$("body").on("init-about", function(){
		//init about page vars
		let maki = getRandomInt(0, 10);
		let bg = getRandomInt(0, 24);
		let lbg = getRandomInt(0, 7);
		let me = getRandomInt(0, 1);

		//set css class bgimages
		$(".about_bg").css("background-image", "linear-gradient( rgba(0,0,0,0.1), rgba(0,0,0,0.25) ), url(\"/images/llbg/" + bg + ".png\")");
		$(".about_chara").css("background-image", "url(\"/images/maki/" + maki + ".png\")");

		$(".about_landscape").css("background-image", "linear-gradient( rgba(0,0,0,0.1), rgba(0,0,0,0.25) ), url(\"/images/landscape/" + lbg + ".jpg\")");
		// $(".about_me").css("background-image", "url(\"/images/me/" + me + ".png\")");

		//override arrow keys
		$viewport = $(".viewport");
        $(document).on({ "keydown": handleScrollEvent });
	});

	$("body").on("exit-about", function(){
		$(document).off("keydown", handleScrollEvent);
	});

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	let scrollMutex = false;
	let $viewport;
	function handleScrollEvent(e) {
		if (scrollMutex){
			return;
		}
		scrollMutex = true;

		let destination;
		//make sure this key actually scrolls the page
		switch (e.which) {
			case 34:
			case 35:
			case 40:
				destination = window.innerHeight;
				break;
			case 33:
			case 36:
			case 38:
				destination = 0;
				break;
			default:
				//we don't care so lets let it run its natural course
				scrollMutex = false;
				return;
		}

		//if we are already at the right spot, don't scroll
		if ($viewport.scrollTop() === destination){
			scrollMutex = false;
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		$viewport.animate({"scrollTop": destination }, 500, () => { scrollMutex = false; });
	}
});