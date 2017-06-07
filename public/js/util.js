$(function () {
	function renderPage(name, url){
		//check if current url
		let newUrl = "partial/" + url;
		$.get({
			url: newUrl,
			data: {},
			success: reloadPartial,
			dataType: "html" 
		});

		function reloadPartial(body){
			$("body").attr("id", name);
			$("#page").html(body);

			//change url & add history
			window.history.pushState({}, "", url);
			
		}
	}

	function bindSPA(){
		$("[data-page]").click(function(e){
			let pageName = $(this).attr("data-page");
			let partial = $(this).attr("data-url");
			console.log("loading " + partial)
			return renderPage(pageName, partial);
		});
	}

	bindSPA();
});
