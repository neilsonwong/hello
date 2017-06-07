$(function () {
    $("body").on("init-hello", function(){
    	console.log("inside init hello");
        $("#kotori").on("click", function openCurtain() {
	        $(".viewport").toggleClass("musicStart");
	        $(".muse").toggleClass("backstage");
	    });
    });
});