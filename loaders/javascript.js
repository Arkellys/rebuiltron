const paths = require("../helpers/paths");
const { shouldUseSourceMap, isEnvProduction } = require("../helpers/environment");


module.exports = [
	{
		test: /\.(js|jsx)$/,
		exclude: [paths.appNodeModules],
		use: {
			loader: require.resolve("swc-loader"),
			options: {
				jsc: {
					parser: {
						jsx: true
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
		}
	}
];
