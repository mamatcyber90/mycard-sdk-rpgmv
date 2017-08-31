module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'MyCard.js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'awesome-typescript-loader' },
    ]
  },
  node: {
    fs: 'empty',
  },
  externals: {
    'nw.gui': 'commonjs nw.gui'
  }
};
