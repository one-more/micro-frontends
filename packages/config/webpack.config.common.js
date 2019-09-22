const VueLoaderPlugin = require('vue-loader/lib/plugin');
const cwd = process.cwd();
const glob = require('glob');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const entryArray = glob.sync(cwd + '/src/pages/**/*.ts').concat(
    glob.sync(cwd + '/src/pages/**/*.js')
);

const entryObject = entryArray.reduce((acc, item) => {
    let name;
    if (path.basename(item).includes("index")) {
        name = item.split(path.sep).slice(-2).shift()
    } else {
        name = path.basename(item).replace(/\.\w+$/, '')
    }
    acc[name] = item;
    return acc;
}, {
    main: "./src/index.ts",
});

module.exports = {
    entry: entryObject,

    output: {
        path: cwd + "/dist",
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js',
        publicPath: '/',
    },

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
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: false,
        }),
        new CopyPlugin([
            { from: 'src/pages/*.html', to: '.', flatten: true }
        ]),
        new WriteFilePlugin(),
    ],

    resolve: {
        extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".svelte", ".vue"],
        alias: {
            'vue$': 'vue/dist/vue.runtime.esm.js',
            '~': path.resolve(cwd, 'src/'),
        },
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