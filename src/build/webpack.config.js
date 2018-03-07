/* eslint-disable no-console */
/* eslint-disable indent */

const path = require('path');
const { getEntriesFromDir } = require('./utils');
const ControllerPlugin = require('./plugins/controllers');
const fs = require('fs');
const node_modules = fs
  .readdirSync(path.resolve(process.cwd(), 'node_modules'))
  .filter(function(x) {
    return x !== '.bin';
  });

module.exports = async function({ watch = false, controllerDir, outputDir }) {
  const entries = await getEntriesFromDir(controllerDir);
  return {
    entry: entries,
    output: {
      path: outputDir,
      filename: '[name].controller.js',
      library: 'controller',
      libraryExport: 'default',
      libraryTarget: 'commonjs2'
    },
    externals: node_modules,
    target: 'node',
    mode: 'production',
    watchOptions: watch
      ? {
          aggregateTimeout: 300,
          poll: 1000,
          ignored: /node_modules/
        }
      : undefined,
    watch,
    plugins: [new ControllerPlugin()],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [
                [
                  require('babel-preset-env'),
                  {
                    targets: {
                      node: '8.0.0'
                    }
                  }
                ]
              ],
              plugins: [
                require('babel-plugin-transform-decorators-legacy').default
              ]
            }
          }
        }
      ]
    }
  };
};
