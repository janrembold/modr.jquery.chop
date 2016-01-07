var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var connect = require('gulp-connect');
var size = require('gulp-size');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');


gulp.task('clean', function () {
    return del([
        'dist/**/*'
    ]);
});

gulp.task('uglify', ['jshint'], function () {

    return gulp.src( 'src/js/*.js')
        .pipe( uglify({
            preserveComments: 'license',
            compress: {
                drop_console: true
            }
        }) )
        .pipe( rename({
            suffix: '.min'
        }) )
        .pipe( size({
            title: 'uglified',
            showFiles: true
        }) )
        .pipe( size({
            title: 'gzipped',
            showFiles: true,
            gzip: true
        }) )
        .pipe( gulp.dest( 'dist/js/' ) );

});

gulp.task('jshint', function() {

    return gulp.src('src/js/**/*.js')
        .pipe( jshint() )
        .pipe( jshint.reporter(stylish) );

});

gulp.task('sass', function () {

    return gulp.src( [
            'src/sass/**/*.scss',
            '!src/sass/**/_*.scss'
        ])
        .pipe( sass().on('error', sass.logError) )
        .pipe( postcss([
            autoprefixer({
                browsers: ['last 3 versions', 'last 8 Chrome versions', 'last 8 Firefox versions' , 'Firefox ESR', 'ie 9', 'last 2 iOS versions', 'Android 4']
            })
        ]))
        .pipe( gulp.dest( 'dist/css/' ) );

});

gulp.task('watch:js', function () {

    gulp.watch('src/**/*.js', {
        interval: 500,
        debounceDelay: 750
    }, ['uglify']);

});

gulp.task('watch:sass', function () {

    gulp.watch('src/**/*.scss', {
        interval: 500,
        debounceDelay: 750
    }, ['sass']);

});

gulp.task('serve', ['build'], function() {
    connect.server({
        root: './',
        livereload: true
    });
});


gulp.task('build', function(callback) {runSequence(

    'clean',
    [
        'sass',
        'uglify'
    ],
    [
        'watch:sass',
        'watch:js'
    ],
    callback

);});