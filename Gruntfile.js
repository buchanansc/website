/*global module:false*/
/*
module.exports = function (grunt) {
	grunt.initConfig({
		concat: {
			dist: {
				src: [
					"/assets/js/log.js",
					"/assets/js/modernizr-2.6.2.custom.js",
					"/assets/js/jquery/jquery-1.8.1.min.js",
					"/assets/js/jquery/plugins/jquery.date.js",
					"/assets/js/jquery/plugins/jquery.tipsy.js",
					"/assets/js/string._template.js",
					"/assets/js/site.js",
					"/assets/js/site/content.js",
					"/assets/js/site/links.js",
					"/assets/js/site/navigation.js",
					"/assets/js/site/me.js",
					"/assets/js/site/me/github.js",
					"/assets/js/site/me/lastfm.js",
					// "/assets/js/site/me/twitter.js",
					"/assets/js/init.js"
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
*/
/*
grunt.initConfig({

	// pkg: grunt.file.readJSON('package.json'),

	concat: {
		js: {
			src: [
				"/assets/js/log.js",
				"/assets/js/modernizr-2.6.2.custom.js",
				"/assets/js/jquery/jquery-1.8.1.min.js",
				"/assets/js/jquery/plugins/jquery.date.js",
				"/assets/js/jquery/plugins/jquery.tipsy.js",
				"/assets/js/string._template.js",
				"/assets/js/site.js",
				"/assets/js/site/content.js",
				"/assets/js/site/links.js",
				"/assets/js/site/navigation.js",
				"/assets/js/site/me.js",
				"/assets/js/site/me/github.js",
				"/assets/js/site/me/lastfm.js",
			],
			dest: "assets/all_verbose.js"
		}
	},

	min: {
		js: {
			src: "assets/all_verbose.js",
			dest: "assets/all.js"
		}
	}
});

// grunt.loadNpmTasks('grunt-contrib-imagemin', 'grunt-contrib-cssmin');

grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');

// Default task.
grunt.registerTask('default', [ 'concat', 'uglify', 'min']);

*/



module.exports = function(grunt) {
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
					"_site/assets/js/site/me/lastfm.js"
				],
				dest: "assets/all_verbose.js"
			}
		},

		uglify: {
/*			options: {
				compress: {
					drop_console: true
				}
			},*/
			js: {
				src: [
					"assets/all_verbose.js"
				],
				dest: "assets/all.js"
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	// Default task
	grunt.registerTask('default', ['concat', 'uglify']);
};