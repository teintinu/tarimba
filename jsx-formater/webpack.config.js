module.exports = {
  entry: __dirname + '/main_src.js',
  output: {
    path: __dirname,
    filename: 'main.js'
  },
  module: {
    loaders: [{
        test: /\.json$/,
        loader: 'json'
      }]
  },
  devtool: 'source-map',
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
