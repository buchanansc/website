var Site = (function() {
	var config = {
		content_root: '',
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

Site.Links = (function() {
	return {
		init: function(parent) {
			var parent = parent || document.body;

			// Redirect outside URLs to a new window
			$('a[href^="http://"], a[href^="https://"]', parent).prop('target', '_blank');

			// Send internal URLs through Site.navigate();
			$('a[href^="#"], a[href^="/"]', parent).on('click', this.clickHandler);
		},

		clickHandler: function(event) {
			// event.preventDefault();
			Site.navigate(Site.getContentURL(this.href));
		}
	}
})();

Site.Content = (function() {
	return {
		load: function(url) {
			var content_element = $('#content');
			content_element.addClass('loading');
			this.expand();

			content_element.load(url + ' #page-content', function() {
				console.log(arguments);
				content_element.removeClass('loading');
				Site.Links.init(content_element);
			});
		},

		expand: function(callback) {
			var el = $('#layout'),
				callback = callback || $.noop;

			if (el.hasClass('expanded')) return callback.apply(this);
			if (Site.config('layout') != 'default') {
				el.removeClass('collapsed').addClass('expanded');
				return callback.apply(this);
			}

			el.width(el.width()).removeClass('collapsed').addClass('expanded');
			el.animate({
				width: '+=' + $('#page').width()
			}, {
				duration: 300,
				complete: callback.apply(this)
			});
		},

		collapse: function(callback) {
			var el = $('#layout'),
				callback = callback || $.noop;

			if (!el.hasClass('expanded')) return callback.apply(this);

			if (Site.config('layout') != 'default') {
				el.removeClass('expanded');
				return callback.apply(this);
			}

			el.width(el.width()).removeClass('expanded');
			el.animate({
				width: "-=" + $('#page').width()
			}, {
				duration: 300,
				complete: callback.apply(this)
			});
		},

		clear: function() {
			Site.Content.collapse(function() {
				$('#content').empty()
			});
		}
	};
})();

jQuery(function() {
	Site.init();
});