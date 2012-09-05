/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		concat: {
			dist: {
				src: [
					"_site/assets/js/log.js",
					"_site/assets/js/modernizr-2.6.2.custom.js",
					"_site/assets/js/jquery/jquery-1.8.1.min.js",
					"_site/assets/js/jquery/plugins/jquery.date.js",
					"_site/assets/js/jquery/plugins/jquery.tipsy.js",
					"_site/assets/js/string._template.js",
					"_site/assets/js/site.js",
					"_site/assets/js/site/content.js",
					"_site/assets/js/site/links.js",
					"_site/assets/js/site/navigation.js",
					"_site/assets/js/site/me.js",
					"_site/assets/js/site/me/github.js",
					"_site/assets/js/site/me/lastfm.js",
					"_site/assets/js/site/me/twitter.js",
					"_site/assets/js/init.js"
					],
				dest: "assets/all.js"
			}
		},
		min: {
			dist: {
				src: ["<config:concat.dist.dest>"],
				dest: "<config:concat.dist.dest>"
			}
		},
		uglify: {}
	});

	grunt.registerTask('default', 'concat min');
};