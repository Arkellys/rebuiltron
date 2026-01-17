const { createHash } = require("crypto");

const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const { isEmpty } = require("lodash");
const ModuleNotFoundPlugin = require("react-dev-utils/ModuleNotFoundPlugin");
const TerserPlugin = require("terser-webpack-plugin");
const { IgnorePlugin } = require("webpack");

const { isEnvDevelopment, isEnvProduction } = require("../helpers/environment");
const paths = require("../helpers/paths");
const { emptyOr, resolveApp } = require("../helpers/utils");


const { excludeInProduction } = require(paths.appConfig);
const { compilerOptions } = require(paths.jsConfig);


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
		...emptyOr(compilerOptions?.paths, {
			alias: Object.entries(compilerOptions.paths).reduce((aliases, [alias, [path]]) => ({
				...aliases,
				[alias]: resolveApp(path)
			}), {})
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
		...emptyOr(isEnvDevelopment, [
			new CaseSensitivePathsPlugin()
		]),
		...emptyOr(isEnvProduction && !isEmpty(excludeInProduction), [
			new IgnorePlugin({
				checkResource(resource) {
					return excludeInProduction.includes(resource);
				}
			})
		]),
		new ModuleNotFoundPlugin(paths.appPath)
	],
	performance: false // Already handled via `FileSizeReporter`
};