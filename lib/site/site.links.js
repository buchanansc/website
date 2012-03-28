Site.Links = (function() {
	return {
		init: function(parent) {
			var parent = parent || document.body;
			// Redirect outside URLs to a new window
			var ext = $('a:not([href^="#"])', parent).prop('target', '_blank');

			var links = $('a[href^="#"]', parent);
			$(links).on('click', this.clickHandler);
		},

		clickHandler: function(event) {
			Site.navigate(Site.getContentURL(this.href));
		}
	}
})();
