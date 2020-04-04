var path = require('path');
/*
var HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: './app/index.html',
    filename: 'index.html',
    inject: 'body'
});
*/

module.exports = {
    mode: 'development',
    node: { global: true, fs: 'empty' },
    entry: './app/index.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    //plugins: [HTMLWebpackPluginConfig]
};
