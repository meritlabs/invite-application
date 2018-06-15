'use strict';
var gulp = require('gulp'),
  validator = require('gulp-html'),
  sass = require('gulp-sass'),
  shell = require('gulp-shell');

gulp.task('html', function() {
  return gulp.src('src/chat-form/index.html').pipe(validator()).pipe(gulp.dest('dist/server/chat-form/'));
});

gulp.task('sass', function() {
  return gulp
    .src('src/chat-form/form.sass')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(gulp.dest('dist/server/chat-form/'));
});

gulp.task('compileTS', shell.task('./node_modules/.bin/tsc'));

gulp.task('watch', function() {
  gulp.watch('src/**/*.sass', ['sass']);
  gulp.watch('src/chat-form/index.html', ['html']);
  gulp.watch('src/**/*.ts', ['compileTS']);
});
