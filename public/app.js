$(document).ready(function(){

	$("#scrape").on("click", function(){

		$.ajax({
			method: "GET",
		    url: "/scrape"
		}).done(function(data) {

		});

});