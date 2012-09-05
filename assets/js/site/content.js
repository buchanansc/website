/*jshint browser:true jquery:true*/
/*global log, Site*/
Site.Content = (function () {
	var jqXHR;
	var title_pattern = /<title>(.*)<\/title>/i;
	var selector = '#content';
	var template_error_page = [
		'<article class="page-error">',
		    '<header>',
		        '<h1 class="page-title">',
		            '<span class="page-title"><%status%></span>',
		        '</h1>',
		        '<p class="page-description"><%description%></p>',
		    '</header>',
		'</article>'
		].join('\n');

	return {
		load: function (url, callback) {
			if (jqXHR && jqXHR.abort) {
				jqXHR.abort();
			}

			// Home page
			if (!url || url == "/" || url == "/" + Site._config.index_page) {
				Site.Content.clear();
				(callback || $.noop).apply(this);
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
				if ($(this).text() === "") {
					Site.Content.clear();
				} else {
					Site.Links.init(this);
				}

				(callback || $.noop).apply(this);
			});
		},

		error: function (code, description) {
			$(selector).html(template_error_page._template({
				'status': code,
				'description': description.replace(/([^\.])$/, '$1.')
			}));
		},

		loadStart: function () {
			var el = $(selector);
			el.addClass('loading');
			Site.Links.disable(el);
		},

		loadEnd: function () {
			$(selector).removeClass('loading');
			Site.refreshUI();
		},

		expand: function (callback) {
			var el = $('#layout'),
				done = function () {
					el.addClass('expanded').removeClass('collapsed');
					return (callback || $.noop).apply(this);
				};

			if (!Site._config.animation || !el.hasClass('collapsed') || el.hasClass('expanded')) {
				return done.applt(el);
			}

			el.stop(true, true).width(Site._config.layout_width_collapsed).removeClass('collapsed').animate({
				'width': Site._config.layout_width_expanded
			}, {
				'duration': Site._config.animation_duration,
				'complete': done
			});
		},

		collapse: function (callback) {
			var el = $('#layout'),
				done = function () {
					el.addClass('collapsed').removeClass('expanded');
					return (callback || $.noop).apply(this);
				};

			if (!Site._config.animation || !el.hasClass('expanded') || el.hasClass('collapsed')) {
				return done.apply(el);
			}

			el.stop(true, true).width(Site._config.layout_width_expanded).removeClass('expanded').animate({
				'width': Site._config.layout_width_collapsed
			}, {
				'duration': Site._config.animation_duration,
				'complete': done
			});
		},

		clear: function (callback) {
			callback = callback || $.noop;
			Site.Content.collapse(function () {
				$(selector).empty();
				Site.setTitle(Site._config.title);
				Site.Content.loadEnd();
				callback.apply(this);
			});
		}
	};
}());
