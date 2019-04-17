// Include config
import config from './config';

// Plugins
import gulp from 'gulp';
import del from 'del';
import plugins from 'gulp-load-plugins';
import browser from 'browser-sync';
import yargs from 'yargs';
import named from 'vinyl-named';
import webpack from 'webpack-stream';

// Variables
const globalConfig = config();
const $ = plugins();
const PRODUCTION = !!(yargs.argv.production);
const TEST = !!(yargs.argv.devtest);

function cleanStyles () {
  return del([globalConfig.outputPath + globalConfig.outputFolders.styles + '**/*.css'], {force: true});
}
function cleanScriptsVendor () {
  return del([globalConfig.outputPath + globalConfig.outputFolders.scripts + 'vendor.js'], {force: true});
}

function cleanScripts () {
  return del([
    globalConfig.outputPath + globalConfig.outputFolders.scripts + '**/*.{js, map}',
    '!' + globalConfig.outputPath + globalConfig.outputFolders.scripts + 'drupal/',
    '!' + globalConfig.outputPath + globalConfig.outputFolders.scripts + 'drupal/**/*.js',
    '!' + globalConfig.outputPath + globalConfig.outputFolders.scripts + '**/*.behaviors.js',
    '!' + globalConfig.outputPath + globalConfig.outputFolders.scripts + 'vendor.js'
  ], {force: true});
}

function cleanImages () {
  return del([globalConfig.outputPath + globalConfig.outputFolders.images + '**/*.{png,gif,jpg}'], {force: true});
}

function cleanFonts () {
  return del([globalConfig.outputPath + globalConfig.outputFolders.fonts + '**/*.{eot,otf,svg,ttf,woff,woff2}'], {force: true});
}

function cleanHtml () {
  return del([globalConfig.outputPath + globalConfig.outputFolders.templates + '*.html'], {force: true});
}

function sasslint () {
  return gulp.src(globalConfig.assetsToLoad.styles)
    .pipe($.if(!TEST, $.plumber()))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
    .on('end', () => {
      $.util.log($.util.colors.green('Sass Lint compiled'));
    });
}

function style () {
  return gulp.src(globalConfig.assetsToLoad.styles)
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'compressed',
      includePaths: [globalConfig.sourcePath + globalConfig.sourceFolders.styles, './node_modules']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 version', 'safari 5', 'ie 9', 'ff 17', 'opera 12.1', 'ios 6', 'android 4'],
      cascade: false
    }))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(globalConfig.outputPath + globalConfig.outputFolders.styles))
    .pipe(browser.stream())
    .on('end', () => {
      $.util.log($.util.colors.green('Styles compiled'));
    });
}

function vendorScripts () {
  return gulp.src(globalConfig.assetsToLoad.vendorScripts)
    .pipe($.plumber())
    .pipe($.concat('vendor.js'))
    .pipe($.babel({presets: ['es2015']}))
    .pipe($.if(PRODUCTION, $.uglify()))
    .pipe(gulp.dest(globalConfig.outputPath + globalConfig.outputFolders.scripts))
    .on('end', function () {
      $.util.log($.util.colors.green('Scripts compiled'));
    });
}

function scripts (done) {
  if (!PRODUCTION) {
    globalConfig.webpackConfig['devtool'] = 'eval-source-map';
    globalConfig.webpackConfig['watch'] = true;
  }
  return gulp.src(globalConfig.assetsToLoad.scripts)
    .pipe(named())
    .pipe(webpack(globalConfig.webpackConfig, null, function (err, stats) {
      $.util.log($.util.colors.green(stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true
      })));
      browser.reload();
      done();
    }))
    .pipe($.if(PRODUCTION, $.uglify()))
    .pipe(gulp.dest(globalConfig.outputPath + globalConfig.outputFolders.scripts))
    .on('end', function () {
      $.util.log($.util.colors.green('Scripts compiled'));
    });
}

function eslint () {
  return gulp.src(globalConfig.sourcePath + globalConfig.sourceFolders.scripts + '**/*')
    .pipe($.if(!TEST, $.plumber()))
    .pipe($.eslint())
    .pipe($.eslint.format())
    .on('end', () => {
      $.util.log($.util.colors.green('ES Lint compiled'));
    });
}

function images () {
  return gulp.src(globalConfig.assetsToLoad.images)
    .pipe($.newer(globalConfig.outputPath + globalConfig.outputFolders.images))
    .pipe(gulp.dest(globalConfig.outputPath + globalConfig.outputFolders.images))
    .on('end', function () {
      $.util.log($.util.colors.green('Images compiled'));
    });
}

function fonts () {
  return gulp.src(globalConfig.assetsToLoad.fonts)
    .pipe($.newer(globalConfig.outputPath + globalConfig.outputFolders.fonts))
    .pipe(gulp.dest(globalConfig.outputPath + globalConfig.outputFolders.fonts))
    .on('end', function () {
      $.util.log($.util.colors.green('Fonts compiled'));
    });
}

function svgFont () {
  return gulp.src([globalConfig.sourcePath + globalConfig.sourceFolders.svg + '*.svg'])
    .pipe($.iconfontCss({
      fontName: globalConfig.svgFontName,
      path: globalConfig.sourcePath + globalConfig.sourceFolders.styles + 'base/_icons.scss',
      targetPath: '../' + globalConfig.sourceFolders.styles + 'base/_icons-rendered.scss',
      fontPath: '../' + globalConfig.sourceFolders.fonts
    }))
    .pipe($.iconfont({
      fontName: globalConfig.svgFontName,
      formats: ['svg', 'ttf', 'eot', 'woff', 'woff2']
    }))
    .pipe(gulp.dest(globalConfig.sourcePath + globalConfig.outputFolders.fonts))
    .on('end', () => {
      $.util.log($.util.colors.green('Icon font compiled'));
    });
}

function html () {
  return gulp.src(globalConfig.assetsToLoad.templates + '.html')
    .pipe($.plumber())
    .pipe(gulp.dest(globalConfig.outputPath + globalConfig.outputFolders.templates))
    .on('end', function () {
      $.util.log($.util.colors.green('Html compiled'));
    });
}

function pug () {
  return gulp.src(globalConfig.assetsToLoad.templates + '.pug')
    .pipe($.plumber())
    .pipe($.pug({pretty: true}))
    .pipe(gulp.dest(globalConfig.outputPath + globalConfig.outputFolders.templates))
    .on('end', function () {
      $.util.log($.util.colors.green('Pug compiled'));
    });
}

function webServer (done) {
  browser.init({
    server: globalConfig.outputPath,
    startPath: globalConfig.outputFolders.templates
  });
  done();
}

function watch () {
  gulp.watch(globalConfig.sourcePath + globalConfig.sourceFolders.scripts + '**/*').on('change', eslint);
  gulp.watch(globalConfig.assetsToLoad.styles).on('change', gulp.series(cleanStyles, sasslint, style));
  gulp.watch(globalConfig.assetsToLoad.images).on('change', gulp.series(cleanImages, images, browser.reload));
  gulp.watch(globalConfig.assetsToLoad.fonts).on('change', gulp.series(cleanFonts, fonts, browser.reload));
  gulp.watch(globalConfig.sourcePath + globalConfig.sourceFolders.styles + 'svg/*.svg', gulp.series(cleanFonts, svgFont, fonts, browser.reload));
  gulp.watch(globalConfig.assetsToLoad.templates + '.html').on('change', gulp.series(cleanHtml, html, browser.reload));
  gulp.watch(globalConfig.assetsToLoad.templates + '.pug').on('change', gulp.series(cleanHtml, pug, browser.reload));
}

// Default task
gulp.task('default',
  gulp.series(
    gulp.parallel(cleanStyles, cleanScriptsVendor, cleanScripts, cleanImages, cleanFonts, cleanHtml),
    gulp.parallel(sasslint, eslint),
    svgFont, style, vendorScripts, eslint, scripts, images, fonts, html, pug, webServer, watch
  )
);

// Build task
gulp.task('build',
  gulp.series(
    gulp.parallel(cleanStyles, cleanScriptsVendor, cleanScripts, cleanImages, cleanFonts, cleanHtml),
    gulp.parallel(sasslint, eslint),
    svgFont, style, vendorScripts, scripts, images, fonts, html, pug)
);

// Build dev
gulp.task('build-dev',
  gulp.series(svgFont, style, vendorScripts, scripts, images, fonts)
);

// Lint Test task
gulp.task('linttest',
  gulp.parallel(sasslint, eslint)
);
