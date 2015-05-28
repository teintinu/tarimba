
module.exports = {
    entry: __dirname + "/apptask.store",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.store$/,
                loaders: ["tst",'jsx']
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
