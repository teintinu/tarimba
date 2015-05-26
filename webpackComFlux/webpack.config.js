module.exports = {
    entry: "./js/main.js",
    output: {
        path: __dirname+"/js",
        filename: "bundle.js"
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: "jsx-loader"
            }
    ]
    }
};

