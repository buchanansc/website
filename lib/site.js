var Site = (function() {
	var config = {
		content_directory: "content"
	};

	return {
		init: function() {
			this.Links.init();
			
			// Hide URL bar on iOS
			setTimeout(function() {
				window.scrollTo(0, 1);
			}, 1000);
			
			var load_url = Site.getContentURL(window.location.href);
			if (load_url) Site.navigate(load_url);
		},

		getContentURL: function(url) {
			var parts = url.split("#");
			if (parts.length > 1 && parts[parts.length - 1] != "") return config.content_directory + "/" + parts[parts.length - 1] + ".html";
			return false;
		},

		navigate: function(url) {
			if (!url) return false;

			if (!$('#layout').hasClass('content')) {
				$('#layout').animate({
					width: 900
				}, 300, function() {
					$(this).addClass('content');
					Site.navigate(url);
				});
				return;
			}

			$('#content').addClass('loading');
			$('#content').load(url, function() {
				$('#content').removeClass('loading');
			});
		},

	};
})();

Site.Links = (function() {
	return {
		init: function(parent) {
			var parent = parent || document.body;
			// Redirect outside URLs to a new window
			var ext = $('a:not([href^="#"])', parent).prop('target', '_blank');
			
			var links = $('a[href^="#"]', parent);
			$(links).on('click', this.clickHandler);
		},
		
		clickHandler: function(event) {
			console.log(this, event);
			Site.navigate(Site.getContentURL(this.href));
		}		
	}
})();