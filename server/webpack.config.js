const path = require('path');
const nodeExternals = require('webpack-node-externals');
const dotEnv = require('dotenv-webpack');

module.exports = {
    mode: 'development',
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [nodeExternals()],
    entry: './app/server.js',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    devtool: 'inline-source-map',
    output: {
        filename: 'app.bundle.js',
        path: path.resolve(__dirname, 'build')
    },
    plugins: [
        new dotEnv()
    ]
};

