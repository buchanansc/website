var Site = (function () {
	var config = {
		// Enable animation
		animation: true,
		// Effect duration (milliseconds) when animating the content expanding/collapsing.
		content_anim_duration: 300,
		// Index page
		index_page: 'index.html',
		// Enable routing
		routing: true,
		// Turn on Google Analytics tracking (requires that routing is also enabled).
		tracking: true,

		tipsy_list_limit: 3,
		layout: null,
		origin: location.protocol + "//" + location.host
	};

	return {
		_config: config,

		init: function (conf) {
			var prop;
			if (typeof conf === "object") {
				for (prop in conf) {
					if (conf.hasOwnProperty(prop)) {
						Site._config[prop] = conf[prop];
					}
				}
			}

			Site.UI.init();
			Site.Links.init();
			Site.Navigation.init();

			if (!Site.config['layout']) {
				Site.Me.init();
			}
		},

		/**
		 * Get or set values in the site configuration.
		 *
		 * @param {String} [property] Name of the config property.
		 * @param {Mixed} [value] The new value of property.
		 * @returns {Mixed} The value of property, or entire config object if no property is specified.
		 */
		config: function (property, value) {
			if (property) {
				if (arguments.length > 1) {
					Site._config[property] = value;
				}
				return Site._config[property];
			}
		},

		/**
		 * Called when the Site finishes loading new content.
		 */
		loadEnd: function () {
			// Hide URL bar on iOS
			setTimeout(function () {
				window.scrollTo(0, 0);
			}, 100);
		},

		/**
		 * Alias to {Site.Navigation.go}
		 *
		 * @see {Site.Navigation.go}
		 */
		navigate: function (url) {
			return Site.Navigation.go(url);
		},

		/**
		 * Get/set the page title.
		 *
		 * @param {String} [title] The new page title.
		 * @returns {String}
		 */
		setTitle: function (title) {
			if (title) {
				$(document).prop("title", title);
			}
			return $(document).prop("title");
		}
	};
}());