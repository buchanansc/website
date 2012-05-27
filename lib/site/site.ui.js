/** @namespace */
Site.UI = (function () {
	return {
		/**
		 * Called at page load
		 */
		init: function () {
			// Device width <= 930
			if (Modernizr.mq('only all and (max-device-width: 930px)')) {
				Site.config('layout', '930');
			}
			
			$(document.body).addClass('layout-' + Site.config('layout'));
			
			Site.UI.refresh();
		},
		
		/**
		 * Refresh the layout
		 */
		refresh: function () {
			// Hide URL bar on iOS
			setTimeout(function () {
				window.scrollTo(0, 0);
			}, 100);
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