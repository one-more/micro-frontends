const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.config.common');

module.exports = merge(baseConfig, {
    mode: "production",

    plugins: [
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new CompressionPlugin({
            algorithm: 'brotliCompress',
        }),
    ],

    devtool: false,
});