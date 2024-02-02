const paths = require("../helpers/paths");
const { shouldUseSourceMap, isEnvProduction } = require("../helpers/environment");


module.exports = [
	{
		// Converts `import.meta.url` before SWC transpiles so paths using it stay dynamic
		test: /\.js$/,
		include: [paths.electronSrc],
		loader: require.resolve("string-replace-loader"),
		options: {
			search: "import.meta.url",
			replace: "require('url').pathToFileURL(__filename).toString()",
			flags: "g"
		}
	},
	{
		test: /\.(js|jsx)$/,
		exclude: [paths.appNodeModules],
		use: {
			loader: require.resolve("swc-loader"),
			options: {
				jsc: {
					parser: {
						syntax: "ecmascript",
						jsx: true,
						dynamicImport: true
					},
					transform: {
						react: {
							refresh: true,
							runtime: "automatic"
						}
					}
				},
				minify: isEnvProduction,
				sourceMaps: shouldUseSourceMap
			}
		},
		resolve: {
			fullySpecified: false // Allows extensions not to be specified on import
		}
	}
];