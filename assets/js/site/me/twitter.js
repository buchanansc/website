/*jshint browser:true jquery:true*/
/*global log, Site*/
Site.Me.Twitter = (function () {
	var selector = '#me-link-twitter',
		url = 'http://api.twitter.com/1/statuses/user_timeline.json?screen_name=<%user%>&count=<%limit%>&callback=?',
		html = '';

	var tpl = [
		'<h3>Twitter <span>@<%user%></span></h3>',
		'<ul>',
		    '<%items%>',
		'</ul>'
		].join('\n');

	var tpl_tweet = [
		'<li>',
		    '<p class="tweet-text"><%text%></p>',
		    '<span class="event-date"><%date%></span>',
		'</li>'
		].join('\n');

	function loadData(callback) {
		var user = Site._config.twitter,
			limit = Site._config.tipsy_list_limit || 3;

		$.getJSON(url._template({
			'user': user,
			'limit': limit
		}), function (data, status) {
			if (status != "success") {
				return;
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
	}

	return {
		init: function () {
			if (!jQuery().tipsy || !Site._config.twitter) {
				return;
			}
			$(selector).tipsy({
				className: 'tipsy-list twitter-timeline',
				fallback: 'twitter',
				gravity: 'nw',
				html: true,
				opacity: 1,
				fixed: true,
				title: function () {
					return html;
				}
			});
			loadData(function (html) {
				$(selector).data('tipsy').tip().find('.tipsy-inner').html(html);
				Site.Links.init($(selector).data('tipsy').tip());
			});
		}
	};
}());

Site.Me.register(Site.Me.Twitter);