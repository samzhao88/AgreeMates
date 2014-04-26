// Include gulp
var gulp = require('gulp');

// Include plugins
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

// Lint Task
gulp.task('lint', function() {
	return gulp.src('**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
	return gulp.src('js/*.js')
		.pipe(concat('all.js'))
		.pipe(gulp.dest('dist'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist'))
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

function handleError(err) {
	console.log(err.toString());
	this.emit('end');
}

// Run tests and output reports
gulp.task('test', function () {
	gulp.src('./server/test/**/*.js')
		.pipe(mocha({ reporter: 'list' }))
		.on("error", handleError);
});

// Default Task
gulp.task('default', ['lint', 'scripts', 'watch']);
