
var Site = (function() {
	var config = {
		content_expand_duration: 300,
		error_message: '<p class="error-message">An error has occurred.</p>',
		layout: 'default'
	};
	return {
		init: function() {
			this.Links.init();

			// Hide URL bar on iOS
			setTimeout(function() {
				window.scrollTo(0, 0);
			}, 1000);

			// delay loading the default
			var load_url = Site.getContentURL(window.location.href);
			if (load_url) setTimeout(function() {
				Site.navigate(load_url);
			}, 100);
		},

		config: function(prop, value) {
			if (prop) {
				if (value) config[prop] = value;
				return config[prop];
			}
			return config;
		},

		getContentURL: function(url) {
			var file, url = url || location.href,
				parts = url.split("#");

			if (parts.length > 1 && parts[parts.length - 1] != "") {
				file = parts[parts.length - 1];
				return file + ((file.charAt(file.length - 1) != "/") ? ".html" : "");
			}
			return false;
		},

		navigate: function(url) {
			if (!url || url == "/") return Site.Content.clear();
			return Site.Content.load(url);
		},

		goBack: function() {
			history.back();
			Site.navigate(Site.getContentURL());
		}
	};
})();

Site.Links = (function() {
	var selector = {
		'internal': 'a[href^="/"]',
		'external': 'a[href^="http://"]", a[href^="https://"]'
		// 'external': 'a[href^="http://"]:not([href^=http://buchanansc.com])", a[href^="https://"]:not([href^=https://buchanansc.com])'
	};
	return {
		init: function(parent) {
			// Redirect outside URLs to a new window
			$(selector.external, parent || document.body).prop('target', '_blank');
			this.startRouting(parent);
		},

		startRouting: function(parent) {
			// Send internal URLs through Site.navigate()
			$(selector.internal, parent || document.body).on('click', function(event) {
				// event.preventDefault();
				Site.navigate(Site.getContentURL(this.href));
			});
		},

		endRouting: function(parent) {
			// Stop routing internal URLs through Site.navigate()
			$(selector.internal, parent || document.body).off('click');
		},

		disable: function(parent) {
			var links = $('a', parent || document.body);

			// Intercept clicks
			links.off('click').on('click', function(event) {
				event.preventDefault();
			});

			// Remove href
			links.each(function(index, el) {
				// $(el).data('href', $(el).attr("href")); // save the href and the link can be re-enabled
				$(el).removeAttr("href");
			});
		}
	};
})();

Site.Content = (function() {
	return {
		load: function(url) {
			this.loadingOn();
			this.expand();
			$('#content').load(url + ' #page', function(response, status, xhr) {
				if (status == "error") $(this).html(Site.config("error_message") + '<p>' + xhr.status + " " + xhr.statusText + "</p>");
				Site.Content.loadingOff();
				Site.Links.init(this);
			});
		},

		loadingOn: function() {
			var el = $('#content');
			el.addClass('loading');
			// Site.Links.endRouting(el);
			Site.Links.disable(el);
		},

		loadingOff: function() {
			$('#content').removeClass('loading');
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
				'width': '+=' + $('#content').outerWidth()
			}, {
				'duration': Site.config('content_expand_duration'),
				'complete': callback.apply(this)
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
				'width': "-=" + $('#content').outerWidth()
			}, {
				'duration': Site.config('content_expand_duration'),
				'complete': callback.apply(this)
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