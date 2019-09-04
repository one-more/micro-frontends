const merge = require('webpack-merge'),
    config = require('../../webpack.config');

module.exports = merge(config, {
    mode: 'development',
    entry: __dirname + '/index.ts',
    output: {
        path: __dirname + "/dist",
        filename: 'index.js',
    },
    externals: {
        'vue':'vue',
        '@micro-frontends/core': '@micro-frontends/core',
        'react-dom': 'react-dom',
        'react': 'react',
    }
});