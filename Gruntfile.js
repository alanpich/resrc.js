module.exports = function (grunt) {

    var pkgData = grunt.file.readJSON('package.json')

    require('load-grunt-config')(grunt,{
        init: true,
        data: {
            //
            // Read package.json data
            //
            pkg: pkgData,

            //
            // Paths to files and directories
            //
            path: {
                src: 'src/resrc.js',
                buildTmp: '.tmp/resrc.js',
                dist: {
                    standalone: 'dist/resrc.min.js',
                    jquery: 'dist/resrc.jquery.min.js'
                },
                tmp: {
                    standalone: '.tmp/resrc.js',
                    jquery: '.tmp/resrc.jquery.js'
                },
                dir: {
                    tests: 'tests'
                },
                sourcemap: {
                    standalone: {
                        intermediate: '.tmp/resrc.js.map',
                        final: 'dist/resrc.js.map'
                    }
                }
            },

            //
            // Paths to useful templates
            //
            tpl: {
                header: grunt.file.read('header.txt')
            },

            //
            // Drop this here to store a RegExp var
            //
            includes: {
                options: {
                    includeRegexp: /^\s*\/\/\s*\@include\s+['"]?([^'"\s]+)['"]?\s*$/i
                }
            },

            // [possiblty depreciated?]
            production: (grunt.option('environment') || 'dev') === 'production'

        }
    })


};
