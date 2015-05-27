var gulp = require('gulp'),	
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	ngdocs = require('suh-dgeni-ngdocs'),
	path = require('canonical-path'),
	_ = require('lodash'),
	PATHS = {
		CSS:{
			DOCS_LIB:[
			'./components/bootstrap/dist/css/bootstrap.min.css',
			'./components/open-sans-fontface/open-sans.css',
			]
		},
		JS:{
			SRC:['./src/*.js','./src/**/*.js'],
			DOCS_LIB:[
			'./components/jquery/dist/jquery.min.js',
			'./components/angular/angular.min.js',
			'./components/angular-animate/angular-animate.min.js',
			'./components/angular-touch/angular-touch.min.js',
			'./components/angular-sanitize/angular-sanitize.min.js',
			'./components/angular-cookies/angular-cookies.min.js',
			'./components/angular-resource/angular-resource.min.js',
			'./components/angular-route/angular-route.min.js',
			'./components/bootstrap/dist/js/bootstrap.min.js',
			'./components/angular-bootstrap/ui-bootstrap.min.js',
			'./components/angular-bootstrap/ui-bootstrap-tpls.min.js',
			'./components/google-code-prettify/bin/prettify.min.js',
			'./components/google-code-prettify/src/lang-css.js',
			'./components/lunr.js/lunr.min.js',
			'./components/marked/marked.min.js',
			'./']
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

function handleError(err){
	console.log(err);
	this.emit('end');
}

gulp.task('concat-dev',function(){
	return gulp.src(PATHS.JS.SRC)
		.pipe(concat('suh-general.js'))
		.pipe(gulp.dest('./'));
});

gulp.task('concat-docs-lib',function(){
	gulp.src(PATHS.JS.DOCS_LIB)
		.pipe(concat('lib.min.js'))
		.pipe(gulp.dest('./build/docs/js/'));
	gulp.src(PATHS.CSS.DOCS_LIB)
		.pipe(concat('lib.min.css'))
		.pipe(gulp.dest('./build/docs/css/'));
	gulp.src('./documentation/src/*.js')
		.pipe(concat('docs.min.js'))
		.pipe(gulp.dest('./build/docs/js/'));
});

gulp.task('concat-pro',function(){
	try{
		return gulp.src(PATHS.JS.SRC)
			.pipe(concat('suh-general.min.js'))
			.pipe(uglify())
			.on('error',handleError)
			.pipe(gulp.dest('./'));
	}catch(err){
		console.log(err);
	}
});

gulp.task('ngdocs',['concat-docs-lib','concat-dev'],function(){
	// return gulp.src(PATHS.JS.SRC)
	//     .pipe(ngdocs.process(options))
	//     .on('error',handleError)
	//     .pipe(gulp.dest('./docs'));
	try{
		ngdocs.generate({
	defaultDeployment:{
		name:'default',
		meta:{
			description:'This is just a test suite'
		},
		navigation:{
			top:{
				navItems:[{
            		type:'divider',
          		},
          		{
		            type:'dropdown',
		            disabled:true,
		            label:'TestModule Documentation',
		            url:'#',
		            menu:[{
			              	label:'API Reference',
			              	url:'api'
			            },{
			              	label:'Guides',
			              	url:'guide'
			            },{
			            	label:'Suhail',
			            	url:'suhail'
			            }
			        ]
          		},
          		{
          			type:'divider'
          		}]
			}
		},
		scripts:[path.resolve('./suh-general.min.js')]
	},
	basePath:path.resolve('src'),
	scripts:[],
	stylesheets:[],
	fonts:[],
	sourceFiles:[path.resolve('./suh-general.js')],
	AREA_NAMES:{
		suhail:'Suhail Abood',
	},
	outputFolder:path.resolve('generated'),
	homePage:{
		data:{
			title:'Suhail Abood Library',
			description:'A library to do something.',
			dependencies:[{
				name:'angular',
				version:'1.3.15'
			},{
				name:'jquery',
				version:'2.1.13'
			}]
		}
	},
	logger:{
		level:null
	},
	extraData:{
		angular:'1.3.15',
		jquery:'2.1.13',
		name:'Suhail Abood',
		module:{
			version:'v1.0.0',
			file:'suh-general.js',
			minifiedFile:'suh-general.min.js'
		}
	}
});
	}catch(e){
		console.log(e);
	}
}); 

gulp.task('watch',function(){
	gulp.watch(PATHS.JS.SRC, ['concat-dev','concat-pro','ngdocs']);
});

gulp.task('default',['watch'], function() {
    // content
});

gulp.task('production',['watch'], function() {
    // content
});