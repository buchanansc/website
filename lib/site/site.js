/**
 * Root object for the site
 */
var Site = (function() {
	var config = {
		// content_root: 'slow_proxy.php?2,content/',
		content_root: 'content/',
		layout: 'default',
		layout_class_prefix: 'site-layout-'
	};

	return {
		init: function() {
			this.layout();
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

		layout: function() {
			var query = $('head link[href$="small.css"]').attr('media');
			if (!query) return false;

			if (Modernizr.mq(query)) Site.config('layout', 'small');
			else Site.config('layout', 'default');

			var prefix = Site.config('layout_class_prefix');

			// remove existing layout class names from the html element
			$('html').removeClass(function(i, c) {
				var i, arr = c.split(' '),
					arr_l = arr.length,
					ret = '';
				for (i = 0; i < arr_l; i++) {
					if (arr[i].indexOf(prefix) === 0) ret += ' ' + arr[i];
				}
				return ret;
			});

			// add the new layout class to the html element
			$('html').addClass(prefix + Site.config('layout'));
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

			Site.Content.load(url);
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
