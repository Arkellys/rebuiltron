const { createHash } = require("crypto");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const InlineChunkHtmlPlugin = require("react-dev-utils/InlineChunkHtmlPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const paths = require("../helpers/paths");
const { shouldUseSourceMap, isEnvDevelopment, isEnvProduction } = require("../helpers/environment");
const { emptyOr } = require("../helpers/utils");
const imageLoaders = require("../loaders/images");
const styleLoaders = require("../loaders/style");
const javascriptLoaders = require("../loaders/javascript");
const rebuiltronConfig = require("../rebuiltronConfig");


const { srcAlias } = require(paths.appConfig);

module.exports = {
	stats: "errors-warnings",
	bail: isEnvProduction,
	output: {
		path: paths.appBuild,
		pathinfo: isEnvDevelopment,
		publicPath: paths.basePath
	},
	cache: {
		type: "filesystem",
		version: createHash("md5").update(process.env.NODE_ENV.toString()).digest("hex"), // I don't know what I'm doing...
		cacheDirectory: paths.appWebpackCache,
		store: "pack",
		buildDependencies: {
			defaultWebpack: ["webpack/lib/"],
			config: [__filename]
		}
	},
	infrastructureLogging: {
		level: "none"
	},
	resolve: {
		modules: ["node_modules", paths.appNodeModules, paths.appSrc],
		extensions: [".web.js", ".js", ".json", ".jsx", ".node"],
		...emptyOr(srcAlias, {
			alias: {
				[srcAlias]: paths.appSrc
			}
		})
	},
	optimization: {
		minimize: isEnvProduction,
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					parse: {
						ecma: 8
					},
					compress: {
						ecma: 5,
						warnings: false,
						comparisons: false,
						inline: 2
					},
					output: {
						ecma: 5,
						comments: false
					}
				}
			}),
			new CssMinimizerPlugin()
		]
	},
	module: {
		strictExportPresence: true,
		rules: [
			// Handles `node_modules` packages that contain sourcemaps
			...emptyOr(shouldUseSourceMap, [{
				enforce: "pre",
				exclude: /@babel(?:\/|\\{1,2})runtime/,
				test: /\.(js|mjs|jsx|ts|tsx|css)$/,
				loader: require.resolve("source-map-loader")
			}]),
			{
				oneOf: [
					...imageLoaders,
					...javascriptLoaders,
					...styleLoaders,
					{
						// Makes sure the assets get served by `WebpackDevServer`
						exclude: [/^$/, /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
						type: "asset/resource"
					}
				]
			}
		]
	},
	plugins: [
		...emptyOr(isEnvProduction, [
			new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime-.+[.]js/]), // Injects scripts into HTML
			new MiniCssExtractPlugin({
				filename: `${rebuiltronConfig.buildDirs.css}/[name].[contenthash:8].css`,
				chunkFilename: `${rebuiltronConfig.buildDirs.css}/[name].[contenthash:8].chunk.css`
			}),
			new CopyPlugin({
				patterns: [{
					from: paths.appPublic,
					to: paths.appBuild,
					globOptions: {
						ignore: ["**/*.html"]
					}
				}]
			})
		]),
		...emptyOr(isEnvDevelopment, [
			new ReactRefreshWebpackPlugin({ overlay: false }),
			new CaseSensitivePathsPlugin() // Detects case errors in import paths
		]),
		new ModuleNotFoundPlugin(paths.appPath) // Gives some necessary context to module not found errors
	],
	performance: false // Performance processing is already handled via `FileSizeReporter`
};