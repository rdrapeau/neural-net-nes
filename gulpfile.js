var gulp = require('gulp');
var ts = require('gulp-typescript');
var nodeunit = require('gulp-nodeunit');
var concat = require('gulp-concat');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require("vinyl-source-stream");

 
gulp.task('default', ['bundleClient']);

gulp.task('compileTS', function() {
	var tsResult = gulp
				.src('src/**/*.ts')
				.pipe(ts({
					noEmitOnError : true,
					module: 'commonjs',
					outDir: 'bin'
				}));


	return tsResult.js.pipe(gulp.dest('./bin'));
});

gulp.task('buildEmulator', function() {
	// The emulator needs to be concatenated together
	// (as per the original grunt build system)
	return gulp.src([
		"./src/vendor/nes_emu/nes.js", "./src/vendor/nes_emu/utils.js",
		"./src/vendor/nes_emu/cpu.js", "./src/vendor/nes_emu/keyboard.js",
		"./src/vendor/nes_emu/mappers.js", "./src/vendor/nes_emu/papu.js",
		"./src/vendor/nes_emu/ppu.js", "./src/vendor/nes_emu/rom.js",
		"./src/vendor/nes_emu/ui.js"])
		.pipe(concat('jsnes.js'))
		.pipe(gulp.dest('./src/vendor/nes_emu/'));
});

gulp.task('bundleClient', ['buildEmulator', 'compileTS', 'move'], function() {
	var b = browserify();
	
	// USING THE REACT TRANSFORM
	b.transform(reactify);
	
	// Grab the file to build the dependency graph from
	b.add('./bin/client/main.js');
	
	b.bundle()
	 .pipe(source('main.js'))
	 .pipe(gulp.dest('./bin/client/static/js'));
});

gulp.task('move', ['move-vendor', 'move-component', 'move-statics']);

gulp.task('move-component', function(cb) {
    // move components
    var jsx = gulp.src('src/client/component/*.jsx')
                  .pipe(gulp.dest('./bin/client/component'));

    jsx.on('end', function() {
        cb();
    });
});

gulp.task('move-vendor', function(cb) {
    // move vendors
    var jsx = gulp.src('src/vendor/**/*')
                  .pipe(gulp.dest('./bin/vendor'));

    jsx.on('end', function() {
        cb();
    });
});

gulp.task('move-statics', function() {
	var vendors = gulp
				.src('src/client/static/**/*');

	return vendors.pipe(gulp.dest('./bin/client/static'));
});

gulp.task('test', function() {
    var tests = gulp.src('bin/**/*.test.js');

    tests.pipe(nodeunit());
});