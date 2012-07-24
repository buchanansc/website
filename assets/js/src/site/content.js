Site.Content = (function () {
	var jqXHR;
	var title_pattern = /<title>(.*)<\/title>/i;
	var selector = '#content';

	return {
		load: function (url, callback) {
			// log("Site.Content.load(%o)", url);
			if (jqXHR && jqXHR.abort) {
				jqXHR.abort();
			}

			if (!url || url == "/" || url == "/" + Site.config('index_page')) {
				// Home page
				Site.Content.clear();
				return;
			}

			this.loadStart();
			this.expand();

			jqXHR = $(selector).load(url + ' #content > *', function (response, status, xhr) {
				if (status == "error") {
					Site.Content.error(xhr.status, xhr.statusText);
				}

				// new site title
				var m = title_pattern.exec(response);
				if (m && m.length > 1) {
					Site.setTitle(m[1]);
				}

				Site.Content.loadEnd();

				// content is empty
				if ($(this).text() == "") {
					Site.Content.clear();
				} else {
					Site.Links.init(this);
				}

				(callback || $.noop).apply(this)
			});
		},

		error: function (code, text) {
			var tpl = Site.config('template_error_page') || "";
			$(selector).html(tpl._templatee({
				'status': code,
				'text': text
			}));
		},

		loadStart: function () {
			var el = $(selector);
			el.addClass('loading');
			Site.Links.disable(el);
		},

		loadEnd: function () {
			$(selector).removeClass('loading');
			Site.UI.refresh();
		},

		expand: function (callback) {
			var el = $('#layout'),
				done = function () {
					el.addClass('expanded').removeClass('collapsed');
					return (callback || $.noop).apply(this);
				};

			if (!el.hasClass('collapsed') || el.hasClass('expanded') || !Site.config('animation')) {
				return done();
			}

			el.stop(true, true).width(Site.config('layout_width_collapsed')).removeClass('collapsed').animate({
				'width': Site.config('layout_width_expanded')
			}, {
				'duration': Site.config('content_anim_duration'),
				'complete': done
			});
		},

		collapse: function (callback) {
			var el = $('#layout'),
				done = function () {
					el.addClass('collapsed').removeClass('expanded');
					return (callback || $.noop).apply(this);
				};

			if (!el.hasClass('expanded') || el.hasClass('collapsed') || !Site.config('animation')) {
				return done();
			}

			el.stop(true, true).width(Site.config('layout_width_expanded')).removeClass('expanded').animate({
				'width': Site.config('layout_width_collapsed')
			}, {
				'duration': Site.config('content_anim_duration'),
				'complete': done
			});
		},

		clear: function (callback) {
			callback = callback || $.noop;
			Site.Content.collapse(function () {
				$(selector).empty();
				Site.setTitle(Site.config('title'));
				Site.Content.loadEnd();
				callback.apply(this);
			});
		}
	};
})();