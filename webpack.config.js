const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: "babel-loader",
            },
        ]
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
};