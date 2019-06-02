/*
Copyright 2019 Gravitational, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const path = require("path");
const webpackBaseCfg = require('./../../../webpack/webpack.base');

const rules = [

  webpackBaseCfg.rules.css({ dev: true }),
  {
    test: /fonts\/(.)+\.(woff|woff2|ttf|eot|svg)/,
    loader: 'url-loader',
    include: /(node_modules)|(.json$)|(assets)/,
    options: {
      limit: 102400, // 100kb
      name: '[name].[ext]',
    }
  },
  webpackBaseCfg.rules.svg,
  {
    test: /\.(js|jsx)$/,
    enforce: "pre",
    loader: "eslint-loader",
    exclude: /(node_modules)|(assets)/,
    options: {
      emitWarning: true
    },
  },
  {
    test: /\.(png|jpg|gif)$/,
    loader: "file-loader",
  },
]

module.exports = (baseConfig, env, defaultConfig) => {

  baseConfig.devtool = false;

  baseConfig.module.rules.push(...rules);

  baseConfig.resolve = {
    ...baseConfig.resolve,
    ...webpackBaseCfg.resolve,
  }

  return baseConfig;
};