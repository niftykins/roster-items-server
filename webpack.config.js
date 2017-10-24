/* eslint no-var:0 */

var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var nib = require('nib');

var dotenv = require('dotenv');
dotenv.config();

module.exports = function webpackConfig() {
	const src = path.join(__dirname, 'src', 'ui');
	const dist = path.join(__dirname, 'dist', 'ui');
	const publicPath = '/';

	return {
		context: __dirname,

		devtool: 'eval-source-map',

		resolve: {
			modules: [src, 'node_modules']
		},

		entry: [
			path.join(src, 'index')
		],

		output: {
			path: dist,
			filename: 'bundle.js',
			publicPath
		},

		plugins: [
			new webpack.optimize.OccurrenceOrderPlugin(),
			new webpack.HotModuleReplacementPlugin(),

			new HtmlWebpackPlugin({
				template: path.join(src, 'index.ejs'),
				favicon: path.join(src, 'images', 'logo.png')
			}),

			new webpack.DefinePlugin({
				'process.env.HTTP_API_URL': JSON.stringify(process.env.HTTP_API_URL),
				'process.env.WS_API_URL': JSON.stringify(process.env.WS_API_URL),
				'process.env.NODE_ENV': JSON.stringify('development')
			})
		],

		devServer: {
			historyApiFallback: true,
			noInfo: false,
			port: process.env.UI_PORT || 3010,
			hot: true,
			public: 'local.guildsy.io',


			overlay: {
				warnings: true,
				errors: true
			},

			watchOptions: {
				ignored: /node_modules/
			},

			https: {
				key: fs.readFileSync('./ssl/cert.key'),
				cert: fs.readFileSync('./ssl/cert.crt')
			},

			proxy: {
				'/api/ws': {
					target: `https://local.guildsy.io:${process.env.PORT || 3009}`,
					secure: false,
					ws: true
				},
				'/api': {
					target: `https://local.guildsy.io:${process.env.PORT || 3009}`,
					secure: false
				}
			}
		},

		module: {
			loaders: [
				{
					loader: 'babel-loader?cacheDirectory',
					test: /\.jsx?$/,
					include: src
				},

				{
					test: /\.styl$/,
					use: [
						'style-loader',
						'css-loader',
						{
							loader: 'stylus-loader',
							options: {
								use: [nib()],
								import: ['~nib/lib/nib/index.styl']
							}
						}
					]
				},

				{
					loader: 'file-loader?name=images/[name].[ext]',
					test: /\.(jpe?g|png|gif|svg)$/i,
					include: path.join(src, 'images')
				}
			]
		}
	};
};
