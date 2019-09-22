const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.common');

module.exports = merge(baseConfig, {
    mode: "development",

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        historyApiFallback: true
    },

    devtool: "source-map",
});