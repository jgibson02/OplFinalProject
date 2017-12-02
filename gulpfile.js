// Imports
var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    //babel = require('gulp-babel'),
    //webserver = require('gulp-webserver'),
    scss = require('gulp-sass');

// Directory shortcuts
var source = './source',
    prod = './prod';

// Build React.js source
gulp.task('js', function() {
  return gulp.src( source + '/js/app.js' )
    .pipe(browserify({
      transform: 'reactify',
      debug: true
    }))
    .on('error', function (err) {
      console.error('Error!', err.message);
    })/*
    .pipe(babel({
        presets: ['es2015', 'react']
    }))*/
    .pipe(gulp.dest(prod + '/js'));
});

// Preprocess SCSS into CSS
gulp.task('scss', function() {
    return gulp.src(source + '/scss/**/*.scss')
        .pipe(scss().on('error', scss.logError))
        .pipe(gulp.dest(prod + '/css/'));
});

// ¯\_(ツ)_/¯
gulp.task('html', function() {
  gulp.src( prod + '/**/*.html');
});
gulp.task('css', function() {
    gulp.src( prod + '/css/*.css');
});

// Watch directories for changes in aforementioned files.
// If a file changes, execute the associated Gulp task.
gulp.task('watch', function() {
  gulp.watch( source + '/js/**/*.js', ['js']);
  gulp.watch( source + '/scss/*.scss', ['scss']);
  gulp.watch( prod + '/css/**/*.css', ['css']);
  gulp.watch([ prod + '/**/*.html'], ['html']);
});

/* Can't do gulp-webserver on Cloud9 :'(
gulp.task('webserver', function() {
    gulp.src(app + '/')
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});
*/

gulp.task('default', ['watch', 'html', 'js', 'scss', 'css'/*, 'webserver'*/]);
