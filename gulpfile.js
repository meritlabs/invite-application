'use strict';
var gulp = require('gulp'),
  htmlmin = require('gulp-htmlmin'),
  sass = require('gulp-sass'),
  shell = require('gulp-shell'),
  minifyjs = require('gulp-js-minify');

gulp.task('html', function() {
  return gulp
    .src('src/chat-form/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist/server/chat-form/'));
});

gulp.task('sass', function() {
  return gulp
    .src('src/chat-form/form.sass')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('dist/server/chat-form/'));
});

gulp.task('compileTS', shell.task('./node_modules/.bin/tsc'));

gulp.task('cpImages', shell.task('cp -a src/common/images dist/server/chat-form/'));

gulp.task('watch', function() {
  gulp.watch('src/**/*.sass', ['sass']);
  gulp.watch('src/chat-form/index.html', ['html']);
  gulp.watch('src/**/*.ts', ['compileTS']);
});
