var Site = (function() {
	var config = {
		content_url: "content"
		// content_url: "slow_download.php?content"
	};

	return {
		init: function() {
			this.Links.init();

			// Hide URL bar on iOS
			setTimeout(function() {
				window.scrollTo(0, 0);
			}, 1000);

			var load_url = Site.getContentURL(window.location.href);
			if (load_url) Site.navigate(load_url);
		},
		
		config: function(prop, value) {
			if (prop) {
				if (value) config[prop] = value;
				return config[prop];
			}
			return config;
		},
		
		getContentURL: function(url) {
			var url = url || location.href,
				parts = url.split("#");
			if (parts.length > 1 && parts[parts.length - 1] != "") return Site.config('content_url') + "/" + parts[parts.length - 1] + ".html";
			return false;
		},

		navigate: function(url) {
			if (!url) {
				Site.Content.collapse();
				return false;
			}

			Site.Content.expand(function() {
				$('#content').addClass('loading');
				$('#content').load(url, function() {
					$('#content').removeClass('loading');
					Site.Links.init($('#content'));
				});
			});
		},

		goBack: function() {
			history.back();
			Site.navigate(Site.getContentURL());
		}
	};
})();
