$(function () {
	function renderPage(name, url){
		//check if current url
		let newUrl = "partial" + url;
		$.get({
			url: newUrl,
			data: {},
			success: reloadPartial,
			dataType: "html" 
		});

		function reloadPartial(body){
			$("body").attr("id", name);
			$("#page").html(body);

			if (($("#"+name).length !== 0)){
				// console.log("triggering " + name)
				$("body").trigger("init-" + name);
				// $("#"+name).trigger("init");
			}
			else {
				console.log("#"+name+ " not found");
			}
		}
	}

	function bindSPA(){
		$("[data-page]").on("click", function(e){
			e.preventDefault();
			let pageName = $(this).attr("data-page");
			let partial = $(this).attr("href");

			//check if already on this page
			if (pageName === $("body").attr("id")){
				console.log("already on " + partial)
			}
			else {
				console.log("loading " + partial)
				window.history.pushState({
					location: partial,
					name: pageName} , pageName, partial);
				return renderPage(pageName, partial);
			}
		});

		window.onpopstate = function(e) {
			let url, name;
			if (e && e.state) {
				url = e.state.location;
				name = e.state.name;
			}

			if (url) {
				console.log("backing into " + e.state.location);
				renderPage(name, url);
			}
		};
	}

	bindSPA();

	$("body").trigger("init-" + $("body").attr("id"));
});
