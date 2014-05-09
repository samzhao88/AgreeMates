// Register build and test automation tasks
'use strict';

// Include gulp
var gulp = require('gulp');

// Include plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var bump = require('gulp-bump');
var karma = require('gulp-karma');

// Lint Task
gulp.task('lint', function() {
	return gulp.src(['public/app/**/*.js', '!public/app/vendor/**/*.js',
                  'server/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src('public/app/**/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('build'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build'));
});

// Watch Files For Changes
gulp.task('watch', function() {
	gulp.watch('js/*.js', ['lint', 'scripts']);
});

// Set up the file coverage
gulp.task('cover', function (cb) {
	gulp.src(['server/**/*.js', '!server/test/**'])
		.pipe(istanbul())
		.on('end', cb);
});


// Testing

function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}

function karmaTest(action) {
	return gulp.src('./foobar')
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: action
		}))
		.on('error', handleError);
}

gulp.task('test', ['test:server', 'test:client'], function() {});

// Run server tests and output reports
gulp.task('test:server', function () {
	gulp.src('./server/test/**/*.js')
		.pipe(mocha({ reporter: 'list' }))
		.on('error', handleError);
});

// Run client tests and output reports
gulp.task('test:client', function () {
  return karmaTest('run');
});

gulp.task('test:client_watch', function () {
  return karmaTest('watch');
});

gulp.task('bump', function () {
	gulp.src(['./package.json', './bower.json'])
		.pipe(bump())
		.pipe(gulp.dest('./'));
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);
