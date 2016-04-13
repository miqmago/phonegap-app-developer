const merge = require('webpack-merge');
const path = require('path');
const webpack = require('webpack');
const precss = require('precss');
const autoprefixer = require('autoprefixer');

const ENV = require('./env');
const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'www'),
};

const lessLoaders = [
  'style-loader',
  'css-loader',
  'postcss-loader',
  'less-loader',
];

process.env.BABEL_ENV = ENV;

const common = {
  entry: PATHS.src,
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      actions: `${__dirname}/src/actions/`,
      components: `${__dirname}/src/components/`,
      containers: `${__dirname}/src/containers/`,
      reducers: `${__dirname}/src/reducers/`,
      stores: `${__dirname}/src/stores/`,
      utils: `${__dirname}/src/utils/`,
    },
  },
  postcss() {
    return [autoprefixer, precss];
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: lessLoaders.join('!'),
        include: PATHS.src,
        exclude: /less_includes/,
      },
      {
        test: /\.jsx?$/,
        loader: 'babel?cacheDirectory',
        include: PATHS.src,
      },
    ],
  },
};

function mergedConfig() {
  var config = {};
  if (ENV === 'development') {
    config = merge(common, {
      devServer: {
        contentBase: PATHS.build,

        // Enable history API fallback so HTML5 History API based
        // routing works. This is a good default that will come
        // in handy in more complicated setups.
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true,

        // Display only errors to reduce the amount of output.
        stats: 'errors-only',

        // Parse host and port from env so this is easy to customize.
        host: process.env.HOST,
        port: process.env.PORT,
      },
      plugins: [
        new webpack.HotModuleReplacementPlugin(),
      ],
    });
  } else {
    // config can be added here for minifying / etc
    config = merge(common, {});
  }
  return config;
}

module.exports = mergedConfig();