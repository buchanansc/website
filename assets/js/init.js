jQuery(function () {
	Site.init({
		title: "{{ site.me.name.given }} {{ site.me.name.family }}",
		url: "{{ site.url }}",
		twitter: "{{ site.me.twitter }}",
		github: "{{ site.me.github }}",
		lastfm: "{{ site.me.lastfm }}",
		lastfm_apikey: "{{ site.lastfm_apikey }}"
	});
});