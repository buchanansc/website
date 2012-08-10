/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		meta: {},
		lint: {
			files: [
				"assets/js/src/site.js",
				"assets/js/src/site/*"
				]
		},
		concat: {
			dist: {
				src: [
					"assets/js/src/log.js",
					"assets/js/src/modernizr.custom.js",
					"assets/js/src/jquery/jquery-1.7.2.min.js",
					// "assets/js/src/jquery/plugins/jquery-ajax-localstorage-cache.js",
					"assets/js/src/jquery/plugins/jquery.date.js",
					"assets/js/src/jquery/plugins/jquery.tipsy.js",
					"assets/js/src/string._template.js",
					"assets/js/src/site.js",
					"assets/js/src/site/content.js",
					"assets/js/src/site/links.js",
					"assets/js/src/site/navigation.js",
					"assets/js/src/site/ui.js",
					"assets/js/src/site/me.js",
					"assets/js/src/site/me/github.js",
					"assets/js/src/site/me/lastfm.js",
					"assets/js/src/site/me/twitter.js",
					],
				dest: "assets/js/all.js"
			}
		},
		min: {
			dist: {
				src: ["<config:concat.dist.dest>"],
				dest: "<config:concat.dist.dest>"
			}
		},
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				immed: true,
				latedef: true,
				newcap: true,
				noarg: true,
				sub: true,
				undef: true,
				boss: true,
				eqnull: true,
				jquery: true,
				browser: true
			},
			globals: {}
		},
		uglify: {}
	});

	grunt.registerTask('default', 'concat min');
};