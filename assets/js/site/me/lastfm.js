/*jshint browser:true jquery:true*/
/*global log, Site*/
Site.Me.Lastfm = (function () {
	var selector = '#me-link-lastfm',
		url = '//ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=<%user%>&api_key=<%api_key%>&limit=<%limit%>&format=json&callback=?',
		html = '';

	var tpl = [
		'<h3>Last.fm <span>Recent Tracks</span></h3>',
		'<ul>',
		    '<%items%>',
		'</ul>'
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

	var tpl_missing_artwork = '<div class="missing-artwork"><span>?</span></div>';

	function getArtwork(track, size) {
		if (typeof size === "string") {
			size = [size];
		}
		if (track && track.image) {
			var s, i, l = track.image.length;

			while (size.length > 0) {
				s = size.shift();
				for (i = 0; i < l; i++) {
					if (track.image[i].size == s && track.image[i]['#text'] !== "") {
						return '<img src="' + track.image[i]['#text'] + '">';
					}
				}
			}
		}
		return tpl_missing_artwork._template();
	}

	function loadData(callback) {
		var user = Site._config.lastfm,
			limit = Site._config.tipsy_list_limit || 3,
			api_key = Site._config.lastfm_apikey;

		$.getJSON(url._template({
			'user': user,
			'limit': limit,
			'api_key': api_key
		}), function (data, status) {
			if (status != "success") {
				return;
			}
			var t, i, tracks = data.recenttracks.track,
				l = tracks.length,
				items = '';
			for (i = 0; i < l && i < limit; i++) {
				t = tracks[i];
				items += tpl_track._template({
					'date': (t.date && t.date.uts) ? $.date.relative(parseInt(t.date.uts, 10) * 1000) : '<span class="now-playing">Now playing</span>',
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
	}

	return {
		init: function () {
			if (!jQuery().tipsy || !Site._config.lastfm) {
				return;
			}
			$(selector).tipsy({
				className: 'tipsy-list lastfm-recent',
				fallback: 'last.fm',
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

Site.Me.register(Site.Me.Lastfm);