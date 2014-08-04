---
layout: post
title: "Yeoman AngularJS Generator Tips"
categories: blog angular_js yeoman html5 javascript
posted_by: dbaba
---
I'm now trying to re-write a browser app with [AngularJS](http://angularjs.org/), which one of my colleagues introduced to me as a cool stuff. Prior to the development, I'm strugging with creating an initial development environment. I found issues and resolutions through the set up and I describe them as follows.

## Software and version

    yeoman            ... 1.0.4
	generator-angular ... 0.6.0
	(Running on OSX 10.8.5)

## Installation

### Yeoman

    npm install -g yo

![yeoman](/img/posts/2013-12-07-yo-angular/yeoman.png)

### Yeoman Generator for AngularJS

    npm install -g generator-angular

### Creating app dir and run generator
(same as readme.md at https://github.com/yeoman/generator-angular)

    mkdir my-new-project && cd $_
    yo angular [app-name]

### Installing more utilities with npm
I had to install `bower` and `grunt-cli` manually since I'd had never installed them.

    npm install -g bower
	npm install -g grunt-cli

`karma` is required as well since the generated `Gruntfile.js` requires `karma` for js unit testing.

    npm install karma --save-dev
Note that `-g` is not required. The module must be installed locally ratehr than globally. An error occurs when running grunt when locally installed `karma` module is missing.

Adding a dependency on `karma` into the generated `package.json` seems to be a better workaround so that other developers are able to share the valid dependency info, i.e.:

	"devDependencies": {
		-- snip --
	  "grunt-karma": "~0.6.2",
	  "karma": "~0.10.8"
	},
	-- snip --

### Additional Karma configuration
As described above, the generated `Gruntfile.js` requires `karma` for js unit testing. However, `karma.conf.js` is missing, never generated. So you need to create it manually. You can copy it from [angular-seed](https://github.com/angular/angular-seed/blob/master/config/karma.conf.js), an AngularJS skelton project. The file must be placed the same directory as the generated application root where `Gruntfile.js`/`bower.json`/`package.json` exist.

In addtion, you need to modify the copied file. Let's see where you need to modify.

#### basePath
Change the `basePath` from `../` to `.` as follows;

    basePath : '../',
to

    basePath : '.',

#### files and excludes
You need to replace `files` and `excludes` entries with the following stuff:

	files : [
	  'app/bower_components/angular/angular.js',
	  'app/bower_components/angular-cookies/angular-cookies.js',
	  'app/bower_components/angular-mocks/angular-mocks.js',
	  'app/bower_components/angular-resource/angular-resource.js',
	  'app/bower_components/angular-route/angular-route.js',
	  'app/bower_components/angular-sanitize/angular-sanitize.js',
	  'app/bower_components/es5-shim/es5-sham.js',
	  'app/bower_components/es5-shim/es5-shim.js',
	  'app/bower_components/json3/lib/json3.js',
	  'app/scripts/**/*.js',
	  'test/spec/**/*.js'
	],

	exclude : [
	],

#### plugins
As described in the `karma.conf.js`, there are some required plugins. You can install them by:

	npm install karma-junit-reporter --save-dev
	npm install karma-chrome-launcher --save-dev
	npm install karma-firefox-launcher --save-dev
	npm install karma-jasmine --save-dev

### Installing components with bower
In order to install view components, you need to run:

    bower install

You will see a blank page without running the command when previewing the app by `grunt serve`.

## SCM integration tips

### node_modules directory
As you can see if you take a look at the generated `.gitignore` file, `node_modules` directory cannot be committed. Other developers sharing the application project have to install dependent packages by running `npm install` after cloning the repository source codes.

### bower_components
As descrived above, `bower install` is required as `bower_components` is never shared by SCM as well as `node_modules`.

## Appendix

### grunt command log

    $ cd /path/to/app
	$ grunt
	Running "newer:jshint" (newer) task
	
	Running "newer:jshint:all" (newer) task
	
	Running "jshint:all" (jshint) task
	
	✔ No problems
	
	
	Running "newer-timestamp:jshint:all:/path/to/app/node_modules/grunt-newer/.cache" (newer-timestamp) task
	
	Running "newer-reconfigure:jshint:all:1" (newer-reconfigure) task
	
	Running "newer:jshint:test" (newer) task
	No newer files to process.
	
	Running "clean:server" (clean) task
	Cleaning .tmp...OK
	
	Running "concurrent:test" (concurrent) task
    
	    Running "copy:styles" (copy) task
	    Copied 1 files
    
	    Done, without errors.
    
	Running "autoprefixer:dist" (autoprefixer) task
	Prefixed file ".tmp/styles/main.css" created.
	
	Running "connect:test" (connect) task
	Started connect web server on 127.0.0.1:9001.
	
	Running "karma:unit" (karma) task
	INFO [karma]: Karma v0.10.8 server started at http://localhost:9876/
	INFO [launcher]: Starting browser Chrome
	INFO [Chrome 31.0.1650 (Mac OS X 10.8.5)]: Connected on socket YowVhXCiiYoR7CX7237H
	Chrome 31.0.1650 (Mac OS X 10.8.5): Executed 1 of 1 SUCCESS (0.819 secs / 0.021 secs)
	
	Running "clean:dist" (clean) task
	Cleaning .tmp...OK
	Cleaning dist/.htaccess...OK
	Cleaning dist/404.html...OK
	Cleaning dist/bower_components...OK
	Cleaning dist/favicon.ico...OK
	Cleaning dist/images...OK
	Cleaning dist/index.html...OK
	Cleaning dist/robots.txt...OK
	Cleaning dist/scripts...OK
	Cleaning dist/styles...OK
	Cleaning dist/views...OK
	
	Running "useminPrepare:html" (useminPrepare) task
	Going through app/index.html to update the config
	Looking for build script HTML comment blocks
	
	Configuration is now:
	
	  concat:
	  { generated: 
	   { files: 
	      [ { dest: '.tmp/concat/styles/main.css',
	          src: [ '{.tmp,app}/styles/main.css' ] },
	        { dest: '.tmp/concat/scripts/modules.js',
	          src: 
	           [ 'app/bower_components/angular-resource/angular-resource.js',
	             'app/bower_components/angular-cookies/angular-cookies.js',
	             'app/bower_components/angular-sanitize/angular-sanitize.js',
	             'app/bower_components/angular-route/angular-route.js' ] },
	        { dest: '.tmp/concat/scripts/scripts.js',
	          src: 
	           [ '{.tmp,app}/scripts/app.js',
	             '{.tmp,app}/scripts/controllers/main.js' ] } ] } }
	
	  uglify:
	  { generated: 
	   { files: 
	      [ { dest: 'dist/scripts/modules.js',
	          src: [ '.tmp/concat/scripts/modules.js' ] },
	        { dest: 'dist/scripts/scripts.js',
	          src: [ '.tmp/concat/scripts/scripts.js' ] } ] } }
	
	  cssmin:
	  { generated: 
	   { files: 
	      [ { dest: 'dist/styles/main.css',
	          src: [ '.tmp/concat/styles/main.css' ] } ] } }
	
	Running "concurrent:dist" (concurrent) task
    
	    Running "copy:styles" (copy) task
	    Copied 1 files
    
	    Done, without errors.
        
	    Running "svgmin:dist" (svgmin) task
    
	    Done, without errors.
        
	    Running "imagemin:dist" (imagemin) task
	    ✔ app/images/yeoman.png (saved 9.06 kB)
	    Minified 1 image (saved 9.06 kB)
    
	    Done, without errors.
        
	    Running "htmlmin:dist" (htmlmin) task
	    File dist/404.html created.
	    File dist/index.html created.
	    File dist/views/main.html created.
    
	    Done, without errors.
    
	Running "autoprefixer:dist" (autoprefixer) task
	Prefixed file ".tmp/styles/main.css" created.
	
	Running "concat:generated" (concat) task
	File ".tmp/concat/styles/main.css" created.
	File ".tmp/concat/scripts/modules.js" created.
	File ".tmp/concat/scripts/scripts.js" created.
	
	Running "ngmin:dist" (ngmin) task
	ngminifying .tmp/concat/scripts/modules.js, .tmp/concat/scripts/scripts.js
	
	Running "copy:dist" (copy) task
	Created 14 directories, copied 79 files
	
	Running "cdnify:dist" (cdnify) task
	Going through dist/404.html, dist/index.html to update script refs
	
	Running "cssmin:generated" (cssmin) task
	File dist/styles/main.css created.
	
	Running "uglify:generated" (uglify) task
	File "dist/scripts/modules.js" created.
	File "dist/scripts/scripts.js" created.
	
	Running "rev:dist" (rev) task
	dist/scripts/modules.js >> c07337e8.modules.js
	dist/scripts/scripts.js >> 921f5508.scripts.js
	dist/styles/main.css >> b435e14e.main.css
	dist/images/yeoman.png >> 3c0b8449.yeoman.png
	
	Running "usemin:html" (usemin) task
	
	Processing as HTML - dist/404.html
	Update the HTML to reference our concat/min/revved script files
	Update the HTML with the new css filenames
	Update the HTML with the new img filenames
	Update the HTML with data-main tags
	Update the HTML with data-* tags
	Update the HTML with background imgs, case there is some inline style
	Update the HTML with anchors images
	Update the HTML with reference in input
	
	Processing as HTML - dist/index.html
	Update the HTML to reference our concat/min/revved script files
	<script src="scripts/modules.js" changed to <script src="scripts/c07337e8.modules.js"
	<script src="scripts/scripts.js" changed to <script src="scripts/921f5508.scripts.js"
	Update the HTML with the new css filenames
	<link rel="stylesheet" href="styles/main.css" changed to <link rel="stylesheet" href="styles/b435e14e.main.css"
	Update the HTML with the new img filenames
	Update the HTML with data-main tags
	Update the HTML with data-* tags
	Update the HTML with background imgs, case there is some inline style
	Update the HTML with anchors images
	Update the HTML with reference in input
	
	Processing as HTML - dist/views/main.html
	Update the HTML to reference our concat/min/revved script files
	Update the HTML with the new css filenames
	Update the HTML with the new img filenames
	<img src="images/yeoman.png" changed to <img src="images/3c0b8449.yeoman.png"
	Update the HTML with data-main tags
	Update the HTML with data-* tags
	Update the HTML with background imgs, case there is some inline style
	Update the HTML with anchors images
	Update the HTML with reference in input
	
	Running "usemin:css" (usemin) task
	
	Processing as CSS - dist/styles/b435e14e.main.css
	Update the CSS to reference our revved images
	
	Done, without errors.
