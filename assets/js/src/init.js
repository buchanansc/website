---
---
jQuery(function () {
	Site.init({
		title: "{% include site.title.html %}",
		url: "{{ site.url }}",
		twitter: "{{ site.me.twitter }}",
		github: "{{ site.me.github }}",
		lastfm: "{{ site.me.lastfm }}",
		lastfm_apikey: "{{ site.lastfm_apikey }}"
	});
});