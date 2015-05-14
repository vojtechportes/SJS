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
    gulp.src(['./src/test/**'])
    .pipe(gulp.dest('./prod/test/'));
});

gulp.task('benchmark', function(){
    gulp.src('./src/benchmark/**')
    .pipe(gulp.dest('./prod/benchmark/'));
});
 
gulp.task('compress', ['sjs'], function() {
  gulp.src('./prod/s.js')
    .pipe(uglify())
    .pipe(rename('s.min.js'))
    .pipe(gulp.dest('./prod/'));
});

gulp.task('move', ['compress'], function() {
  gulp.src('./prod/**/*')
    .pipe(gulp.dest('C:/xampp/htdocs/sjs/'));
});

gulp.task('watch', function() {   
    gulp.watch(['./src/*.js', './src/modules/**'], ['sjs', 'compress']);
    gulp.watch('./src/test/**', ['html']);
    gulp.watch('./src/benchmark/*', ['benchmark']);
    gulp.watch('./src/**/*', ['move']);
});

gulp.task('default', ['watch', 'sjs', 'compress', 'html', 'benchmark', 'move'], function() {});

