module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
		 
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),

        concurrent: {
            dev: {
                tasks: ['nodemon', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        nodemon: {
            dev: {
                script: 'bin/www',
                options: {
                    args: ['dev'],
                    nodeArgs: ['--debug'],
                    ext: 'js jade json',
                    ignore: ['node_modules/**'],
                    legacyWatch: true
                }
            }
        },
        watch: {
            js: {
                files: ['*.js', 'routes/**/*.js', 'specs/**/*.js'],
                tasks: ['jshint', 'jasmine_node']
            }
        },
        jshint: {
            files: ['*js', 'routes/**/*.js', 'specs/**/*.js'],
            options: {
                globals: {
                    jQuery: true
                }
            }
        },
        jasmine_node: {
            options: {
                forceExit: true,
                match: '.',
                matchall: false,
                extensions: 'js',
                specNameMatcher: 'spec'
            },
            all: []
        }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-jasmine-node');

    // Run this by typing "grunt test" on the command line
    grunt.registerTask('test', ['jshint', 'jasmine_node']);

    // Run the default task by typing "grunt" on the command line
    grunt.registerTask('default', ['concurrent']);

};
