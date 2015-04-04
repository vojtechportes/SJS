var gulp = require('gulp'),
    ejs = require('gulp-ejs'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify');

var projectName = 'lessejs';

gulp.task('sjs', function() {
    gulp.src('./src/s.js')
        .pipe(ejs({}, {ext: '.js'}))
        .pipe(rename('s.js'))
        .pipe(gulp.dest('./prod/'));
});

gulp.task('html', function(){
    gulp.src('./src/*.html')
    .pipe(gulp.dest('./prod/test/'));
});
 
gulp.task('compress', ['sjs'], function() {
  gulp.src('./prod/s.js')
    .pipe(uglify())
    .pipe(rename('s.min.js'))
    .pipe(gulp.dest('./prod/'));
});

gulp.task('watch', function() {   
    gulp.watch(['./src/*.js', './src/modules/**'], ['sjs', 'compress']);
    gulp.watch('./src/*.html', ['html']);
});

gulp.task('default', ['watch', 'sjs', 'compress', 'html'], function() {});

