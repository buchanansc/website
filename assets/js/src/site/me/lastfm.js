Site.Me.Lastfm = (function () {
	var selector = '.my-links a.lastfm-link',
		url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=<%user%>&api_key=<%api_key%>&limit=<%limit%>&format=json&callback=?',
		html = '';

	var tpl = [
		'<h3>Last.fm <span>Recent Tracks</span></h3>',
		'<ul>',
		    '<%items%>',
		'</ul>',
		].join('\n');

	var tpl_track = [
		'<li>',
		    '<div class="track-artwork"><%artwork%></div>',
		    '<div class="track-info">',
		        '<span class="track-name"><%track%></span>',
		        '<span class="track-artist"><span>by</span> <%artist%></span>',
		    '</div>',
		    '<span class="event-date"><%date%></span>',
		'</li>'
		].join('\n');

	function getArtwork(arr, size) {
		if (typeof size === "string") {
			size = [size];
		}
		if (arr && arr.image) {
			var s, i, l = arr.image.length;

			while (size.length > 0) {
				s = size.shift();
				for (i = 0; i < l; i++) {
					if (arr.image[i].size == s && arr.image[i]['#text'] != "") {
						return '<img src="' + arr.image[i]['#text'] + '">';
					}
				}
			}
		}
		return '<div class="missing-artwork"><span>?</span></div>';
	}

	function loadData(callback) {
		var user = Site.config('lastfm_user'),
			limit = Site.config('lastfm_limit') || 3,
			api_key = Site.config('lastfm_api_key');

		$.getJSON(url._template({
			'user': user,
			'limit': limit,
			'api_key': api_key
		}), function (data, status) {
			if (status != "success") {
				return html = '';
			}
			var t, i, arr = data.recenttracks.track,
				l = arr.length,
				items = '';
			for (i = 0; i < l && i < limit; i++) {
				t = arr[i];
				items += tpl_track._template({
					'date': (t.date && t.date.uts) ? $.date.relative(parseInt(t.date.uts) * 1000) : '<span class="now-playing">Now playing</span>',
					'artwork': getArtwork(t, ['medium', 'small']),
					'track': t.name,
					'artist': t.artist ? t.artist['#text'] : '',
					'album': t.album ? t.album['#text'] : ''
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
			if (!jQuery().tipsy || !Site.config('lastfm_user')) {
				return;
			}
			$(selector).tipsy({
				className: 'tipsy-list lastfm-recent',
				fallback: 'last.fm',
				gravity: 'nw',
				html: true,
				opacity: 1,
				title: function () {
					return html;
				}
			});
			// $(selector).tipsy("disable");
			loadData(function (h) {
				$(selector).data("tipsy").tip().find('.tipsy-inner')['html'](h);
				// $(selector).tipsy("enable");
			});
		}
	};
})();

Site.Me.register(Site.Me.Lastfm);