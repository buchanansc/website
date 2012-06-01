/** @namespace */
Site.UI = (function () {
	return {
		/**
		 * Called at page load
		 */
		init: function () {
			// Default site layout won't fit if device width <= 900
			if (Modernizr.mq('only all and (max-device-width: 900px)')) {
				Site.config('layout', 'narrow');
			}

			$(document.body).addClass('layout-' + Site.config('layout'));

			// Initialize tooltips
			if (jQuery().tipsy) {
				$('#navigation .my-links a').tipsy({
					delayIn: 0,
					delayOut: 0,
					fade: false,
					fallback: '',
					gravity: 'n',
					html: false,
					live: false,
					offset: 2,
					opacity: 1,
					title: 'title',
					trigger: 'hover'
				});
			}

			Site.UI.refresh();
		},

		/**
		 * Refresh the layout
		 */
		refresh: function () {
			// Hide URL bar on iOS
			setTimeout(function () {
				window.scrollTo(0, 0);
			}, 200);
		},

		/**
		 * Render a template
		 */
		template: function (template, data) {
			var prop, result = template,
				data = data || {};
			for (prop in data) {
				result = result.replace('<%' + prop + '%>', data[prop])
			}
			result = result.replace(/<%[a-z_\-0-9]+%>/ig, '')
			return result;
		}
	};
})();