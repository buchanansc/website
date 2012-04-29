var Site = (function() {
	var config = {
		content_anim_duration: 300,
		error_message: '<p class="error-message">An error has occurred.</p>',
		host: location.host,
		layout: 'default',
		origin: location.protocol + "//" + location.host
	};

	return {
		init: function() {
			this.Links.init();

			// Hide URL bar on iOS
			setTimeout(function() {
				window.scrollTo(0, 0);
			}, 1000);

			Site.navigate();
		},

		config: function(prop, value) {
			if (prop) {
				if (value) config[prop] = value;
				return config[prop];
			}
			return config;
		},

		navigate: function(url) {
			var url = url || (location.pathname + location.hash),
				origin = Site.config("origin");
			log("Site.navigate", url);

			// Strip the origin from URLs to the current domain
			if (url.substr(0, origin.length) == origin) url = url.substr(origin);

			// Check for hashed links
			var parts = url.split("/#/");
			if (parts.length == 2 && parts[0] == "") url = parts[parts.length - 1];

			// Home page
			if (!url || url == "/") return Site.Content.clear();

			// Current page, no navigation necessary
			if (url == window.location.href || url == window.location.pathname) return false;

			if(history) history.pushState({
				'url': url
			}, 'page', url);

			return Site.Content.load(url);
		}
	};
})();

Site.Links = (function() {
	var selector = {
		'internal': 'a[href^="/"]',
		'external': 'a[href^="http://"]:not([href^="http://' + Site.config('host') + '"])", a[href^="https://"]:not([href^="https://' + Site.config('host') + '"])'
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
				event.preventDefault();
				Site.navigate(this.href);
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
			log("Site.Content.load", url);
			this.loadingOn();
			this.expand();
			$('#content').load(url + ' #content > *', function(response, status, xhr) {
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
				'duration': Site.config('content_anim_duration'),
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
				'duration': Site.config('content_anim_duration'),
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