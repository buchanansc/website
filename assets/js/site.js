/*jshint browser:true jquery:true*/
/*global log, Modernizr*/
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

			// Default site layout won't fit if device width <= 930
			if (Modernizr.mq('only all and (max-device-width: 930px)')) {
				Site._config.layout = 'mobile';
				Site._config.animation = false;
			} else {
				// Get the width for the collapse/expanded layout
				var nw = $('.layout-west').width(),
					cw = $('.layout-center').width();

				Site._config.layout_width_collapsed = nw;
				Site._config.layout_width_expanded = nw + cw;
			}

			Site.Links.init();
			Site.Navigation.init();

			if (!Site._config.layout) {
				Site.Me.init();
			}
			
			Site.refreshUI();
		},

		/**
		 * Alias to {Site.Navigation.go}
		 *
		 * @see {Site.Navigation.go}
		 */
		navigate: function (url) {
			return Site.Navigation.go(url);
		},
		
		refresh: function () {
			// Scroll to top of page (hide URL bar on iOS)
			if (Site._config.layout == "mobile") {
				setTimeout(function () {
					window.scrollTo(0, 0);
				}, 100);
			} else if (!window.location.hash) {
				window.scrollTo(0, 0);
			}

			// Initialize tool tips for every element with a `title` attribute (but not `original-title`)
			if (jQuery().tipsy) {
				$('#content *[title]:not([original-title])').tipsy({
					gravity: $.fn.tipsy.autoNS,
					opacity: 1
				});
			}
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