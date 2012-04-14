// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f() {
	log.history = log.history || [];
	log.history.push(arguments);
	if (this.console) {
		var args = arguments,
			newarr;
		try {
			args.callee = f.caller
		} catch (e) {};
		newarr = [].slice.call(args);
		if (typeof console.log === 'object') log.apply.call(console.log, console, newarr);
		else console.log.apply(console, newarr);
	}
};
// make it safe to use console.log always
(function(a) {
	function b() {}
	for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !! (d = c.pop());) {
		a[d] = a[d] || b;
	}
})
(function() {
	try {
		console.log();
		return window.console;
	} catch (a) {
		return (window.console = {});
	}
}());


var Site = (function() {
	var config = {
		error_message: '<p class="error-message">An error has occurred.</p>',
		layout: 'default',
		layout_class_prefix: 'site-layout-'
	};

	return {
		init: function() {
			this.layout();
			this.Links.init();

			// Hide URL bar on iOS
			setTimeout(function() {
				window.scrollTo(0, 0);
			}, 1000);

			// delay loading the default
			var load_url = Site.getContentURL(window.location.href);
			if (load_url) setTimeout(function() {
				Site.navigate(load_url);
			}, 100);

		},

		config: function(prop, value) {
			if (prop) {
				if (value) config[prop] = value;
				return config[prop];
			}
			return config;
		},

		layout: function() {
			var query = $('head link[href$="small.css"]').attr('media');
			if (!query) return false;

			if (Modernizr.mq(query)) Site.config('layout', 'small');
			else Site.config('layout', 'default');

			var prefix = Site.config('layout_class_prefix');

			// remove existing layout class names from the html element
			$('html').removeClass(function(i, c) {
				var i, arr = c.split(' '),
					arr_l = arr.length,
					ret = '';
				for (i = 0; i < arr_l; i++) {
					if (arr[i].indexOf(prefix) === 0) ret += ' ' + arr[i];
				}
				return ret;
			});

			// add the new layout class to the html element
			$('html').addClass(prefix + Site.config('layout'));
		},

		getContentURL: function(url) {
			var url = url || location.href,
				parts = url.split("#");
			if (parts.length > 1 && parts[parts.length - 1] != "") return parts[parts.length - 1] + ".html";
			return false;
		},

		navigate: function(url) {
			if (!url || url == "/") return Site.Content.clear();
			return Site.Content.load(url);
		},

		goBack: function() {
			history.back();
			Site.navigate(Site.getContentURL());
		}
	};
})();

Site.Links = (function() {
	var selector = {
		'internal': 'a[href^="#"], a[href^="/"]',
		'external': 'a[href^="http://"], a[href^="https://"]'
	};
	return {
		init: function(parent) {
			var parent = parent || document.body;
			// Redirect outside URLs to a new window
			$(selector.external, parent).prop('target', '_blank');
			// Send internal URLs through Site.navigate();
			$(selector.internal, parent).on('click', this.clickHandler);
		},

		clickHandler: function(event) {
			event.preventDefault();
			Site.navigate(Site.getContentURL(this.href));
		},

		reset: function(parent) {
			var parent = parent || document.body;
			$(selector.internal, parent).off('click');
		},

		disable: function(parent) {
			var parent = parent || document.body;
			$('a', parent).on('click', function(event) {
				event.preventDefault();
			});
		}
	};
})();

Site.Content = (function() {
	return {
		load: function(url) {
			this.loadingOn();
			this.expand();
			$('#content').load(url + ' #page-content', function(response, status, xhr) {
				if (status == "error") this.html(Site.config("error_message") + '<p>' + xhr.status + " " + xhr.statusText + "</p>");
				Site.Content.loadingOff();
				Site.Links.init(this);
			});
		},

		loadingOn: function() {
			var el = $('#content');
			el.addClass('loading');
			Site.Links.reset(el);
			Site.Links.disable(el);
		},

		loadingOff: function() {
			$('#content').removeClass('loading');
		},

		expand: function(callback) {
			var el = $('#layout'),
				callback = callback || $.noop;

			if (el.hasClass('expanded')) return callback.apply(this);
			if (Site.config('layout') != 'default') {
				el.removeClass('collapsed').addClass('expanded');
				return callback.apply(this);
			}

			el.width(el.width()).removeClass('collapsed').addClass('expanded');
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

jQuery(function() {
	Site.init();
});