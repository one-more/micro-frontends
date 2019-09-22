const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.common');
const cwd = process.cwd();

module.exports = merge(baseConfig, {
    mode: "development",

    devServer: {
        contentBase: path.join(cwd, 'dist'),
        compress: true,
        port: 3000,
        historyApiFallback: true
    },

    devtool: "source-map",
});