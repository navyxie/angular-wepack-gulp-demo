var gulp =require('gulp');
var fs = require('fs');
var path = require('path');
var shell = require('gulp-shell');
var webpack = require('gulp-webpack');
var clean = require('gulp-clean');
gulp.task('clean', function () {
    return gulp.src(['assets/dist'])
        .pipe(clean())
});

gulp.task('webpack', ['clean'], shell.task(['webpack']));

gulp.task('watchjs', function (done) {
    gulp.watch('assets/js/app/**/*.js', ['webpack']).on('end', done);
});

gulp.task('dev', ['watchjs']);

gulp.task('default', ['webpack']);