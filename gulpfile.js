var gulp = require('gulp'),
    ejs = require('gulp-ejs'),
    rename = require('gulp-rename'),
    gutil = require('gulp-util'),
    beautify = require('gulp-beautify')
    uglify = require('gulp-uglify');

var settings = require('./settings.js');

gulp.task('sjs', function() {
    return Object.keys(settings.browserSupport).forEach(function(key) {
        console.log(settings.browserSupport[key]);

        gulp.src('./src/s.js')
            .pipe(ejs({"settings": settings.browserSupport[key], "modules": settings.modules}, {ext: '.js', 'rmWhitespace': true}))
            .pipe(beautify())
            .pipe(rename(key + '.js'))
            .pipe(gulp.dest('./prod/'));
    });
});

gulp.task('html', ['sjs'], function(){
    return gulp.src(['./src/test/**'])
    .pipe(gulp.dest('./prod/test/'));
});

gulp.task('benchmark', ['sjs'], function(){
    return gulp.src('./src/benchmark/**')
    .pipe(gulp.dest('./prod/benchmark/'));
});

gulp.task('unittests', ['sjs'], function(){
    return gulp.src('./src/unittests/**')
    .pipe(gulp.dest('./prod/unittests/'));
});
 
gulp.task('compress', ['sjs'], function() {
    return Object.keys(settings.browserSupport).forEach(function(key) {
        gulp.src('./prod/' + key + '.js')
            .pipe(uglify())
            .pipe(rename(key + '.min.js'))
            .pipe(gulp.dest('./prod/'));
    });   
});

gulp.task('move', ['compress'], function() {
  return gulp.src('./prod/**/*')
    .pipe(gulp.dest('C:/xampp/htdocs/sjs/'));
});

gulp.task('watch', function() {   
    gulp.watch(['./src/*.js', './src/modules/**'], ['sjs', 'compress']);
    gulp.watch('./src/test/**', ['html']);
    gulp.watch('./src/unittests/**', ['unittests']);
    gulp.watch('./src/benchmark/*', ['benchmark']);
    gulp.watch('./src/**/*', ['sjs', 'compress', 'move']);
});

gulp.task('default', ['watch', 'compress'], function() {});

