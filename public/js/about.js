$(function () {
	$("body").on("init-about", function(){
		//init about page vars
		let maki = getRandomInt(0, 9);
		let bg = getRandomInt(0, 24);

		console.log(maki);
		console.log(bg);

		//set css class bgimages
		$(".about_bg").css("background-image", "linear-gradient( rgba(0,0,0,0.1), rgba(0,0,0,0.25) ), url(\"/images/llbg/" + bg + ".png\")");
		$(".about_chara").css("background-image", "url(\"/images/maki/" + maki + ".png\")");
	});
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}