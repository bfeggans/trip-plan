var gulp         = require('gulp');
var config       = require('../config').jsx;
var react      	 = require('gulp-react');
var browserSync  = require('browser-sync');

gulp.task('jsx', function () {
  return gulp.src(config.src)
    .pipe(react())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});