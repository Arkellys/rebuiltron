const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { keys } = require("lodash");

const paths = require("../helpers/paths");
const { isEnvProduction, shouldUseSourceMap } = require("../helpers/environment");
const { emptyOr } = require("../helpers/utils");
const rebuiltronConfig = require("../rebuiltronConfig");
const baseConfig = require("./base");


const { renderers } = require(paths.appConfig);


module.exports = {
	...baseConfig,
	target: "browserslist",
	devtool: shouldUseSourceMap && (isEnvProduction ? "source-map" : "cheap-module-source-map"),
	entry: renderers,
	output: {
		...baseConfig.output,
		filename: `${rebuiltronConfig.buildDirs.js}/${isEnvProduction ? "[name].[contenthash:8].js" : "[name].bundle.js"}`,
		chunkFilename: `${rebuiltronConfig.buildDirs.js}/${isEnvProduction ? "[name].[contenthash:8].chunk.js" : "[name].chunk.js"}`,
		assetModuleFilename: `${rebuiltronConfig.buildDirs.media}/[name].[hash][ext]`
	},
	plugins: [
		...baseConfig.plugins,
		...keys(renderers).map((renderer) => (
			new HtmlWebpackPlugin({
				inject: true,
				template: path.join(paths.appPublic, `${renderer}.html`),
				filename: `${renderer}.html`,
				chunks: [renderer],
				...emptyOr(isEnvProduction, {
					minify: {
						removeComments: true,
						collapseWhitespace: true,
						removeRedundantAttributes: true,
						useShortDoctype: true,
						removeEmptyAttributes: true,
						removeStyleLinkTypeAttributes: true,
						keepClosingSlash: true,
						minifyJS: true,
						minifyCSS: true,
						minifyURLs: true
					}
				})
			})
		))
	]
};