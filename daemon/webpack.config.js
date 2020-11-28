let path = require('path')
let nodeExternals = require('webpack-node-externals')

let config = {
  // Note that the mode (production/development) is provided via CLI args
  entry: {
    'daemon': './src/main.ts' // path.join(__dirname, 'src', 'main.ts')
  },
  target: 'node',
  output: {
    path: path.join(__dirname, '..', 'dist', 'bin'),
    filename: '[name].js'
  },
  resolve: {
    alias: {
      // '@': path.join(__dirname, 'src')
    },
    extensions: [
      '.js',
      '.json',
      '.ts',
      '.tsx'
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: '/node_modules/',
        use: [
          // If only ts-loader is listeed here, not babel-loader, then TypeScript is concerted
          // to ES6. If babel-loader is included then ES5 is output.
          //
          // Concrete example: 'class' output will be included in ES6 but concerted to the old
          // style anonmous function prototypes if ES5 is produced.
          // {
          //   loader: 'babel-loader'
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  },
  plugins: []
}

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    // Source maps in development are useful but slow.
    // Uncomment either of the following if debugging is needed.
    // In practice though, this seems to make little difference in total time.
    // See https://webpack.js.org/configuration/devtool
    config.devtool = 'source-map'
    // config.devtool = 'eval-source-map'
    // config.devtool = 'cheap-module-eval-source-map'
    config.externals = [nodeExternals()] // exlcude all modules in node_modules
  }

  if (argv.mode === 'production') {
    // No source map in production OR use 'source-map'
    config.externals = ['bufferutil', 'utf-8-validate'] // you may not need this, so probably can delete
  }
  return config
}
