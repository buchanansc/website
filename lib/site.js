var Site = (function() {
	var config = {
		content_directory: "content"
	};

	return {
		init: function() {
			this.initLinks();
			var load_url = Site.getContentURL(window.location.href);
			if(load_url) Site.loadContent(load_url);
		},
		
		initLinks: function() {
			var links = $('a[href^="#"]');
			$(links).on('click', Site.linkClick);		
		},

		linkClick: function(event) {
			Site.loadContent(Site.getContentURL(this.href));
		},
		
		getContentURL: function(url) {
			var parts = url.split("#");
			if(parts.length > 1 && parts[parts.length - 1] != "")
				return config.content_directory + "/" + parts[parts.length - 1] + ".html";

			return false;
		},
		
		loadContent: function(url) {
			if(!url) return false;
			
			if (!$("#layout").hasClass("content")) {
				$("#layout").animate({
					width: 900
				}, 300, function() {
					$(this).addClass("content");
					Site.loadContent(url);
				});
				return;
			}
			
			$("#content").addClass("loading");
			$("#content").load(url, function() {
				$("#content").removeClass("loading");
			});
		},
		
	};
})();
