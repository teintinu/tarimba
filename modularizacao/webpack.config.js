module.exports = {
    context: __dirname + "/src",
    entry: "../index.js",
    output: {
        path: './public',
        filename: "[name].bundle.js",
        chunkFilename: "[id].chunk.js"
    },
    module: {
        loaders: [
                {
                    test: /\.json$/,
                    loader: "json"
            }
        ]
            // unknownContextRegExp: /$^/,
            //unknownContextCritical: false,
            //
            //        exprContextRegExp: /$^/,
            //        exprContextCritical: false,
            //
            //
            //        wrappedContextCritical: true
    },
    //    recordsPath: __dirname + '/modnames.js',
    devtool: "source-map",
    devServer: {
        contentBase: __dirname,
        hot: false,
        inline: true,
        noInfo: false,
        host: '0.0.0.0',
        port: 3080,
        colors: true
    }
};
