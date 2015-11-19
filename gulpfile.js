var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var ui = require('helpful-ui');
var bs = require('browser-sync');
var runWintersmith = require('run-wintersmith');
var winterConfig = require('./config.json');
var sourcemaps = require('gulp-sourcemaps');

/**
 * Compiles stylus into css.
 */
gulp.task('styles', function () {
  return gulp
    .src('./assets/styles/*.styl')
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.plumber())
      .pipe(plugins.stylus({
        use: [ ui() ]
      }))
      .pipe(plugins.autoprefixer())
      .pipe(gulp.dest('./public'))
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(bs.stream({ match: './**/*.css' }));
});

/**
 * Builds the wintersmith site.
 */
gulp.task('build', ['styles'], function (cb) {
  runWintersmith.build(cb);
});

/**
 * Enables browser sync watching for the files.
 */
gulp.task('serve', ['build'], function () {
  bs.init({
    server: __dirname + '/public'
  });

  gulp.watch('./**/*.styl', ['styles']);
  gulp.watch(['./contents/**/*', './templates/**/*'], ['build']).on('change', bs.reload);
});

/**
 * Default task
 */
gulp.task('default', ['styles', 'build']);
