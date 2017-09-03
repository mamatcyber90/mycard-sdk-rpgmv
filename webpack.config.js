module.exports = {
  entry: './src/main.ts',
  output: {
    filename: 'MyCard.js',
    path: __dirname + '/dist'
    // path: '/Users/zh99998/Documents/Games/Project4/js/plugins'
  },
  resolve: {
    extensions: ['.ts', '.js', '.json'],
    alias: {
      'proxy-polyfill': 'proxy-polyfill/proxy.min.js'
    }
  },
  module: {
    rules: [
      { test: /\.ts?$/, loader: 'awesome-typescript-loader' },
    ]
  },
  node: {
    fs: 'empty'
  },
  externals: {
    'nw.gui': 'commonjs nw.gui'
  }
};
