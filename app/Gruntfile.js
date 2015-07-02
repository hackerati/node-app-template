module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'app.js', 'routes/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
				jasmine: {
            src: 'app.js, routes/**/*.js',
			      options: {
                specs: 'specs/**/*_spec.js',
                helpers: 'specs/**/*_helper.js'
            }
				},
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-watch');

		// Run this by typing "grunt test" on the command line
		grunt.registerTask('test', ['jshint', 'jasmine']);

		// Run the default task by typing "grunt" on the command line
		grunt.registerTask('default', ['jshint', 'jasmine']);

};
