var gulp = require('gulp');
var react = require('gulp-react');

gulp.task('default', function () {
  return gulp.src('./app/components/**/*.jsx')
    .pipe(react())
    .pipe(gulp.dest('./client/scripts/components'));
});

gulp.task('watch', function(){
	gulp.watch('./app/components/**/*.jsx',['default']);
});