'use strict';
var gulp = require('gulp'),
  validator = require('gulp-html'),
  sass = require('gulp-sass');

gulp.task('html', function() {
  return gulp.src('src/chat-form/index.html').pipe(validator()).pipe(gulp.dest('dist/server/chat-form/'));
});

gulp.task('sass', function() {
  return gulp
    .src('src/chat-form/form.sass')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('dist/server/chat-form/'));
});
