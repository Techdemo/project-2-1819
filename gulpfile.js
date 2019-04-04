const gulp = require('gulp');
const uglify = require('gulp-uglify');
const cssnano = require('gulp-cssnano');
const cleanCSS = require('gulp-clean-css');
const pipeline = require('readable-stream').pipeline;
const rename = require("gulp-rename");
const webp = require("gulp-webp");
const imagemin = require("gulp-imagemin")

gulp.task('min-js', function () {
    return gulp.src('./public/js/*.js')
        .pipe(uglify())
        .pipe(rename(function (path) {
            path.basename += "-min";
            path.extname = ".js";
        }))
        .pipe(gulp.dest('./public/javascripts/'))
})

gulp.task('min-css', function () {
    return gulp.src('./public/css/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(cssnano({
            discardComments: {
                removeAll:
                    true
            }
        }))
        .pipe(rename(function (path) {
            path.basename += "-min";
            path.extname = ".css";
        }))
        .pipe(gulp.dest('./public/stylesheets/'));
})

gulp.task('images', function () {
    return gulp.src('./public/imagesOld/**/*')
        .pipe(imagemin({ progressive: true }))
        .pipe(gulp.dest('./public/images/'))
        .pipe(webp())
        .pipe(gulp.dest('./public/images/'))
});


