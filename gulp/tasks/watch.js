/* Notes:
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp     = require('gulp');
var config   = require('../config');

gulp.task('watch', ['browserSync'], function(callback) {
  //gulp.watch(config.sass.src,   ['sass']);
  //gulp.watch(config.images.src, ['images']);
  //gulp.watch(config.markup.src, ['markup']);
  gulp.watch(config.jsx.src, ['jsx']);
});
