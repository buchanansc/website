/*jshint browser:true jquery:true*/
/*global Site, Modernizr, _gaq*/
Site.Navigation = (function () {
	var support = {
		'history': (window.history && window.history.pushState),
		'hashchange': false
		// 'hashchange': ("onhashchange" in window && (document.documentMode === undefined || document.documentMode > 7))
	};

	/**
	 * Track an event or page view with Google Analytics.
	 *
	 * To track a page view, simply don't specify a category or action.
	 *
	 * @param {String} [category] Event category
	 * @param {String} [action] Event action
	 * @private
	 */
	function track(category, action) {
		if (Site._config.tracking && typeof _gaq !== "undefined") {
			if (category || action) {
				_gaq.push(['_trackEvent', category || "", action || ""]);
			} else {
				_gaq.push(['_trackPageview']);
			}
		}
	}

	/**
	 * Navigate to internal link
	 *
	 * @param {String} url
	 * @private
	 */
	function internal(url) {
		// log("Site.Navigation.internal", url);
		if (!support.history && !support.hashchange) {
			// No pushState or hashChange support, forget the ajax and link the ol' fashioned way
			location.href = url;
			return false;
		}
		Site.Content.load(url, function() {
			track();
		});
		return true;
	}

	/**
	 * Navigate to outbound link
	 *
	 * @param {String} url
	 * @param {Boolean} [change=false] Load the new URL
	 * @private
	 */
	function outbound(url, change) {
		// log("Site.Navigation.outbound", url, change);
		change = change || false;
		track('Outbound Link', url);
		if (change) {
			setTimeout(function () {
				location.href = url;
			}, 100);
		}
	}

	/**
	 * Modify the URL using either pushState or changing the hash
	 *
	 * @param {String} url
	 * @param {Boolean} [replace=false] Use replaceState instead of pushState
	 * @private
	 */
	function changeURL(url, replace) {
		// log("Site.Navigation.changeURL", [url, replace]);
		if (support.history) {
			var args = [{
				'url': url
			}, 'page', url];

			if (replace || url == window.location.href || url == window.location.pathname) {
				window.history.replaceState.apply(window.history, args);
			} else {
				window.history.pushState.apply(window.history, args);
			}
		} else if (support.hashchange) {
			location.href = "/#" + url;
		}
	}

	return {
		/**
		 * Initialize the navigation state, run once at page load.
		 *
		 * @returns void
		 */
		init: function () {
			Site.Navigation.go(window.location.href, false);
			if (support.history) {
				window.onpopstate = function (event) {
					// log("onpopstate", event.state);
					if (event.state && event.state.url) {
						Site.Navigation.go(event.state.url, true);
					} else {
						changeURL(window.location.pathname + window.location.hash, true);
					}
				};
			} else if (support.hashchange) {
				window.onhashchange = function (event) {
					Site.Navigation.go(window.location, true);
				};
			}
		},

		/**
		 * Navigate to a URL
		 *
		 * @param {String|Object} url URL to navigate to, or an HTMLLinkElement to use as the link
		 * @param {Boolean} [reload=false] Assume it's a reload: force navigation, even if it thinks it's the same URL; also replaceState instead of pushState
		 * @returns {Boolean} True if navigation was successful, false otherwise
		 */
		go: function (url, reload) {
			reload = reload || false;
			var target, linkElement;
			if (typeof url === "object") {
				linkElement = url;
				url = $(linkElement).attr('href');
				target = $(linkElement).attr('target');
			}

			// If the link has an explicit target that isn't "_self", assume it's an outbound link
			// let the click event on the link continue propagation
			if (target && target != "_self") {
				outbound(url, false);
				return false;
			}

			// Strip the origin from URLs to the current domain
			var origin = Site._config.origin;
			if (url.substr(0, origin.length) == origin) {
				url = url.substr(origin.length);
			}

			// Check for hashed links
			var parts = url.split("/#/");
			if (parts.length === 2 && parts[0] === "") {
				url = "/" + parts[parts.length - 1];
				reload = true;
			}

			// Current page, no navigation necessary
			if (!reload && (url == window.location.href || url == window.location.pathname)) {
				if (url.indexOf("#") >= 0) {
					// link is probably to an anchor on the page, let it continue
					return false;
				} else {
					return true;
				}
			}

			// External link
			if (url.charAt(0) != "/") {
				outbound(url, true);
			} else {
				internal(url);
				changeURL(url, reload);
			}
			
			return true;
		}
	};
}());