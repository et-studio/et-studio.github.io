'use strict'

var gulp = require('gulp')
var concat = require('gulp-concat')
var uglify = require('gulp-uglify')
var cssmin = require('gulp-cssmin')
var rename = require('gulp-rename')
var et = require('./gulp-et')

gulp.task('et', function () {
  return gulp.src('src/*.html')
    .pipe(et())
    .pipe(gulp.dest('tmp'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('tmp'))
})

gulp.task('js', ['et'], function () {
  return gulp.src([
    'node_modules/et-template/es5/dependency.js',
    'tmp/template.js',
    'src/api.js',
    'src/router.js',
    'src/view.js',
    'src/app.js'
  ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist'))
})

gulp.task('css', function () {
  return gulp.src([
    'node_modules/todomvc-common/base.css',
    'node_modules/todomvc-app-css/index.css'
  ])
    .pipe(concat('style.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('dist'))
})

gulp.task('default', ['js', 'css'])
