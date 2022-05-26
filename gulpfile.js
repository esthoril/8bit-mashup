'use strict'

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync'),
  del = require('del'),
  //imagemin = require('gulp-imagemin'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  rev = require('gulp-rev'),
  cleanCss = require('gulp-clean-css'),
  flatmap = require('gulp-flatmap'),
  htmlmin = require('gulp-htmlmin');

gulp.task('sass', function() {
  return gulp.src('./src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/css'))
});

gulp.task('sass:watch', function() {
  gulp.watch('./src/css/*.css', ['sass']) // watch is built-in with gulp
});

gulp.task('browser-sync', function() {
  var files = [
    './src/**/*.html',
    './src/css/*.css',
    './src/js/*.js',
    './src/img/*.{png,jpg,gif}'
  ];
  browserSync.init(files, { server: { baseDir: './src/'}});
});

gulp.task('default', gulp.series('browser-sync', function() {
  gulp.series('sass:watch');  // this way we make sure browser-sync is running first before we start watching
}));

gulp.task('clean', function() {
  console.log("Cleaning dist folder");
  return del(['dist']);
});

//gulp.task('copybase', function(done) {
gulp.task('copybase', done => {
  console.log("Copy base files");
  gulp.src('./src/css/*.{otf,ttf,woff,eof,svg}*').pipe(gulp.dest('./dist/css')); // custom fonts
  gulp.src('./src/img/**/*.{png,jpg,gif}').pipe(gulp.dest('./dist/img')); // images
  gulp.src('./src/assets/**/*.txt').pipe(gulp.dest('./dist/assets')); // dynamic json content
  done();
});


gulp.task('copyfonts', done => {  // no need for copy plugin as we just pipe the file stream to new destination
  console.log("Copy fonts");
  gulp.src('./node_modules/font-awesome/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
  done();
});


// Images
gulp.task('imagemin', function() {
  return gulp.src('./src/img/**/*.{png,jpg,gif}')
    //.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))  // just copy
    .pipe(gulp.dest('./dist/img'));
});


gulp.task('usemin', function() {
  return gulp.src('./src/**/*.html', '!./src/blog/*.html').pipe(flatmap(function(stream, file){
    return stream.pipe(usemin({  // minimize the files inside this function
      html: [function() { return htmlmin({ collapseWhitespace: true })}], // remove whitespace from html files
      css: [rev()],
      js: [rev()]
    }))
  })).pipe(gulp.dest('./dist'));  // pipe the resulting files to the dist folder
});


/**
 * Build the website
 * Clean
 * Copy all files
 * Usemin html
 */
gulp.task('build', gulp.series(
  'clean',
  gulp.parallel('copybase', 'copyfonts'),
  'usemin',
  done => {
    console.log("Building site done!")
    done();
  })
);
