module.exports = {
    entry: __dirname + "/apptask.jsx",
    output: {
        path: __dirname + "/apptask/",
        filename: "bundle.js"
    },
    devtool: "source-map",
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
    }
};
