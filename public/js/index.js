$(function () {
	$("body").on("init-home", function(){
		$("#kotori").on("click", function openCurtain() {
			$(".viewport").toggleClass("musicStart");
			$(".muse").toggleClass("backstage");
		});
	});
});