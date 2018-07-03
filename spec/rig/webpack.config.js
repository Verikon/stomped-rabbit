const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = [{
	entry: path.join(__dirname,'src','index.js'),
	mode: "development",
	output:  {
		path: path.join(__dirname, 'dist'),
		filename: 'test-bundle.js'
	},
	serve: {
		contentBase: path.join(__dirname, 'dist'),
		port: 8000
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.join(__dirname, 'html', 'index.html')
		})
	],
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
			},
		]
	},
	resolve: {
		modules: [
			path.resolve('src'),
			path.resolve('node_modules')
		]
	},
	node: {
		net: 'empty'
	}
}];