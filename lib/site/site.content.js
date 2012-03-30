Site.Content = (function() {
	return {
		expand: function(callback) {
			var layout = $('#layout');
			if (layout.hasClass('expanded')) return callback.apply(this);
			// layout.width(layout.width());
			// layout.addClass('expanded');
			layout.animate({
				width: 900
			}, 300, function() {
				layout.addClass('expanded');
				callback.apply(this);
			});
		},

		collapse: function(callback) {
			var layout = $('#layout');
			if (!layout.hasClass('expanded')) return callback.apply(this);
			layout.animate({
				width: 330
			}, 300, function() {
				layout.removeClass('expanded');
				callback.apply(this);
			});
		},

		load: function(url) {
			var content_element = $('#content');

			if (!url)
				return this.collapse();

			this.expand(function() {
				content_element.addClass('loading');
				content_element.load(url, function() {
					content_element.removeClass('loading');
					Site.Links.init(content_element);
				});
			});
		},

		clear: function() {
			this.collapse(function() {
				$('#content').empty();
			});
		}
	};
})();
