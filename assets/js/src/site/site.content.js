/** @namespace */
Site.Content = (function () {
	var jqXHR;
	var title_pattern = /<title>(.*)<\/title>/i;
	var selector = '#content';
	
	return {

		load: function (url) {
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
				if (status == "error") Site.Content.error(xhr.status, xhr.statusText);

				// new site title
				var m = title_pattern.exec(response);
				if (m && m.length > 1) {
					Site.setTitle(m[1]);
				}

				Site.Content.loadEnd();

				// content is empty
				if ($(this).text() == "") {
					Site.Content.clear();
				} else Site.Links.init(this);
			});
		},

		error: function (code, text) {
			$(selector).html(Site.UI.template(Site.config('template_error_page'), {
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
			callback = callback || $.noop;
			var el = $('#layout'),
				cw = Site.config('layout_width_collapsed'),
				ew = Site.config('layout_width_expanded');

			if (!cw || !ew || !el.hasClass('collapsed') || el.hasClass('expanded') || !Site.config('animation')) {
				el.removeClass('collapsed').addClass('expanded');
				return callback.apply(this);
			}

			el.stop(true, true).width(cw).removeClass('collapsed').animate({
				// 'width': '+=' + $(selector).parent().outerWidth()
				'width': ew
			}, {
				'duration': Site.config('content_anim_duration'),
				'complete': function () {
					$(this).removeClass('collapsed').addClass('expanded')
					callback.apply(this);
				}
			});
		},

		collapse: function (callback) {
			callback = callback || $.noop;
			var el = $('#layout');

			if (!el.hasClass('expanded') || el.hasClass('collapsed') || !Site.config('animation')) {
				el.removeClass('expanded').addClass('collapsed');
				return callback.apply(el);
			}

			// el.width(el.width()).removeClass('expanded');
			el.stop(true, true).animate({
				'width': "-=" + $(selector).parent().outerWidth()
			}, {
				'duration': Site.config('content_anim_duration'),
				'complete': function () {
					$(this).removeClass('expanded').addClass('collapsed');
					callback.apply(this);
				}
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