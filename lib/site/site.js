/**
 * Root object for the site
 */
var Site = (function() {
	var config = {
		// content_root: 'slow_proxy.php?content/',
		content_root: 'content/',
		layout: 'full'
	};

	return {
		init: function() {
			// this.layout();

			this.Links.init();

			// Hide URL bar on iOS
			setTimeout(function() {
				window.scrollTo(0, 0);
			}, 1000);

			// delay loading the default
			var load_url = Site.getContentURL(window.location.href);
			if (load_url) setTimeout(function() {
				Site.navigate(load_url);
			}, 150);

		},

		config: function(prop, value) {
			if (prop) {
				if (value) config[prop] = value;
				return config[prop];
			}
			return config;
		},

		/**
		 * Choose a layout type based on the browser capabilities (size)
		 * 
		 * @returns void
		 */
		
		layout: function() {
			if (Modernizr.mq('only all and (max-width: 640px)')) this.config('layout', 'small');
			else this.config('layout', 'full');

/*
			var prefix = this.config('layout_class_prefix');

			// remove existing layout class names from the html element
			$('html').removeClass(function(i, c) {
				var i, arr = c.split(' '),
					arr_l = arr.length,
					ret = '';
				for (i = 0; i < arr_l; i++) {
					console.log('testing ' + arr[i] + ' for ' + prefix);
					if (arr[i].indexOf(prefix) === 0) ret += ' ' + arr[i];
				}
				return ret;
			});

			// add the new layout class to the html element
			$('html').addClass(prefix + this.config('layout'));
*/

		},

		getContentURL: function(url) {
			var url = url || location.href,
				parts = url.split("#");
			if (parts.length > 1 && parts[parts.length - 1] != "") return Site.config('content_root') + parts[parts.length - 1] + ".html";
			return false;
		},

		navigate: function(url) {
			if (!url || url == "/") {
				Site.Content.clear();
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

jQuery(function() {
	Site.init();
});
