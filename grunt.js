/*global module:false*/
module.exports = function (grunt) {
	grunt.initConfig({
		meta: {},
		lint: {
			files: [
				"_site/assets/js/src/site.js",
				"_site/assets/js/src/site/*"
				]
		},
		concat: {
			dist: {
				src: [
					"_site/assets/js/src/lib/log.js",
					"_site/assets/js/src/lib/modernizr.custom.js",
					"_site/assets/js/src/jquery/jquery-1.7.2.min.js",
					"_site/assets/js/src/jquery/plugins/jquery.date.js",
					"_site/assets/js/src/jquery/plugins/jquery.tipsy.js",
					"_site/assets/js/src/lib/string._template.js",
					"_site/assets/js/src/site.js",
					"_site/assets/js/src/site/content.js",
					"_site/assets/js/src/site/links.js",
					"_site/assets/js/src/site/navigation.js",
					"_site/assets/js/src/site/ui.js",
					"_site/assets/js/src/site/me.js",
					"_site/assets/js/src/site/me/github.js",
					"_site/assets/js/src/site/me/lastfm.js",
					"_site/assets/js/src/site/me/twitter.js",
					"_site/assets/js/src/init.js",
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