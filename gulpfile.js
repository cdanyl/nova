const gulp = require('gulp');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const es6Transpiler = require('gulp-es6-transpiler');
const uglify = require('gulp-uglify');

const allModules = [
	'./src/namespace.js',

	'./src/shared/higherOrder.js',
	'./src/shared/math.js',
	'./src/shared/pipe.js',

	'./src/components/shapes.js',
	'./src/components/bodies.js',
	'./src/components/appearances.js',
	'./src/components/misc.js',

	'./src/core/engine.js',
	'./src/core/state.js',
	'./src/core/update.js',
	'./src/core/render.js',

	'./src/utils/input.js',
	'./src/utils/assets.js',
	'./src/utils/misc.js'
];

gulp.task('build', function() {
	return gulp.src(allModules)
		.pipe(concat('nova.js'))
		.pipe(gulp.dest('./build'))
		.pipe(rename('nova.min.js'))
		.pipe(es6Transpiler())
		.pipe(uglify())
		.pipe(gulp.dest('./build/'));
});
