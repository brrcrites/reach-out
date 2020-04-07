var path = require('path');

var HTMLWebpackPlugin = require('html-webpack-plugin');

var HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: './app/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    mode: 'development',
    node: { global: true, fs: 'empty' },
    entry: './app/app.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    devServer: {
        contentBase: './build',
        port: 8080
    },
    devtool: 'inline-source-map',
    output: {
        filename: 'client.bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [HTMLWebpackPluginConfig]
};
