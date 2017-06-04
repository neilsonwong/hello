$(function () {
	function renderPage(url){
		//check if current url
		let newUrl = "partial/" + url;
		$.get({
			url: newUrl,
			data: {},
			success: reloadPartial,
			dataType: "html" 
		});

		function reloadPartial(body){
			$("#page").html(body);

			//change url & add history
			window.history.pushState({}, "", url)
		}
	}

	function bindSPA(){
		console.log($("[data-page]"));
		$("[data-page]").forEach((a) => {
			$(a).click(function(e){
				let partial = $(this).attr("data-page");
				if (partial === ""){
					partial = "home;"
				}
				return renderPage(partial);
			});
		});
	}

	bindSPA();
});
