Site.Links = (function() {
	return {
		init: function(parent) {
			var parent = parent || document.body;

			// Redirect outside URLs to a new window
			$('a[href^="http://"], a[href^="https://"]', parent).prop('target', '_blank');

			// Send internal URLs through Site.navigate();
			$('a[href^="#"], a[href^="/"]', parent).on('click', this.clickHandler);
		},

		clickHandler: function(event) {
			event.preventDefault();
			Site.navigate(Site.getContentURL(this.href));
		}
	}
})();