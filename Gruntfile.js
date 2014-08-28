module.exports = function (grunt) {

    var production = (grunt.option('environment') || 'dev') === 'production';


    require('load-grunt-config')(grunt,{
        init: true,
        data: {
            pkg: grunt.file.readJSON('package.json'),
            version: '0.8.0',
            srcPath: 'src/resrc.js',

            path: {
                src: 'src/resrc.js',
                dist: {
                    standalone: 'dist/resrc.min.js',
                    jquery: 'dist/resrc.jquery.min.js',
                    testable: 'dist/resrc.testable.min.js'
                },
                tmp: '.tmp/resrc.js',
                dir: {
                    tests: 'tests'
                }
            },

            production: production,

            includeRegex: /^\s*\/\/\s*\@include\s+['"]?([^'"\s]+)['"]?\s*$/,

            tpl: {
                header: grunt.file.read('header.txt')
            },

            includes: {
                options: {
                    includeRegexp: /^\s*\/\/\s*\@include\s+['"]?([^'"\s]+)['"]?\s*$/i
                }
            }
        }
    })


};
