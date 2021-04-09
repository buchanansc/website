/*jshint browser:true jquery:true*/
/*global log, Site*/
Site.Me.Github = (function () {
	var selector = '#me-link-github',
		url = '//api.github.com/users/<%user%>/events/public?callback=?',
		html = '';

	var tpl = [
		'<h3>GitHub <span>Recent Activity</span></h3>',
		'<ul>',
		    '<%items%>',
		'</ul>'
		].join('\n');

	var tpl_item = [
		'<li>',
		    '<p><%message%></p>',
		    '<span class="event-date"><%date%></span>',
		'</li>'
		].join('\n');

	var tpl_events = {
		'FollowEvent': 'Started following <a href="<%payload_target_url%>" rel="external"><%payload_target%></a>',
		'ForkEvent': 'Forked <a href="<%repo_url%>" rel="external"><%repo%></a>',
		'PullRequestEvent': 'Opened <a href="<%payload.pull_request.html_url%>" rel="external">pull request #<%payload_number%></a> on <%repo_link%>',
		'PushEvent': 'Pushed <%commit_count%> to <%payload_ref%> at <a href="<%repo_url%>" rel="external"><%repo%></a>',
		'WatchEvent': 'Starred <%repo_link%>'
	};

	function loadData(callback) {
		var user = Site._config.github,
			limit = Site._config.tipsy_list_limit || 3;
		$.getJSON(url._template({
			'user': user,
			'count': limit
		}), function (data, status) {
			if (status != "success") {
				return;
			}
			var i, n, arr = data.data,
				l = arr.length,
				items = '';
			for (i = 0; i < l && i < limit; i++) {
				n = arr[i];
				if (!tpl_events[n.type]) {
					limit++;
					continue;
				}
				items += tpl_item._template({
					'date': $.date.relative(n.created_at),
					'message': tpl_events[n.type]._template({
						'type': n.type,
						'repo': n.repo ? n.repo.name : '',
						'repo_url': n.repo ? n.repo.url : '',
						'repo_link': n.repo && n.repo.url && n.repo.name ? '<a href="' + n.repo.url + '" rel="external">' + n.repo.name + '</a>' : '',
						'commit_count': n.payload && n.payload.size >= 1 ? ((n.payload.size == 1) ? '1 commit' : n.payload.size + ' commits') : '',
						'payload.pull_request.html_url': n.payload && n.payload.pull_request ? n.payload.pull_request.html_url : '',
						'payload_number': n.payload && n.payload.number ? n.payload.number : '',
						'payload_ref': n.payload && n.payload.ref ? n.payload.ref.replace(/^.+?\/([^\/]+)$/, '$1') : '',
						'payload_target': n.payload && n.payload.target ? n.payload.target.login : '',
						'payload_target_url': n.payload && n.payload.target ? n.payload.target.html_url : ''
					})
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
			if (!jQuery().tipsy || !Site._config.github) {
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
			loadData(function (html) {
				$(selector).data('tipsy').tip().find('.tipsy-inner').html(html);
				Site.Links.init($(selector).data('tipsy').tip());
			});
		}
	};
}());

Site.Me.register(Site.Me.Github);
