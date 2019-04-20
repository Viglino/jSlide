const { src, dest, parallel } = require('gulp');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const minify = require("gulp-minify");
const watch = require("gulp-watch");

/* CSS */
function css() {
  return src(['src/style.css', 'src/*.css'])
    .pipe(minifyCSS())
    .pipe(concat('jslide.css'))
    .pipe(dest('build'))
}

/* JS */
function js() {
  return src(['src/jSlide.js', 'src/i19n.js', 'src/*.js'])
    .pipe(concat('jslide.js'))
    .pipe(minify({	ext: { 
        src:".js", 
        min:".min.js" 
      }
    }))
    .pipe(dest('build'))
}

/* Start a server and watch for modification for live reload */
function serve() {
  var liveServer = require("live-server");

  var params = {
    port: 8181,             // Set the server port. Defaults to 8080.
    host: "0.0.0.0",        // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    open: false,            // When false, it won't load your browser by default.
    watch: ['src','*.md'],  // comma-separated string for paths to watch
//    ignore: '',           // comma-separated string for paths to ignore
    file: "index.html",     // When set, serve this file (server root relative) for every 404 (useful for single-page applications)
    wait: 1000,             // Waits for all changes, before reloading. Defaults to 0 sec.
    logLevel: 2             // 0 = errors only, 1 = some, 2 = lots
  };
  liveServer.start(params);

  return watch(['./src/*.js','./src/*.css'], function() {
    css();
    js();
  });
}


exports.serve = serve;
exports.js = js;
exports.css = css;
exports.default = parallel(css, js);
  