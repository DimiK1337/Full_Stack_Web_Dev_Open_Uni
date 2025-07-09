const path = require('path')
const webpack = require('webpack')

const config = (env, argv) => {
  console.log('(webpack config) argv.move', argv.mode)
  console.log('(webpack config) env', env)
  console.log('(webpack config) argv', argv)

  const backend_url = argv.mode === 'production'
    ? 'https://notes2023.fly.dev/api/notes'
    : 'http://localhost:3001/notes'

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js'
    },
    devServer: {
      static: path.resolve(__dirname, 'build'),
      compress: true,
      port: 3000
    },
    devtool: 'source-map', // A file that shows the original source code that was transpiled
    module: {
      rules: [
        { // This object contains a single loader
          test: /\.js$/, // Match any file ending with '.js'
          loader: 'babel-loader', // Uses the babel loader to transform JSX into old-school JS
          options: {
            presets: [
              '@babel/preset-env', // Transpiles ES6+ src code to ES5 (needed for most browsers)
              '@babel/preset-react' // Handles JSX
            ]
          }
        },
        { // This object contains multiple loaders -> Must use the 'use' prop
          test: /\.css$/,
          use: [ // 'use' specifies a chain of loaders, which are processed in the reverse of the defined order (right to left)
            'style-loader', // Injects style tags into the DOM, after the CSS has been loaded
            'css-loader' // 
          ]
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        BACKEND_URL: JSON.stringify(backend_url) // Stringify is bc DefinePlugin will return the raw characters, not wrapped in quotes
      })
    ]
  }
}

module.exports = config