import gulp from 'gulp';
import * as sass from 'sass'; // Dart Sass API
import autoprefixer from 'gulp-autoprefixer';
import cleancss from 'gulp-clean-css';
import rename from 'gulp-rename';
import pug from 'gulp-pug';

// Compile Sass files
function buildStyles() {
  return gulp
    .src('./src/**/*.scss', { sourcemaps: true })
    .pipe(
      gulp.dest((file) => {
        // Use Dart Sass API to compile the file manually
        const result = sass.compile(file.path, {
          style: 'compressed', // Use 'expanded' for readable output or 'compressed' for minified
          precision: 10,
        });
        file.contents = Buffer.from(result.css);
        return './dist'; // Target directory
      })
    )
    .pipe(autoprefixer({ cascade: false })) // Add vendor prefixes
    .pipe(gulp.dest('./dist', { sourcemaps: '.' })) // Write output with sourcemaps
    .pipe(cleancss()) // Minify CSS
    .pipe(
      rename({
        suffix: '.min',
      })
    )
    .pipe(gulp.dest('./dist'));
}

// Compile Pug templates
function buildPug() {
  return gulp
    .src('./docs/src/**/!(_)*.pug')
    .pipe(
      pug({
        pretty: true, // For readable HTML
      })
    )
    .pipe(gulp.dest('./docs/'));
}

// Watch for file changes
function watchFiles() {
  gulp.watch('./src/**/*.scss', buildStyles); // Watch SCSS files
  gulp.watch('./docs/src/**/*.pug', buildPug); // Watch Pug files
}

export const build = gulp.series(buildStyles);
export const docs = gulp.series(buildPug);
export const watch = gulp.parallel(watchFiles);
export default build;
