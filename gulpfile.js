var gulp = requrie('gulp'),	
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	ngdocs = require('gulp-ngdocs'),
	PATHS = {
		JS:{
			SRC:['./src/*.js','./src/**/*.js']
		}
	},
	options = {
    scripts: ['./components/angular/angular.min.js',
    		'./components/angular/angular.min.js.map', 
    		'./components/angular-animate/angular-animate.min.js',
    		'./components/angular-animate/angular-animate.min.js.map',
    		'./suh-general.js'],
    html5Mode: false,
    startPage: '/api',
    title: "suh-general",
    titleLink: "/api"
};

gulp.task('concat-dev',function(){
	return gulp.src(PATHS.JS.SRC)
		.pipe(concat('suh-general.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('concat-pro',function(){
	return gulp.src(PATHS.JS.SRC)
		.pipe(concat('suh-general.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./'));
});

gulp.task('ngdocs',function(){
	return gulp.src(PATHS.JS.SRC)
	    .pipe(ngdocs.process(options))
	    .pipe(gulp.dest('./docs'));
}); 

gulp.task('watch',function(){
	gulp.watch(PATHS.JS.SRC, ['concat-src','concat-pro','ngdocs']);
});

gulp.task('default',['watch'], function() {
    // content
});

gulp.task('production',['watch'], function() {
    // content
});