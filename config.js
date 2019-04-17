// Global settings
module.exports = function () {
  const sourcePath = 'src/';
  const outputPath = 'preview/';
  const svgFontName = 'IconFont';

  const sourceFolders = {
    scripts: 'js/',
    styles: 'css/',
    images: 'img/',
    svg: 'svg/',
    fonts: 'fonts/',
    templates: 'templates/'
  };
  const outputFolders = {
    scripts: 'js/',
    styles: 'css/',
    images: 'img/',
    fonts: 'fonts/',
    templates: ''
  };
  const assetsToLoad = {
    vendorScripts: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/foundation-sites/dist/js/plugins/foundation.core.js',
      'node_modules/foundation-sites/dist/js/plugins/foundation.util.mediaQuery.js'
    ],
    scripts: [
      sourcePath + sourceFolders.scripts + 'main.js'
    ],
    styles: [
      sourcePath + sourceFolders.styles + '**/*.sass'
    ],
    images: [
      sourcePath + sourceFolders.images + '**/*'
    ],
    fonts: [
      sourcePath + sourceFolders.fonts + '**/*'
    ],
    templates: [
      sourcePath + sourceFolders.templates + '**/*'
    ]
  };
  const webpackConfig = {
    output: {
      filename: '[name].bundle.js',
      sourceMapFilename: '[name].bundle.map'
    },
    module: {
      loaders: [
        {
          test: /.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015']
          }
        }
      ]
    }
  };

  const globalConfig = {
    sourcePath: sourcePath,
    outputPath: outputPath,
    sourceFolders: sourceFolders,
    outputFolders: outputFolders,
    assetsToLoad: assetsToLoad,
    svgFontName: svgFontName,
    webpackConfig: webpackConfig
  };

  return globalConfig;
};
