var Site = (function() {
	var config = {
		content_anim_duration: 300,
		host: location.host,
		layout: 'default',
		origin: location.protocol + "//" + location.host,
		tracking: true
	};

	return {
		init: function() {
			Site.Links.init();
			Site.Navigation.init();
			// Hide URL bar on iOS
			// setTimeout(function() {
			// 	window.scrollTo(0, 0);
			// }, 500);
		},

		config: function(prop, value) {
			if (prop) {
				if (value) config[prop] = value;
				return config[prop];
			}
			return config;
		},

		template: function(template, data) {
			var prop, result = template,
				data = data || {};
			for (prop in data) {
				result = result.replace('<%' + prop + '%>', data[prop])
			}
			result = result.replace(/<%[a-z_\-0-9]+%>/ig, '')
			return result;
		},

		/**
		 * Alias to Site.Navigation.go(url)
		 */
		navigate: function(url) {
			return Site.Navigation.go(url);
		}
	};
})();

Site.Navigation = (function() {
	var support = {
		'history': (window.history && window.history.pushState),
		'hashchange': ("onhashchange" in window && (document.documentMode === undefined || document.documentMode > 7))
	};

	return {
		/**
		 * Navigate to outbound link
		 *
		 * @private
		 * @param {String} url
		 * @param {Boolean} [change=false] Load the new URL
		 */
		_outbound: function(url, change) {
			log("Site.Navigation._outbound", url, change);
			var change = change || false;
			this.track('Outbound Link', url);
			if (change) setTimeout(function() {
				location.href = url;
			}, 100);
		},

		/**
		 * Navigate to internal link
		 *
		 * @private
		 * @param {String} url
		 */
		_internal: function(url) {
			log("Site.Navigation._internal", url);
			// No pushState or hashChange support, forget the ajax and link the ol' fashioned way
			if (!support.history && !support.hashchange) {
				location.href = url;
				return false;
			}
			if (!url || url == "/") Site.Content.clear(); // Home page
			else Site.Content.load(url);
			this.track();
			return true;
		},

		/**
		 * Modify the URL using either pushState or changing the hash
		 *
		 * @private
		 * @param {String} url
		 * @param {Boolean} [replace=false] Use replaceState instead of pushState
		 */
		_changeURL: function(url, replace) {
			log("Site.Navigation.changeURL", [url, replace]);
			if (support.history) {
				var args = [{
					'url': url
				}, 'page', url];

				if (replace || url == window.location.href || url == window.location.pathname) window.history.replaceState.apply(window.history, args);
				else window.history.pushState.apply(window.history, args);
			} else if (support.hashchange) {
				location.href = "/#" + url;
			}
		},

		init: function() {
			this.go(location.pathname + location.hash, true);

			if (support.history) {
				window.onpopstate = function(event) {
					log("onpopstate", event.state, location.href);
					if (event.state && event.state.url) Site.Navigation.go(event.state.url, true);
				};
			} else if (support.hashchange) window.onhashchange = function(event) {
				log("onhashchange", event, location.href);
				Site.Navigation.go(document.location, true);
			};
		},

		/**
		 * Navigate to a URL
		 *
		 * @param {String|Object} url URL to navigate to, or an HTMLLinkElement to use as the link
		 * @param {Boolean} [reload=false] Assume it's a reload: force navigation, even if it thinks it's the same URL; also replaceState instead of pushState
		 * @returns {Boolean} True if navigation was successful, false otherwise
		 */
		go: function(url, reload) {
			log("Site.Navigation.go", url, reload);
			var reload = reload || false,
				target, linkElement;

			if (typeof url === "object") {
				linkElement = url;
				url = $(linkElement).attr('href');
				target = $(linkElement).attr('target');
			}

			// If the link has an explicit target that isn't "_self", assume it's an outbound link
			// let the click event on the link continue propagation
			if (target && target != "_self") {
				this._outbound(url, false);
				return false;
			}

			// Strip the origin from URLs to the current domain
			// var origin = Site.config("origin");
			// if (url.substr(0, origin.length) == origin) url = url.substr(origin);
			
			// Check for hashed links
			var parts = url.split("/#/");
			if (parts.length == 2 && parts[0] == "") {
				url = "/" + parts[parts.length - 1];
				reload = true;
			}

			// Current page, no navigation necessary
			if (!reload && (url == window.location.href || url == window.location.pathname)) {
				if (url.indexOf("#") >= 0) return false; // link is probably to an anchor on the page, let it continue
				else return true;
			}

			// External link
			if (url.charAt(0) != "/") this._outbound(url, true);
			else {
				this._internal(url);
				this._changeURL(url, reload);
			}
			return true;
		},

		/**
		 * Track an event or page view with Google Analytics.
		 *
		 * To track a page view, simply don't specify a category or action.
		 *
		 * @param {String} [category] Event category
		 * @param {String} [action] Event action
		 */
		track: function(category, action) {
			if (!Site.config("tracking") || !_gaq) return false;
			if (category || action) _gaq.push(['_trackEvent', category || "", action || ""]);
			else _gaq.push(['_trackPageview']);
		}
	}
})();

Site.Links = (function() {
	var selector = {
		'all': 'a',
		'internal': 'a[href^="/"]',
		'external': [
			'a.image',
			'a[rel="external"]',
			'a[href^="http://"]:not([href^="http://' + Site.config('host') + '"])"',
			'a[href^="https://"]:not([href^="https://' + Site.config('host') + '"])'
			].join(',')
	};
	return {
		init: function(parent) {
			this.startRouting(parent);
			$(selector.external, parent || document.body).attr('target', '_blank');
		},

		/**
		 * Send URLs through Site.navigate()
		 *
		 * @param {Object} [parent] Route links found in this element
		 */
		startRouting: function(parent) {
			$(selector.all, parent || document.body).on('click', function(event) {
				// Clicked with a button other than left mouse button, or was holding a modifier when clicking
				if ((event.which && event.which != 1) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

				if (Site.navigate(this)) event.preventDefault();
			});
		},

		/**
		 * Stop routing URLs
		 *
		 * @param {Object} [parent] Target only links found in this element
		 */
		endRouting: function(parent) {
			$(selector.internal, parent || document.body).off('click');
		},

		/**
		 * Disable the link, by removing href and preventing clicking
		 *
		 * @param {Object} [parent] Target only links found in this element
		 */
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
	var jqXHR, selector = '#content',
		templates = {
			'error': [
				'<div id="layout-error">',
				    '<h1 class="page-title"><%status%></h1>',
				    '<div class="page-body"><%text%></div>',
				'</div>'
				].join('')
		};

	return {
		load: function(url) {
			log("Site.Content.load", url);
			if (jqXHR && jqXHR.abort) jqXHR.abort();
			this.loadingOn();
			this.expand();
			jqXHR = $(selector).load(url + ' #content > *', function(response, status, xhr) {
				log($('head title', response));
				if (status == "error") Site.Content.error(xhr.status, xhr.statusText);
				Site.Content.loadingOff();
				Site.Links.init(this);
			});
		},

		error: function(code, text) {
			$(selector).html(Site.template(templates['error'], {
				'status': code,
				'text': text
			}));
		},

		loadingOn: function() {
			var el = $(selector);
			el.addClass('loading');
			Site.Links.disable(el);
		},

		loadingOff: function() {
			$(selector).removeClass('loading');
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
				'width': '+=' + $(selector).outerWidth()
			}, {
				'duration': Site.config('content_anim_duration'),
				'complete': function() { callback.apply(this); }
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
				'width': "-=" + $(selector).outerWidth()
			}, {
				'duration': Site.config('content_anim_duration'),
				'complete': function() { callback.apply(this); }
			});
		},

		clear: function() {
			Site.Content.collapse(function() {
				$(selector).empty();
			});
		}
	};
})();

jQuery(function() {
	Site.init();
});