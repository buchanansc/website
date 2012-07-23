Site.UI = (function () {
	return {
		init: function () {
			// Default site layout won't fit if device width <= 930
			if (Modernizr.mq('only all and (max-device-width: 930px)')) {
				Site.config('layout', 'mobile');
				Site.config('animation', false);
			} else {
				// Get the width for the collapse/expanded layout
				var nw = $('.layout-west').width(),
					cw = $('.layout-center').width();

				Site.config('layout_width_collapsed', nw);
				Site.config('layout_width_expanded', nw + cw);
			}

			// $(document.body).addClass('layout-' + Site.config('layout'));
			Site.UI.refresh();
		},

		refresh: function () {
			// Scroll to top of page (hide URL bar on iOS)
			if (Site.config('layout') == "mobile") {
				setTimeout(function () {
					window.scrollTo(0, 0);
				}, 200);
			}

			// Initialize tool tips
			if (jQuery().tipsy) {
				$('#content *[title]:not([original-title])').tipsy({
					gravity: $.fn.tipsy.autoNS,
					opacity: 1
				});
			}

		}
	};
})();