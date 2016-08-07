var gulp =require('gulp');
var shell = require('gulp-shell');
var clean = require('gulp-clean');
var RevAll = require('gulp-rev-all');
var revAll = new RevAll();

gulp.task('clean', function () {
    return gulp.src(['assets/dist'])
        .pipe(clean())
});
gulp.task('version', ['webpack'], function () {
  return gulp.src('assets/dist/**/*.*')
    .pipe(clean())
    .pipe(revAll.revision())
    .pipe(gulp.dest('assets/dist/'))
    .pipe(revAll.manifestFile())
    .pipe(gulp.dest(''));
});

gulp.task('webpack', shell.task(['webpack']));
gulp.task('watch',  shell.task(['webpack --watch']));

gulp.task('dev', ['watch']);

gulp.task('default', ['clean','webpack','version']);