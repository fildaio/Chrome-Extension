const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
	mode: "production",
	entry: {
		popup: './src/popup.js',
		inject: './src/inject.js',
		add: "./src/add.js",
		content: "./src/content.js",
		background: "./src/background.js"
	},
	output: {
		filename: 'scripts/[name].js',
		path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-react']
					}
				}
			}
		]
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "public", to: "." }
			]
		})
	],
};