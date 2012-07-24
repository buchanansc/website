Site.Me.Github = (function () {
	var selector = '.my-links a.github-link',
		url = 'https://api.github.com/users/<%user%>/events/public?callback=?',
		html = '';

	var tpl = [
		'<h3>GitHub <span>Recent Activity</span></h3>',
		'<ul>',
		    '<%items%>',
		'</ul>',
		].join('\n');

	var tpl_item = [
		'<li>',
		    '<p><%message%></p>',
		    '<span class="event-date"><%date%></span>',
		'</li>'
		].join('\n');

	var tpl_events = {
		'PushEvent': 'Pushed to <%branch%> at <b><%repo%></b>',
		'ForkEvent': 'Forked <b><%repo%></b>',
		'WatchEvent': 'Started watching <b><%repo%></b>'
	};

	function loadData(callback) {
		var user = Site.config('github_user'),
			limit = Site.config('github_limit') || 3;
		$.getJSON(url._template({
			'user': user,
			'count': limit
		}), function (data, status) {
			if (status != "success") {
				return html = '';
			}
			var i, arr = data.data,
				l = arr.length,
				items = '';
			for (i = 0; i < l && i < limit; i++) {
				if (!tpl_events[arr[i].type]) {
					limit++;
					continue;
				}
				items += tpl_item._template({
					'date': $.date.relative(arr[i].created_at),
					'message': tpl_events[arr[i].type]._template({
						'type': arr[i].type,
						'repo': arr[i].repo ? arr[i].repo.name : '',
						'branch': arr[i].payload ? arr[i].payload.ref.replace(/^.+?\/([^\/]+)$/, '$1') : ''
					})
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
			if (!jQuery().tipsy || !Site.config('github_user')) {
				return;
			}
			$(selector).tipsy({
				className: 'tipsy-list github-activity',
				fallback: 'github',
				gravity: 'nw',
				html: true,
				opacity: 1,
				fixed: true,
				title: function () {
					return html;
				}
			});
			loadData(function (h) {
				$(selector).data("tipsy").tip().find('.tipsy-inner')['html'](h);
			});
		}
	};
})();

Site.Me.register(Site.Me.Github);