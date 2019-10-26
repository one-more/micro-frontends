const merge = require('webpack-merge'),
    config = require('./webpack.config');

module.exports = merge(config, {
    mode: 'development',
    watch: true
})