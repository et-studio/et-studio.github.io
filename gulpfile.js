'use strict'

var gulp = require('gulp')
var esformatter = require('gulp-esformatter')
var et = require('./gulp-et')

gulp.task('et', function () {
  return gulp.src('src/*.html')
    .pipe(et())
    .pipe(gulp.dest('src'))
})
