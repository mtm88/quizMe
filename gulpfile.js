
var gulp  = require('gulp'),
    gutil = require('gulp-util');
    jshint = require('gulp-jshint');
    sass   = require('gulp-sass');
    sourcemaps = require('gulp-sourcemaps');


gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});


gulp.task('jshint', function() {
  return gulp.src('source/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


gulp.task('watch', function() {
  gulp.watch('www/**/*.js', ['jshint']);
  gulp.watch('scss/**/*.scss', ['build-css']);
});

gulp.task('build-css', function() {
  return gulp.src('scss/**/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass())
    .pipe(sourcemaps.write()) 
    .pipe(gulp.dest('www/css'));
});

gulp.task('build-js', function() {
  return gulp.src('source/javascript/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(concat('bundle.js'))
      //only uglify if gulp is ran with '--type production'
      .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/assets/javascript'));
});