import gulp from 'gulp';
import { parallel } from 'gulp';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';
import cleancss  from 'gulp-clean-css';
import csscomb  from 'gulp-csscomb';
import rename  from 'gulp-rename';
import pug  from 'gulp-pug';
import autoprefixer  from 'gulp-autoprefixer';

const sass = gulpSass(dartSass);

export function build() {
  return gulp
    .src('./src/*.scss')
    .pipe(sass({outputStyle: 'compressed', precision: 10})
      .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('./dist'))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./dist'));
}

function docs_css() {
  return gulp
    .src(['./src/*.scss', './docs/src/scss/*.scss'])
    .pipe(sass({outputStyle: 'compressed', precision: 10})
      .on('error', sass.logError)
    )
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest('./docs/dist'))
    .pipe(cleancss())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./docs/dist'));
}

function docs_pug() {
  return gulp
    .src('docs/src/**/!(_)*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./docs/'));
}

export function watch() {
  gulp.watch('./**/*.scss', parallel(build, docs_css));
  gulp.watch('./**/*.pug', docs_pug);
}

// export const watch = watch;
// export const build = build;
export const docs = parallel(docs_pug, docs_css);
export default build;
