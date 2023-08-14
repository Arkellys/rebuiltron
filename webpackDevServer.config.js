const evalSourceMapMiddleware = require("react-dev-utils/evalSourceMapMiddleware");
const ignoredFiles = require("react-dev-utils/ignoredFiles");
const redirectServedPath = require("react-dev-utils/redirectServedPathMiddleware");

const paths = require("./helpers/paths");


module.exports = {
	compress: true,
	static: {
		directory: paths.appPublic,
		publicPath: [paths.basePath],
		watch: {
			ignored: ignoredFiles(paths.appSrc)
		}
	},
	client: {
		overlay: {
			errors: true,
			warnings: false
		}
	},
	historyApiFallback: {
		disableDotRule: true, // Supports route with dots
		index: paths.basePath
	},
	setupMiddlewares: (middlewares, devServer) => ([
		...middlewares,
		evalSourceMapMiddleware(devServer), // Fetches source contents from webpack for the error overlay
		redirectServedPath(paths.basePath) // Redirects to `basePath` if url not match
	])
};
