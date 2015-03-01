var gulp        = require('gulp');
var gutil       = require('gulp-util');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var sourcemaps  = require('gulp-sourcemaps');
var reload      = browserSync.reload;

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('sass', function() {
    return gulp.src("./styles/scss/*.scss")
        .pipe(sourcemaps.init())
            .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./styles/css"))
        .pipe(reload({stream:true}));
});

gulp.task('js', function() {
    return gulp.src('js/*js')
        .pipe(gulp.dest('./js'))
        .pipe(reload({
        stream: true
    }));
});

gulp.task('default', ['browser-sync'], function() {
    gulp.watch("js/*.js", ['js']);
    gulp.watch("styles/scss/*.scss", ['sass']);
    gulp.watch("./*.html").on('change', reload);
});
