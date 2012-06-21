/**
 * JavaScript for wafflesnatcha.github.com
 *
 * @author Scott Buchanan <buchanan.sc@gmail.com>
 * @link http://wafflesnatcha.github.com
 */

/** @namespace */
var Site = (function () {
	/** @private */
	var config = {
		/** Enable animation */
		animation: true,

		/** Effect duration (milliseconds) when animating the content expanding/collapsing. */
		content_anim_duration: 300,

		/** Index page */
		index_page: 'index.html',

		/** Enable routing */
		routing: true,

		/** Site title */
		title: '',

		/** Site base URL */
		url: '',

		/** Turn on Google Analytics tracking (requires that routing is also enabled). */
		tracking: true,
		
		
		layout_width_collapsed: null,
		layout_width_expanded: null,
		layout: 'default',
		origin: location.protocol + "//" + location.host,
		selector_links_all: 'a',
		selector_links_external: [
			'a[rel="external"]',
			'a[href^="http://"]:not([href^="http://' + location.host + '"])"',
			'a[href^="https://"]:not([href^="https://' + location.host + '"])'
			].join(','),
		selector_links_internal: 'a[href^="/"]',

		template_error_page: [
			'<article class="page-error">',
				'<h1 class="page-title">',
					'<span class="page-title"><%status%></span>',
				'</h1>',
				'<div class="page-body">',
					'<p><%text%></p>',
				'</div>',
			'</article>'
			].join('\n')
	};

	return {
		/**
		 * Called at window.load
		 * 
		 * @param {Object} [conf] Set Site.config with these values
		 */
		init: function (conf) {
			if (typeof conf === "object") {
				for (var prop in conf) {
					Site.config(prop, conf[prop]);
				}
			}

			Site.UI.init();
			Site.Links.init();
			Site.Navigation.init();
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
				if (value) config[property] = value;
				return config[property];
			}
			return config;
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
			if (title) $(document).prop("title", title);
			return $(document).prop("title");
		}
	};
})();