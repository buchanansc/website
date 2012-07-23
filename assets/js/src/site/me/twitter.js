Site.Me.Twitter = (function () {
	var selector = '.my-links a.twitter-link',
		url = 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=<%user%>&count=<%limit%>&callback=?',
		html = '';

	var tpl = [
	    '<h3>Twitter <span>@<%user%></span></h3>',
	    '<ul>',
	        '<%items%>',
	    '</ul>',
		].join('\n');

	var tpl_tweet = [
		'<li>',
		    '<p class="tweet-text"><%text%></p>',
		    '<span class="event-date"><%date%></span>',
		'</li>'
		].join('\n');

	function loadData(callback) {
		var user = Site.config('lastfm_user'),
			limit = Site.config('lastfm_limit') || 3;

		$.getJSON(url._template({
			'user': user,
			'limit': limit
		}), function (data, status) {
			if (status != "success") {
				return html = '';
			}
			var i, l = data.length,
				items = '';
			for (i = 0; i < l && i < limit; i++) {
				items += tpl_tweet._template({
					'date': $.date.relative(data[i].created_at),
					'text': data[i].text
				});
			}
			html = tpl._template({
				'user': user,
				'items': items
			});
			(callback || $.noop).call(this, html);
		});
	};

	return {
		init: function () {
			if (!jQuery().tipsy || !Site.config('twitter_user')) {
				return;
			}
			$(selector).tipsy({
				className: 'tipsy-list twitter-timeline',
				fallback: 'twitter',
				gravity: 'nw',
				html: true,
				opacity: 1,
				title: function () {
					return html;
				}
			});
			// $(selector).tipsy("disable");
			loadData(function(h) {
				$(selector).data("tipsy").tip().find('.tipsy-inner')['html'](h);
				// $(selector).tipsy("enable");
			});
		}
	};
})();

Site.Me.register(Site.Me.Twitter);