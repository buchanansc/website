Site.Content = (function() {
	return {
		expand: function(callback) {
			var layout = $('#layout');
			if (layout.hasClass('expanded')) return callback.apply(this);
			layout.width(layout.width());
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
			return;
		},
		
		load: function(url) {
			var content = $('#content');
			
			if (!url)
				return this.collapse();

			this.expand(function() {
				content.addClass('loading');
				content.load(url, function() {
					content.removeClass('loading');
					Site.Links.init(content);
				});
			});
		}
	};
})();
