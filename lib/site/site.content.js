Site.Content = (function() {
	return {
		load: function(url) {
			var content_element = $('#content');
			content_element.addClass('loading');
			this.expand();
			content_element.load(url, function() {
				content_element.removeClass('loading');
				Site.Links.init(content_element);
			});
		},

		expand: function(callback) {
			var el = $('#layout'),
				callback = callback || $.noop;

			if (el.hasClass('expanded')) return callback.apply(this);

			if (Site.config('layout') != 'default') {
				el.addClass('expanded');
				return callback.apply(this);
			}
			
			el.width(el.width()).addClass('expanded');
			el.animate({
				width: '+=' + $('#page').width()
			}, {
				duration: 300,
				complete: callback.apply(this)
			});
		},

		collapse: function(callback) {
			var el = $('#layout'),
				callback = callback || $.noop;

			if (!el.hasClass('expanded')) return callback.apply(this);

			if (Site.config('layout') != 'default') {
				el.removeClass('expanded');
				return callback.apply(this);
			}
			
			el.width(el.width()).removeClass('expanded');			
			el.animate({
				width: "-=" + $('#page').width()
			}, {
				duration: 300,
				complete: callback.apply(this)
			});
	},

	clear: function() {
		Site.Content.collapse(function() {
			$('#content').empty()
		});
	}
};
})();
