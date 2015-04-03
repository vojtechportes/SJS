var gulp = require('gulp'),
    ejs = require('gulp-ejs'),
    gutil = require('gulp-util');

var projectName = 'lessejs';

gulp.task('sjs', function() {
    gulp.src('./src/s.js')
        .pipe(ejs({}, {ext: '.js'}))
        .pipe(gulp.dest('./prod/'));
});

gulp.task('html', function(){
    gulp.src('./src/*.html')
    .pipe(gulp.dest('./prod/'));
});

gulp.task('watch', function() {   
    gulp.watch(['./src/*.js', './src/modules/**'], ['sjs']);
    gulp.watch('./src/*.html', ['html']);
});

gulp.task('default', ['watch', 'sjs', 'html'], function() {});

