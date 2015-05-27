var path = require("path");
module.exports = {
    devtool: "source-map",
    entry: {
        app: ["./js/ctrl_view.jsx"],
    },
    output: {
        path: path.join(__dirname, "./"),
        filename: "[name].bundle.js",
        sourceMapFilename: "[name].map"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.jsxss?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel?nonStandard'
            },
            {
                test: /\.jsx?$/,
                loaders: ['jsx?harmony&stripTypes', 'flowcheck'],
                exclude: /node_modules/
            }
        ]
    }
};
