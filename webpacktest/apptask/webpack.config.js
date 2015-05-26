module.exports = {
    entry: __dirname + "/apptask.jsx",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: "style!css!less"
            },
            {
                test: /\.jsx?$/,
                loaders: ['jsx?harmony&stripTypes', 'flowcheck'],
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
        noInfo: true,
        host: '0.0.0.0',
        port: 3080,
        colors: true
    }
};
