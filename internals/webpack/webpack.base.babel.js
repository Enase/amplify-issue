/**
 * COMMON WEBPACK CONFIGURATION
 */
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

// process.traceDeprecation = true;
// process.removeAllListeners('warning');
process.noDeprecation = true;

module.exports = (options) => ({
  stats: options.stats === undefined ? 'normal' : options.stats,
  mode: options.mode,
  entry: options.entry,
  output: {
    // Compile into js/build.js
    path: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
    clean: true,
    ...options.output,
  }, // Merge with env dependent settings
  optimization: options.optimization,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules|bower_components/,
        use: {
          loader: 'babel-loader',
          options: options.babelQuery,
        },
      },
      {
        test: /\.(jpg|png|gif)$/,
        type: 'asset/resource',
      },
      {
        // Preprocess our own .css files
        // This is the place to add your own loaders (e.g. sass/less etc.)
        // for a list of loaders, see https://webpack.js.org/loaders/#styling
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        // Preprocess our own .scss files
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader'],
      },
      {
        // Preprocess 3rd party .css files located in node_modules
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2|svg)$/,
        type: 'asset/inline',
      },
      {
        test: /\.html$/,
        use: 'html-loader',
      },
    ],
  },
  plugins: options.plugins.concat([
    new Dotenv({
      defaults: (() => {
        const processPath = path.resolve(process.cwd(), '.env.defaults');
        if (fs.existsSync(processPath)) {
          return processPath;
        }
        return path.resolve(__dirname, '../../.env.defaults');
      })(),
      path: (() => {
        const filename = `.env.${process.env.ENV_STAGE || 'dev'}`;
        const processPath = path.resolve(process.cwd(), filename);
        if (fs.existsSync(processPath)) {
          return processPath;
        }
        return path.resolve(__dirname, `../../${filename}`);
      })(),
      systemvars: true,
      safe: path.resolve(__dirname, '../../.env.example'),
      silent: false,
    }),
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; Terser will automatically
    // drop any unreachable code.
    new webpack.EnvironmentPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
    }),
  ]),
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.scss', '.react.js'],
    mainFields: ['browser', 'main'],
  },
  node: {
    global: true,
  },
  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  performance: options.performance || {},
});
