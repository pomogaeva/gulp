'use strict';

const {
  src,
  dest,
  series,
  watch,
  parallel
} = require('gulp');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');

const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const connect = require('gulp-connect');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const path = {
  src: './src/',
  dist: './dist/'
};

function connectServer(cb) {
  connect.server({
    port: 8080,
    root: path.dist,
    livereload: true
  });

  cb();
}

function watching(cb) {
  watch(path.src + 'index.html', html);
  watch(path.src + '**/*.scss', styles);
  watch(path.src + 'scripts/main.js', js);
  watch(paths.src + 'assets/**/*', assets);

  cb();
}

function clean() {
  return del(path.dist + '**', {
    force: true
  });
}

function html() {
  return src(path.src + 'index.html')
    .pipe(connect.reload())
    .pipe(dest(path.dist));
}

function styles() {
  return src(path.src + 'styles/style.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    .pipe(connect.reload())
    .pipe(dest(path.dist));
}

function js() {
  return src(path.src + 'scripts/app.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ["@babel/preset-env"]
    }))
    // .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(connect.reload())
    .pipe(dest(path.dist));
}

function assets() {
  return src(path.src + 'assets/**/*')
    .pipe(connect.reload())
    .pipe(dest(path.dist + 'assets'));
}

exports.build = series(clean, html, styles, js, assets);
exports.default = series(
  clean, html, styles, js, assets,
  parallel(connectServer, watching)
);