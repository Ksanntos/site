var gulp = require('gulp')
	,imagemin = require('gulp-imagemin')
	,inject = require('gulp-inject')
	,clean = require('gulp-clean')
	,concat = require('gulp-concat')
	,htmlReplace = require('gulp-html-replace')
	,uglify = require('gulp-uglify')
	,usemin = require('gulp-usemin')
	,cssmin = require('gulp-cssmin')
	,browserSync = require('browser-sync').create()
	,jshint = require('gulp-jshint')
	,jshintStylish = require('jshint-stylish')
	,csslint = require('gulp-csslint')
	,autoprefixer = require('gulp-autoprefixer')
	,less = require('gulp-less')
	,mainBowerFiles = require('main-bower-files')
	,es = require('event-stream')
	,wiredep = require('wiredep').stream
    ,sass = require('gulp-sass');

gulp.task('default', ['copy'], function() {
	gulp.start('build-img', 'usemin');
});

gulp.task('copy', ['clean'], function() {
	return gulp.src('src/**/*')
		.pipe(gulp.dest('dist'));
});

gulp.task('copy-bower', function() {
	return gulp.src('bower_components/**/dist/**/*')
		.pipe(gulp.dest('src/assets/components'));
});

gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(clean());
});

gulp.task('build-img', function() {

	return gulp.src('dist/assets/css/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});

gulp.task('usemin', function() {
	return gulp.src('dist/index.html')
		.pipe(usemin({
			js: [uglify],
			css: [autoprefixer]
		}))
		.pipe(gulp.dest('dist'));
});

// task para o sass 
gulp.task('sass', ['watch'], function(){
    return gulp.src('sass/**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('src/css'));
});

// task watch
gulp.task('watch', function(){
    gulp.watch('sass/**/*.scss', ['sass']);
}); 

// For development:
gulp.task('wiredep', function () {
	gulp.src('src/index.html')
	    .pipe(wiredep())
	    .pipe(gulp.dest('src'));
});

gulp.task('serve', ['sass'], function() {
		browserSync.init({
				server: {
						baseDir: 'src'
				}
		});

		gulp.watch('src/**/*').on('change', browserSync.reload);

		gulp.watch('src/**/*.js').on('change', function(event) {
				console.log("Linting " + event.path);
				gulp.src(event.path)
						.pipe(jshint())
						.pipe(jshint.reporter(jshintStylish));
		});

		gulp.watch('src/assets/css/**/*.css').on('change', function(event) {
				console.log("Linting " + event.path);
				gulp.src(event.path)
						.pipe(csslint())
						.pipe(csslint.reporter());
		});  
});
