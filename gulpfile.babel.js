import gulp from 'gulp';
import sass from 'gulp-sass';
import plumber from 'gulp-plumber';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import csso from 'gulp-csso';
import rename from 'gulp-rename';
import svgstore from 'gulp-svgstore';
import posthtml from 'gulp-posthtml';
import include from 'posthtml-include';
import del from 'del';

const server = browserSync.create();

gulp.task('copy', () => gulp.src([
  'source/fonts/**/*.{woff, woff2}',
  'source/img/**',
  'source/js/**',
], {
  base: 'source',
})
  .pipe(gulp.dest('build')));

gulp.task('clean', () => del('build'));

gulp.task('css', () => gulp.src('source/sass/style.scss')
  .pipe(plumber())
  .pipe(sass())
  .pipe(postcss([
    autoprefixer(),
  ]))
  .pipe(csso())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream()));

gulp.task('refresh', (done) => {
  server.reload();
  done();
});

gulp.task('server', () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/img/icon-*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/*.html', gulp.series('html', 'refresh'));
});

gulp.task('images', () => gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.jpegtran({ progressive: true }),
    imagemin.svgo(),
  ]))
  .pipe(gulp.dest('build/img')));

gulp.task('webp', () => gulp.src('source/img/**/*.{png,jpg}')
  .pipe(webp({ quality: 90 }))
  .pipe(gulp.dest('build/img')));

gulp.task('sprite', () => gulp.src('source/img/sprite-*.svg')
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(rename('sprite.svg'))
  .pipe(gulp.dest('build/img')));

gulp.task('html', () => gulp.src('source/*.html')
  .pipe(posthtml([
    include(),
  ]))
  .pipe(gulp.dest('build')));

gulp.task('build', gulp.series('clean', 'copy', 'css', 'sprite', 'html'));

gulp.task('start', gulp.series('build', 'server'));
