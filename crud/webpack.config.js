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
                test: /\.less$/,
                loaders: ["style","css", 'autoprefixer-loader?{browsers:["last 1 version", "> 5%", "Android >= 4"]}', "less"]
            },
             {
                test: /\.lessbkp$/,
                loader: "style!css!less"
            },{
                test: /\.jsx?$/,
                loaders: ['babel', 'flux-easy'], // 'jsx?harmony&stripTypes', 'flowcheck'],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loaders: ['babel', 'flux-easy'], // 'jsx?harmony&stripTypes', 'flowcheck'],
                exclude: /node_modules/
            },
            {
                test: /\.json$/,
                loader: "json"
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
