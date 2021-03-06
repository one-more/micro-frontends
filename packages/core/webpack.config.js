const merge = require('webpack-merge'),
    config = require('../../webpack.config');

module.exports = merge(config, {
    entry: __dirname + '/src/index.ts',
    output: {
        path: __dirname + "/dist",
        filename: 'index.js',
        libraryTarget: 'umd'
    },
});