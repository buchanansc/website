Site.UI = (function () {
	return {
		init: function () {
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

			Site.UI.refresh();
		},

		refresh: function () {
			// Scroll to top of page (hide URL bar on iOS)
			if (Site._config.layout == "mobile") {
				setTimeout(function () {
					window.scrollTo(0, 0);
				}, 200);
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

		}
	};
})();