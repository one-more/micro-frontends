const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    optimization: {
        usedExports: true,
        runtimeChunk: {
            name: "vendor"
        },
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    enforce: true,
                    chunks: 'all',
                    minSize: 100000,
                    maxSize: 244000,
                }
            },
        },
    },

    performance: {
        maxEntrypointSize: 400000
    },

    plugins: [
        new VueLoaderPlugin(),
    ],

    resolve: {
        extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".svelte", ".vue"],
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
        }
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader",
                options: {
                    "useBabel": true,
                    "babelOptions": {
                        "babelrc": true,
                        "presets": [
                            ["@babel/preset-env", { "targets": "last 2 versions, ie 11", "modules": false }]
                        ]
                    },
                    "babelCore": "@babel/core",
                }
            },

            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },

            {
                test: /\.svelte$/,
                exclude: /node_modules/,
                use: 'svelte-loader'
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },

            {
                test: /\.imba$/,
                loader: 'imba/loader'
            },

            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },

            {
                test: /\.css$/,
                use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
            },
        ]
    },
};