/** @namespace */
Site.Content = (function () {
	var jqXHR;
	var titleExp = /<title>(.*)<\/title>/i;
	var selector = Site.config('selector_content');

	return {
		/**
		 *
		 */
		load: function (url) {
			// log("Site.Content.load(%o)", url);
			if (jqXHR && jqXHR.abort) jqXHR.abort();
			
			if (!url || url == "/" || url == "/" + Site.config('index_page')) {
				// Home page
				Site.Content.clear();
				return;
			}
			
			this.loadStart();
			this.expand();
			
			jqXHR = $(selector).load(url + ' #content > *', function (response, status, xhr) {
				if (status == "error") Site.Content.error(xhr.status, xhr.statusText);

				// new site title
				var m = titleExp.exec(response);
				if (m && m.length > 1) Site.setTitle(m[1]);

				Site.Content.loadEnd();

				// content is empty
				if ($(this).text() == "") Site.Content.clear();
				else Site.Links.init(this);
			});
		},

		/**
		 *
		 */
		error: function (code, text) {
			$(selector).html(Site.UI.template(Site.config('template_error_page'), {
				'status': code,
				'text': text
			}));
		},

		/**
		 *
		 */
		loadStart: function () {
			var el = $(selector);
			el.addClass('loading');
			Site.Links.disable(el);
		},

		/**
		 *
		 */
		loadEnd: function () {
			$(selector).removeClass('loading');
			Site.UI.refresh();
		},

		/**
		 *
		 */
		expand: function (callback) {
			var el = $('#layout'),
				callback = callback || $.noop;

			if (el.hasClass('expanded')) return callback.apply(el);

			if (Site.config('layout') != 'default') {
				el.removeClass('collapsed').addClass('expanded');
				return callback.apply(el);
			}

			el.width(el.width()).removeClass('collapsed');
			el.animate({
				'width': '+=' + $(selector).outerWidth()
			}, {
				'duration': Site.config('content_anim_duration'),
				'complete': function () {
					$(this).addClass('expanded').removeClass('collapsed')
					callback.apply(this);
				}
			});
		},

		/**
		 *
		 */
		collapse: function (callback) {
			var el = $('#layout'),
				callback = callback || $.noop;

			if (!el.hasClass('expanded') || el.hasClass('collapsed')) return callback.apply(this);

			if (Site.config('layout') != 'default') {
				el.removeClass('expanded').addClass('collapsed');
				return callback.apply(el);
			}

			el.width(el.width()).removeClass('expanded');
			el.animate({
				'width': "-=" + $(selector).outerWidth()
			}, {
				'duration': Site.config('content_anim_duration'),
				'complete': function () {
					$(this).addClass('collapsed').removeClass('expanded')
					callback.apply(this);
				}
			});
		},

		/**
		 *
		 */
		clear: function () {
			Site.Content.collapse(function () {
				$(selector).empty();
				Site.setTitle(Site.config('title'));
				Site.Content.loadEnd();
			});
		}
	};
})();