const { createHash } = require("crypto");

const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");

const paths = require("../helpers/paths");
const { isEnvDevelopment, isEnvProduction } = require("../helpers/environment");
const { emptyOr } = require("../helpers/utils");


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
		modules: ["node_modules", paths.appNodeModules, paths.src],
		extensions: [".web.js", ".js", ".json", ".jsx", ".node"],
		...emptyOr(srcAlias, {
			alias: {
				[srcAlias]: paths.src
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
			})
		]
	},
	module: {
		strictExportPresence: true
	},
	plugins: [
		...emptyOr(isEnvDevelopment, [new CaseSensitivePathsPlugin()]), // Detects case errors in import paths
		new ModuleNotFoundPlugin(paths.appPath) // Gives some necessary context to module not found errors
	],
	performance: false // Performance processing is already handled via `FileSizeReporter`
};