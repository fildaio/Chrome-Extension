const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
	mode: "production",
	entry: './src/index.js',
	output: {
		filename: 'scripts/index.js',
		path: path.resolve(__dirname, 'dist')
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "public", to: "." }
			]
		})
	],
};