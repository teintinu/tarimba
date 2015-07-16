var webpack = require('webpack');

module.exports = {
    entry: __dirname + "/index.jsx",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
             {
                test: /\.jsx?$/,
                loaders: ['babel'], // 'jsx?harmony&stripTypes', 'flowcheck'],
                exclude: /node_modules/
            }
    ]
    },
    devtool: "source-map",
    devServer: {
        contentBase: __dirname,
        hot: false,
        inline: true,
        noInfo: false,
        host: '0.0.0.0',
        port: 3080,
        colors: true
    },
    plugins: [
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 100000000
        })
    ]
};
