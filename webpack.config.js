const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack')

module.exports = {
  entry: './src/enter.js',
  mode: 'development',
  devtool: "source-map",
  devServer:{
    // hotOnly:true,
    https: process.env.NODE_ENV == 'test'? true : false,
    proxy:{
      '/token': {
        target:'http://qianduan.100daishu.com/zego/token',
        // pathRewrite: {'^/zego/token' : ''}
      }
    }
  },
  output: {
    filename: 'bundle.[hash].js',
    path: path.join(__dirname, '/dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './views/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
    })
  ]
};
