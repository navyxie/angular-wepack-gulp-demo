var gulp =require('gulp');
var shell = require('gulp-shell');
var clean = require('gulp-clean');

gulp.task('clean', function () {
    return gulp.src(['assets/dist'])
        .pipe(clean())
});

gulp.task('webpack', shell.task(['webpack --watch']));

gulp.task('dev', ['webpack']);

gulp.task('default', ['clean','webpack']);