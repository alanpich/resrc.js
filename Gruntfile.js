module.exports = function (grunt) {

    var production = (grunt.option('environment') || 'dev') === 'production';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        version: '0.8.0',
        srcPath: 'src/resrc.js'
    });

    grunt.config('jshint', {
        options: {
            jshintrc: ".jshintrc"
        },
        all: ["<%= srcPath %>"]
    });


    grunt.config('clean',{
        'tmp': '.tmp',
        'dist': 'dist'
    })

    grunt.config('uglify', {
        options: {
            banner: grunt.file.read("header.txt"),
            compress: true,
            beautify: !production,
            mangle: production,
            preserveComments: false,
            report: 'gzip'
        },


        standalone: {
            files: {
                'dist/resrc.js': '.tmp/resrc.js'
            },
            options: {
                sourceMap: 'dist/resrc.js.map',
                compress: {
                    global_defs: {
                        "BUILD_TYPE": "STANDALONE"
                    },
                    unsafe: true,
                    dead_code: true,
                    screw_ie8: true,
                    drop_console: true
                }
            }
        },
        jquery: {
            files: {
                'dist/resrc.jquery.js': '.tmp/resrc.js'
            },
            options: {
                sourceMap: 'dist/resrc.jquery.js.map',
                compress: {
                    global_defs: {
                        "BUILD_TYPE": 'JQUERY'
                    },
                    unsafe: true,
                    dead_code: true,
                    screw_ie8: true,
                    drop_console: true
                }
            }
        }
    });


    grunt.config('watch', {
        scripts: {
            files: ['src/**/*.js'],
            tasks: ['build']
        }
    });


    grunt.config('includes', {
        js: {
            options: {
                includeRegexp: /^\s*\/\/\s*\@include\s+['"]?([^'"\s]+)['"]?\s*$/,
                duplicates: false,
                debug: true
            },
            files: [
                {
                    cwd: 'src/',
                    src: 'resrc.js',
                    dest: '.tmp/resrc.js'
                }
            ]
        }
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-includes');

    grunt.registerTask('build', ['clean','jshint', 'includes:js', 'uglify']);


    // MUCH better
    // browserify src/resrc.js --standalone resrc -o dist/resrc2.js --external jquery
};
