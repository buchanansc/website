/**
 * Bridge HTML anchor elements to Site.Navigation
 */
Site.Links = (function () {
	/** @private */
	var selector = {
		'all': 'a',
		'internal': 'a[href^="/"]',
		'external': [
			'a[rel="external"]',
			'a[href^="http://"]:not([href^="http://' + location.host + '"])"',
			'a[href^="https://"]:not([href^="https://' + location.host + '"])'
			].join(',')
	};

	return {
		/**
		 * Initialize links elements in the page. Will call {Site.Links.startRouting}
		 *
		 * @param {Object} [parent=document.body] Limit to children of this element.
		 */
		init: function (parent) {
			$(selector['external'], parent || document.body).attr('target', '_blank').addClass('link-external');
			$(selector['internal'], parent || document.body).addClass('link-internal');
			if (Site.config('routing')) this.startRouting(parent);
		},

		/**
		 * Send link clicks to Site.navigate()
		 *
		 * @param {Object} [parent=document.body] Limit to children of this element.
		 */
		startRouting: function (parent) {
			$(selector['all'], parent || document.body).on('click', function (event) {
				// Clicked with a button other than left mouse button, or was holding a modifier when clicking
				if ((event.which && event.which != 1) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

				if (Site.navigate(this)) event.preventDefault();
			});
		},

		/**
		 * Stop routing URLs
		 *
		 * @param {Object} [parent=document.body] Limit to children of this element.
		 */
		stopRouting: function (parent) {
			$(selector['internal'], parent || document.body).off('click');
		},

		/**
		 * Disable link elements, by removing href and preventing clicking.
		 *
		 * @param {Object} [parent=document.body] Limit to children of this element.
		 */
		disable: function (parent) {
			var links = $(selector['all'], parent || document.body);

			// Intercept clicks
			links.off('click').on('click', function (event) {
				event.preventDefault();
			});

			// Remove href
			links.each(function (index, el) {
				// $(el).data('href', $(el).attr("href")); // save the href and the link can be re-enabled
				$(el).removeAttr("href");
			});
		}
	};
})();